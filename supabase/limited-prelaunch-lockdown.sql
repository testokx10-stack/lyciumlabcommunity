-- Run after schema.sql, community-interactions.sql, and community-content-management.sql.
-- Blocks browser/API access to community records and media during the limited prelaunch.
DO $$
DECLARE
  table_name TEXT;
  community_tables TEXT[] := ARRAY[
    'profiles',
    'posts',
    'comments',
    'questions',
    'answers',
    'follows',
    'likes',
    'notifications',
    'video_subscriptions',
    'video_comments',
    'question_votes',
    'answer_votes'
  ];
  operation TEXT;
BEGIN
  FOREACH table_name IN ARRAY community_tables LOOP
    FOREACH operation IN ARRAY ARRAY['select', 'insert', 'update', 'delete'] LOOP
      EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        'limited_prelaunch_' || operation,
        table_name
      );
      IF operation = 'select' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false)',
          'limited_prelaunch_' || operation,
          table_name
        );
      ELSIF operation = 'insert' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false)',
          'limited_prelaunch_' || operation,
          table_name
        );
      ELSIF operation = 'update' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)',
          'limited_prelaunch_' || operation,
          table_name
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false)',
          'limited_prelaunch_' || operation,
          table_name
        );
      END IF;
    END LOOP;
  END LOOP;

  UPDATE storage.buckets SET public = false WHERE id = 'community-media';

  FOREACH operation IN ARRAY ARRAY['select', 'insert', 'update', 'delete'] LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON storage.objects',
      'limited_prelaunch_' || operation
    );
    IF operation = 'select' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false)',
        'limited_prelaunch_' || operation
      );
    ELSIF operation = 'insert' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false)',
        'limited_prelaunch_' || operation
      );
    ELSIF operation = 'update' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)',
        'limited_prelaunch_' || operation
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false)',
        'limited_prelaunch_' || operation
      );
    END IF;
  END LOOP;
END;
$$;
