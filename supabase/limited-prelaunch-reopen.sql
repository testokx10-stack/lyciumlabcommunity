-- Run only after signup, storage, content moderation, and two-account RLS tests pass.
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
    END LOOP;
  END LOOP;

  FOREACH operation IN ARRAY ARRAY['select', 'insert', 'update', 'delete'] LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON storage.objects',
      'limited_prelaunch_' || operation
    );
  END LOOP;

  UPDATE storage.buckets SET public = true WHERE id = 'community-media';
END;
$$;
