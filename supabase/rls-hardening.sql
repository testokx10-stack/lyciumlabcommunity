-- Review-first hardening for Supabase.
-- This script is intended to be reviewed and run in the Supabase SQL editor before
-- enabling stricter permissions in production.
-- It does not delete data or change application code.
-- Prerequisites: apply schema.sql, community-interactions.sql, and
-- account-deletion-and-retention.sql first. This file only changes policies
-- on tables those scripts create; it does not create the tables.

-- Ensure RLS is on for all data-bearing tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_audit ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, authenticated self-write.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- A row-level owner policy alone would let users change privileged profile columns,
-- including role. Restrict self-service updates to fields used by profile settings.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, bio, location, avatar_url) ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
REVOKE DELETE ON public.profiles FROM authenticated;

-- Posts: public read; authenticated owner-only write/delete.
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

-- Comments: public read; authenticated owner-only write/delete.
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

-- Questions and answers: public read; authenticated owner-only write/delete.
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create questions" ON public.questions;
CREATE POLICY "Users can create questions"
  ON public.questions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own questions" ON public.questions;
CREATE POLICY "Users can update own questions"
  ON public.questions FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own questions" ON public.questions;
CREATE POLICY "Users can delete own questions"
  ON public.questions FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Answers are viewable by everyone" ON public.answers;
CREATE POLICY "Answers are viewable by everyone"
  ON public.answers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create answers" ON public.answers;
CREATE POLICY "Users can create answers"
  ON public.answers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own answers" ON public.answers;
CREATE POLICY "Users can update own answers"
  ON public.answers FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own answers" ON public.answers;
CREATE POLICY "Users can delete own answers"
  ON public.answers FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

-- Follows and likes: public read; authenticated self-managed.
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can like" ON public.likes;
CREATE POLICY "Users can like"
  ON public.likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike" ON public.likes;
CREATE POLICY "Users can unlike"
  ON public.likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Notifications: owner-only access.
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create notifications as themselves" ON public.notifications;
CREATE POLICY "Users can create notifications as themselves"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Video subscriptions: owner-only read/write/delete.
DROP POLICY IF EXISTS "Subscriptions viewable by user" ON public.video_subscriptions;
CREATE POLICY "Subscriptions viewable by user"
  ON public.video_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can subscribe" ON public.video_subscriptions;
CREATE POLICY "Users can subscribe"
  ON public.video_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsubscribe" ON public.video_subscriptions;
CREATE POLICY "Users can unsubscribe"
  ON public.video_subscriptions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Video comments and votes: public read, authenticated owner-only writes.
DROP POLICY IF EXISTS "Video comments are viewable by everyone" ON public.video_comments;
CREATE POLICY "Video comments are viewable by everyone"
  ON public.video_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create their own video comments" ON public.video_comments;
CREATE POLICY "Users can create their own video comments"
  ON public.video_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own video comments" ON public.video_comments;
CREATE POLICY "Users can update their own video comments"
  ON public.video_comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own video comments" ON public.video_comments;
CREATE POLICY "Users can delete their own video comments"
  ON public.video_comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Question votes are viewable by everyone" ON public.question_votes;
CREATE POLICY "Question votes are viewable by everyone"
  ON public.question_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can cast their own question votes" ON public.question_votes;
CREATE POLICY "Users can cast their own question votes"
  ON public.question_votes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can change their own question votes" ON public.question_votes;
CREATE POLICY "Users can change their own question votes"
  ON public.question_votes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own question votes" ON public.question_votes;
CREATE POLICY "Users can remove their own question votes"
  ON public.question_votes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Answer votes are viewable by everyone" ON public.answer_votes;
CREATE POLICY "Answer votes are viewable by everyone"
  ON public.answer_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can cast their own answer votes" ON public.answer_votes;
CREATE POLICY "Users can cast their own answer votes"
  ON public.answer_votes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can change their own answer votes" ON public.answer_votes;
CREATE POLICY "Users can change their own answer votes"
  ON public.answer_votes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own answer votes" ON public.answer_votes;
CREATE POLICY "Users can remove their own answer votes"
  ON public.answer_votes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Deletion requests: user sees own records, admins can review.
DROP POLICY IF EXISTS "Users can insert own deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Users can insert own deletion requests"
  ON public.account_deletion_requests FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND lower(email) = lower(auth.jwt() ->> 'email')
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

-- Retention and audit tables: readability + admin management + user self-view for their entries.
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

DROP POLICY IF EXISTS "Users can create their own audit entries" ON public.data_processing_audit;
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

-- Storage: public readable for profile and community media, but upload/delete restricted to owner folder.
DROP POLICY IF EXISTS "Profile photos are publicly viewable" ON storage.objects;
CREATE POLICY "Profile photos are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
CREATE POLICY "Users can upload their own profile photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
CREATE POLICY "Users can update their own profile photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profile-avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'profile-avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Community media is publicly viewable" ON storage.objects;
CREATE POLICY "Community media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-media');

DROP POLICY IF EXISTS "Users can upload their own community media" ON storage.objects;
CREATE POLICY "Users can upload their own community media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can delete their own community media" ON storage.objects;
CREATE POLICY "Users can delete their own community media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'community-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Optional: keep default public access limited and avoid anonymous writes.
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.posts FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.comments FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.questions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.answers FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.follows FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.likes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.video_subscriptions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.video_comments FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.question_votes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.answer_votes FROM anon;

GRANT UPDATE ON public.account_deletion_requests TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.data_processing_audit FROM authenticated;

-- Accounts should not be auto-deleted in this script.
-- Deletions should only be processed via a verified admin review workflow.
