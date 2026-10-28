-- Safe, review-first SQL for account deletion workflow and retention reporting.
-- This file is intended to be reviewed and run in the Supabase SQL editor before enabling
-- the deletion flow in production. It does not delete data automatically.

CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'approved', 'completed', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  deletion_scheduled_for TIMESTAMPTZ,
  notes TEXT,
  request_metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT NOT NULL,
  data_category TEXT NOT NULL,
  retention_days INTEGER CHECK (retention_days IS NULL OR retention_days >= 0),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.retention_policies
  ALTER COLUMN retention_days DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS retention_policies_entity_category_key
  ON public.retention_policies (entity_name, data_category);

CREATE TABLE IF NOT EXISTS public.data_processing_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Users can insert own deletion requests"
  ON public.account_deletion_requests FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND deletion_scheduled_for IS NULL
    AND notes IS NULL
  );

DROP POLICY IF EXISTS "Users can view own deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Users can view own deletion requests"
  ON public.account_deletion_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage deletion requests" ON public.account_deletion_requests;
DROP POLICY IF EXISTS "Admins can view deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can view deletion requests"
  ON public.account_deletion_requests FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "Admins can review deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can review deletion requests"
  ON public.account_deletion_requests FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "Retention policies are readable" ON public.retention_policies;
CREATE POLICY "Retention policies are readable"
  ON public.retention_policies FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage retention policies" ON public.retention_policies;
CREATE POLICY "Admins can manage retention policies"
  ON public.retention_policies FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "Users can view own audit entries" ON public.data_processing_audit;
CREATE POLICY "Users can view own audit entries"
  ON public.data_processing_audit FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view audit entries" ON public.data_processing_audit;
CREATE POLICY "Admins can view audit entries"
  ON public.data_processing_audit FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
    )
  );

CREATE OR REPLACE FUNCTION public.log_account_deletion_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.data_processing_audit (user_id, action, details)
  VALUES (
    NEW.user_id,
    CASE WHEN TG_OP = 'INSERT' THEN 'account_deletion_requested' ELSE 'account_deletion_request_updated' END,
    jsonb_build_object(
      'request_id', NEW.id,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.log_account_deletion_request() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS log_account_deletion_request ON public.account_deletion_requests;
CREATE TRIGGER log_account_deletion_request
  AFTER INSERT OR UPDATE OF status ON public.account_deletion_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_account_deletion_request();

GRANT SELECT ON public.retention_policies TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.account_deletion_requests TO authenticated;
GRANT SELECT ON public.data_processing_audit TO authenticated;
REVOKE DELETE ON public.account_deletion_requests FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.data_processing_audit FROM authenticated;

INSERT INTO public.retention_policies (entity_name, data_category, retention_days, description)
VALUES
  ('account', 'identity_and_credentials', NULL, 'Retention period to be set by the controller after review of operational and legal requirements.'),
  ('profile', 'public_profile_data', NULL, 'Retention period to be set by the controller after review of operational and legal requirements.'),
  ('community_content', 'posts_comments_and_reactions', NULL, 'Retention period to be set by the controller after review of operational and legal requirements.'),
  ('storage_files', 'uploaded_images_and_media', NULL, 'Retention period to be set by the controller after review of operational and legal requirements.'),
  ('audit', 'security_and_access_events', NULL, 'Retention period to be set by the controller after review of operational and legal requirements.')
ON CONFLICT (entity_name, data_category) DO UPDATE
SET description = EXCLUDED.description;
