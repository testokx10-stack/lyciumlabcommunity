-- Run once in the Supabase SQL Editor to enable questions, votes, follows,
-- video subscriptions, and comments on the site's built-in videos.

ALTER TABLE public.video_subscriptions
  ALTER COLUMN video_id TYPE TEXT USING video_id::text;

INSERT INTO public.profiles (id, full_name, avatar_url, location, role)
SELECT
  users.id,
  users.raw_user_meta_data->>'full_name',
  users.raw_user_meta_data->>'avatar_url',
  users.raw_user_meta_data->>'location',
  'member'
FROM auth.users AS users
LEFT JOIN public.profiles AS profiles ON profiles.id = users.id
WHERE profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_comments_video_created
  ON public.video_comments(video_id, created_at);

ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Video comments are viewable by everyone" ON public.video_comments;
CREATE POLICY "Video comments are viewable by everyone"
  ON public.video_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create their own video comments" ON public.video_comments;
CREATE POLICY "Users can create their own video comments"
  ON public.video_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own video comments" ON public.video_comments;
CREATE POLICY "Users can delete their own video comments"
  ON public.video_comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);
GRANT SELECT ON public.video_comments TO anon, authenticated;
GRANT INSERT, DELETE ON public.video_comments TO authenticated;

CREATE TABLE IF NOT EXISTS public.question_votes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
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
GRANT SELECT ON public.question_votes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.question_votes TO authenticated;

CREATE TABLE IF NOT EXISTS public.answer_votes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, answer_id)
);

ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;
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
GRANT SELECT ON public.answer_votes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.answer_votes TO authenticated;

UPDATE public.questions AS questions
SET answers_count = (
  SELECT COUNT(*) FROM public.answers AS answers
  WHERE answers.question_id = questions.id
), answered = EXISTS (
  SELECT 1 FROM public.answers AS answers
  WHERE answers.question_id = questions.id
);

CREATE OR REPLACE FUNCTION public.update_question_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_score INTEGER := 0;
  new_score INTEGER := 0;
  target_id UUID;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    old_score := CASE OLD.vote WHEN 'up' THEN 1 ELSE -1 END;
    target_id := OLD.question_id;
  END IF;
  IF TG_OP <> 'DELETE' THEN
    new_score := CASE NEW.vote WHEN 'up' THEN 1 ELSE -1 END;
    target_id := NEW.question_id;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.question_id <> NEW.question_id THEN
    UPDATE public.questions SET votes_count = votes_count - old_score WHERE id = OLD.question_id;
    UPDATE public.questions SET votes_count = votes_count + new_score WHERE id = NEW.question_id;
    RETURN NEW;
  END IF;
  UPDATE public.questions
    SET votes_count = votes_count + new_score - old_score
    WHERE id = target_id;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS question_votes_update_count ON public.question_votes;
CREATE TRIGGER question_votes_update_count
  AFTER INSERT OR UPDATE OR DELETE ON public.question_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_question_vote_count();

CREATE OR REPLACE FUNCTION public.update_answer_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_score INTEGER := 0;
  new_score INTEGER := 0;
  target_id UUID;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    old_score := CASE OLD.vote WHEN 'up' THEN 1 ELSE -1 END;
    target_id := OLD.answer_id;
  END IF;
  IF TG_OP <> 'DELETE' THEN
    new_score := CASE NEW.vote WHEN 'up' THEN 1 ELSE -1 END;
    target_id := NEW.answer_id;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.answer_id <> NEW.answer_id THEN
    UPDATE public.answers SET votes_count = votes_count - old_score WHERE id = OLD.answer_id;
    UPDATE public.answers SET votes_count = votes_count + new_score WHERE id = NEW.answer_id;
    RETURN NEW;
  END IF;
  UPDATE public.answers
    SET votes_count = votes_count + new_score - old_score
    WHERE id = target_id;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS answer_votes_update_count ON public.answer_votes;
CREATE TRIGGER answer_votes_update_count
  AFTER INSERT OR UPDATE OR DELETE ON public.answer_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_answer_vote_count();

CREATE OR REPLACE FUNCTION public.update_question_answer_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.questions
      SET answers_count = answers_count + 1, answered = TRUE
      WHERE id = NEW.question_id;
    RETURN NEW;
  END IF;
  UPDATE public.questions
    SET answers_count = GREATEST(0, answers_count - 1),
        answered = EXISTS (
          SELECT 1 FROM public.answers WHERE question_id = OLD.question_id
        )
    WHERE id = OLD.question_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS answers_update_question_count ON public.answers;
CREATE TRIGGER answers_update_question_count
  AFTER INSERT OR DELETE ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.update_question_answer_count();

CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  END IF;
  UPDATE public.posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS comments_update_post_count ON public.comments;
CREATE TRIGGER comments_update_post_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();
