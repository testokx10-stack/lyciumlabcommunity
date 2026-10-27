-- Run after schema.sql and community-interactions.sql.
-- Enables owners to edit/delete their comments and delete their own posts.

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own video comments" ON public.video_comments;
CREATE POLICY "Users can update their own video comments"
  ON public.video_comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own video comments" ON public.video_comments;
CREATE POLICY "Users can delete their own video comments"
  ON public.video_comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

GRANT DELETE ON public.posts TO authenticated;
GRANT UPDATE, DELETE ON public.comments TO authenticated;
GRANT UPDATE, DELETE ON public.video_comments TO authenticated;
