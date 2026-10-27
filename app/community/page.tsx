'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, ImagePlus, Send, TrendingUp, HelpCircle, Users, Flame, BadgeCheck, Bookmark, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { FollowButton } from '@/components/site/follow-button';
import { COMMUNITY_MEDIA_ACCEPT, getCommunityMediaType, MAX_COMMUNITY_MEDIA_SIZE } from '@/lib/community-media';
import { removeCommunityMedia, uploadCommunityMedia } from '@/lib/community-media-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberCard } from '@/components/site/member-card';
import { questions, members, formatCount, timeAgo } from '@/lib/data';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'feed', label: 'Fil d\'actualité', icon: Users },
  { key: 'qa', label: 'Questions & réponses', icon: HelpCircle },
  { key: 'trending', label: 'Tendances', icon: Flame },
];

type FeedPost = {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  tag: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  author: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
};

type CommunityQuestion = {
  id: string;
  title: string;
  body: string;
  tag: string;
  answered: boolean;
  created_at: string;
  views_count: number;
  answers_count: number;
  votes_count: number;
  user_vote: 'up' | 'down' | null;
  author: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
};

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [postError, setPostError] = useState('');
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [questionPosting, setQuestionPosting] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=50');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Impossible de charger les publications.');
        }
        setFeedPosts(result.posts || []);
        setPostsError('');
      } catch (error) {
        console.error('Failed to load posts:', error);
        setPostsError(error instanceof Error ? error.message : 'Impossible de charger les publications.');
      } finally {
        setPostsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  useEffect(() => {
    if (tab !== 'qa') return;
    let active = true;
    setQuestionsLoading(true);
    fetch('/api/questions?limit=50')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger les questions.');
        if (active) {
          setCommunityQuestions(result.questions || []);
          setQuestionError('');
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load questions:', error);
        if (active) setQuestionError(error instanceof Error ? error.message : 'Impossible de charger les questions.');
      })
      .finally(() => {
        if (active) setQuestionsLoading(false);
      });
    return () => { active = false; };
  }, [tab]);

  const toggleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' });
      if (res.ok) {
        setLikedPosts(prev => {
          const next = new Set(prev);
          if (next.has(postId)) next.delete(postId);
          else next.add(postId);
          return next;
        });
      }
    } catch (e) {
      console.error('Failed to toggle like:', e);
    }
  };

  const toggleBookmark = async (postId: string) => {
    setBookmarkedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const submitPost = async (content: string, media: File | null) => {
    if ((!content.trim() && !media) || posting || !user) return false;
    setPostError('');
    setPosting(true);
    let uploadedMediaPath: string | undefined;
    try {
      const uploadedMedia = media ? await uploadCommunityMedia(media, user, setUploadProgress) : null;
      uploadedMediaPath = uploadedMedia?.path;
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          media_path: uploadedMedia?.path,
          media_type: uploadedMedia?.mediaType,
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Impossible de publier. Veuillez réessayer.');
      }
      setFeedPosts(prev => [result.post, ...prev]);
      setSelectedMedia(null);
      setPostContent('');
      return true;
    } catch (e) {
      console.error('Failed to post:', e);
      if (uploadedMediaPath) await removeCommunityMedia(uploadedMediaPath);
      setPostError(e instanceof Error ? e.message : 'Impossible de publier. Veuillez réessayer.');
      return false;
    } finally {
      setPosting(false);
      setUploadProgress(null);
    }
  };

  const submitQuestion = async (title: string, body: string, tag: string) => {
    if (!title.trim() || !body.trim() || !tag || questionPosting) return false;
    setQuestionPosting(true);
    setQuestionError('');
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, tag })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de publier la question.');
      setCommunityQuestions((previous) => [{
        ...result.question,
        answers_count: 0,
        votes_count: 0,
        user_vote: null,
      }, ...previous]);
      return true;
    } catch (error) {
      console.error('Failed to post question:', error);
      setQuestionError(error instanceof Error ? error.message : 'Impossible de publier la question.');
      return false;
    } finally {
      setQuestionPosting(false);
    }
  };

  const voteQuestion = async (questionId: string, vote: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/questions/${questionId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de voter.');
      setCommunityQuestions((previous) => previous.map((question) => {
        if (question.id !== questionId) return question;
        const score = (value: 'up' | 'down' | null) => value === 'up' ? 1 : value === 'down' ? -1 : 0;
        return {
          ...question,
          votes_count: question.votes_count + score(result.vote) - score(question.user_vote),
          user_vote: result.vote,
        };
      }));
      setQuestionError('');
    } catch (error) {
      console.error('Failed to vote:', error);
      setQuestionError(error instanceof Error ? error.message : 'Impossible de voter.');
    }
  };

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="max-w-2xl mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Community</h1>
        <p className="text-muted-foreground mt-2">
          Share tips, ask questions, and collaborate with farmers, researchers, and agricultural enthusiasts worldwide.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="min-w-0 space-y-6">
          {/* Composer */}
          {tab !== 'qa' && (
            <Card className="p-4">
              {authLoading ? (
                <p className="text-sm text-muted-foreground">Chargement du compte...</p>
              ) : user ? (
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>{(user.user_metadata.full_name || user.email || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={postContent}
                      onChange={(event) => setPostContent(event.target.value)}
                      placeholder="Share a tip, discovery, or question with the community..."
                      className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[48px]"
                    />
                    {selectedMedia && (
                      <SelectedMediaPreview file={selectedMedia} onRemove={() => setSelectedMedia(null)} />
                    )}
                    {postError && <p role="alert" className="text-sm text-destructive mt-2">{postError}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1">
                        <input
                          ref={mediaInputRef}
                          type="file"
                          accept={COMMUNITY_MEDIA_ACCEPT}
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            event.target.value = '';
                            if (!file) return;
                            if (!file.size) {
                              setPostError('That file is empty. Choose another image or video.');
                              return;
                            }
                            if (!getCommunityMediaType(file)) {
                              setPostError('Choose a JPEG, PNG, GIF, or WebP image, or an MP4, WebM, or MOV video.');
                              return;
                            }
                            if (file.size > MAX_COMMUNITY_MEDIA_SIZE) {
                              setPostError('Files must be 50 MB or smaller.');
                              return;
                            }
                            setPostError('');
                            setSelectedMedia(file);
                          }}
                        />
                        <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => mediaInputRef.current?.click()}>
                          <ImagePlus size={16} /> Photo or video
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1.5"
                        disabled={(!postContent.trim() && !selectedMedia) || posting}
                        onClick={async () => {
                          await submitPost(postContent, selectedMedia);
                        }}
                      >
                        <Send size={15} /> {posting ? (uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Publishing...') : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link> to share with the community.
                </p>
              )}
            </Card>
          )}

          {tab === 'feed' && (
            postsLoading ? (
              <p className="text-sm text-muted-foreground">Loading community posts...</p>
            ) : postsError ? (
              <p role="alert" className="text-sm text-destructive">{postsError}</p>
            ) : (
              <Feed posts={feedPosts} likedPosts={likedPosts} bookmarkedPosts={bookmarkedPosts} onToggleLike={toggleLike} onToggleBookmark={toggleBookmark} />
            )
          )}
          {tab === 'qa' && (
            <QA
              user={user}
              authLoading={authLoading}
              questions={communityQuestions}
              loading={questionsLoading}
              error={questionError}
              posting={questionPosting}
              onVoteQuestion={voteQuestion}
              onSubmitQuestion={submitQuestion}
              onAnswerCreated={(questionId) => {
                setCommunityQuestions((previous) => previous.map((question) => (
                  question.id === questionId
                    ? { ...question, answers_count: question.answers_count + 1, answered: true }
                    : question
                )));
              }}
            />
          )}
          {tab === 'trending' && (
            postsLoading ? (
              <p className="text-sm text-muted-foreground">Loading community posts...</p>
            ) : postsError ? (
              <p role="alert" className="text-sm text-destructive">{postsError}</p>
            ) : (
              <Feed trendingOnly posts={feedPosts} likedPosts={likedPosts} bookmarkedPosts={bookmarkedPosts} onToggleLike={toggleLike} onToggleBookmark={toggleBookmark} />
            )
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-1.5 mb-4"><TrendingUp size={16} className="text-accent" /> Active discussions</h3>
            <div className="space-y-4">
              {questions.slice(0, 3).map((q) => (
                <Link key={q.id} href="/community" className="group block">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">{q.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 tabular-nums">{q.answers} answers · {formatCount(q.views)} views</p>
                </Link>
              ))}
            </div>
          </Card>

          <div>
            <h3 className="font-semibold mb-4">Members to follow</h3>
            <div className="grid grid-cols-2 gap-3">
              {members.filter((m) => m.role === 'expert').slice(0, 2).map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>

          <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="font-semibold">Community Guidelines</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Keep it evidence-based, respectful, and practical. Cite sources when you can, and distinguish research from personal experience.
            </p>
            <Button size="sm" variant="outline" className="mt-3 w-full">Read guidelines</Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SelectedMediaPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const mediaType = getCommunityMediaType(file);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative mt-3 max-w-md overflow-hidden rounded-xl border border-border/60 bg-secondary/30">
      {previewUrl && mediaType === 'video' ? (
        <video src={previewUrl} controls preload="metadata" className="max-h-64 w-full bg-black" />
      ) : previewUrl ? (
        <img src={previewUrl} alt="Selected post attachment preview" className="max-h-64 w-full object-contain" />
      ) : null}
      <div className="flex items-center justify-between gap-3 p-2 text-xs text-muted-foreground">
        <span className="truncate">{file.name}</span>
        <button type="button" onClick={onRemove} aria-label="Remove attachment" className="shrink-0 rounded p-1 hover:bg-secondary">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function Feed({
  trendingOnly = false,
  posts,
  likedPosts,
  bookmarkedPosts,
  onToggleLike,
  onToggleBookmark
}: {
  trendingOnly?: boolean;
  posts: FeedPost[];
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
}) {
  const list = trendingOnly
    ? [...posts].sort((a, b) => b.likes_count - a.likes_count)
    : posts;
  return (
    <div className="space-y-5">
      {list.map((post) => {
        const authorName = post.author?.full_name || post.author?.username || 'Community member';
        const isLiked = likedPosts.has(post.id);
        const isBookmarked = bookmarkedPosts.has(post.id);
        return (
          <Card key={post.id} className="p-5 card-hover">
            <div className="flex items-start gap-3">
              <Link href={`/profile/${post.author_id}`}>
                <Avatar className="h-11 w-11">
                  <AvatarImage src={post.author?.avatar_url || undefined} alt={authorName} />
                  <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/profile/${post.author_id}`} className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                    {authorName}
                    {(post.author?.role === 'expert' || post.author?.role === 'moderator') && <BadgeCheck size={14} className="text-accent" />}
                  </Link>
                  {post.author?.username && <span className="text-sm text-muted-foreground">@{post.author.username}</span>}
                  <span className="text-sm text-muted-foreground">· {timeAgo(post.created_at)}</span>
                  {post.author && <FollowButton profileId={post.author.id} />}
                </div>
                <p className="text-sm mt-2.5 leading-relaxed">{post.content}</p>
                {(post.media_url || post.image_url) && (
                  post.media_type === 'video' ? (
                    <video
                      src={post.media_url || undefined}
                      controls
                      preload="metadata"
                      className="mt-3 w-full max-h-[28rem] rounded-xl border border-border/60 bg-black"
                    >
                      Your browser does not support embedded videos.
                    </video>
                  ) : (
                    <div className="mt-3 overflow-hidden rounded-xl border border-border/60">
                      <img src={post.media_url || post.image_url || ''} alt="" className="w-full max-h-80 object-cover" loading="lazy" />
                    </div>
                  )
                )}
                {post.tag && (
                  <Badge variant="secondary" className="mt-3 font-normal">#{post.tag}</Badge>
                )}
                <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground">
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 hover:text-primary transition-colors ${isLiked ? 'text-primary' : ''}`}
                  >
                    <Heart size={16} className={isLiked ? 'fill-current' : ''} /> {post.likes_count}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageCircle size={16} /> {post.comments_count}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Share2 size={16} /> {post.shares_count}
                  </button>
                  <button
                    onClick={() => onToggleBookmark(post.id)}
                    className={`flex items-center gap-1.5 hover:text-primary transition-colors ml-auto ${bookmarkedPosts.has(post.id) ? 'text-primary' : ''}`}
                  >
                    <Bookmark size={16} className={bookmarkedPosts.has(post.id) ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
      {!list.length && <p className="text-sm text-muted-foreground">No posts yet. Be the first to share something.</p>}
    </div>
  );
}

function QA({
  user,
  authLoading,
  questions,
  loading,
  error,
  posting,
  onVoteQuestion,
  onSubmitQuestion,
  onAnswerCreated,
}: {
  user: ReturnType<typeof useAuth>['user'];
  authLoading: boolean;
  questions: CommunityQuestion[];
  loading: boolean;
  error: string;
  posting: boolean;
  onVoteQuestion: (questionId: string, vote: 'up' | 'down') => void;
  onSubmitQuestion: (title: string, body: string, tag: string) => Promise<boolean>;
  onAnswerCreated: (questionId: string) => void;
}) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [questionTag, setQuestionTag] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <div className="space-y-4">
      <Card className="p-4">
        {authLoading ? <p className="text-sm text-muted-foreground">Chargement du compte...</p> : !user ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour poser une question.
          </p>
        ) : <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user.user_metadata.avatar_url || undefined} alt={user.user_metadata.full_name || 'Vous'} />
            <AvatarFallback>{(user.user_metadata.full_name || user.email || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <form className="flex-1" onSubmit={async (event) => {
            event.preventDefault();
            setFormError('');
            if (!questionTitle.trim() || !questionBody.trim() || !questionTag) {
              setFormError('Ajoutez un titre, des détails et un sujet.');
              return;
            }
            if (await onSubmitQuestion(questionTitle, questionBody, questionTag)) {
              setQuestionTitle('');
              setQuestionBody('');
              setQuestionTag('');
            }
          }}>
            <input
              maxLength={200}
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="Posez une question agricole ou scientifique..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground border-b border-border pb-2 focus:border-primary transition-colors"
            />
            <textarea
              maxLength={10000}
              value={questionBody}
              onChange={(e) => setQuestionBody(e.target.value)}
              placeholder="Ajoutez des détails..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground border-b border-border pb-2 focus:border-primary transition-colors mt-2"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <select
                value={questionTag}
                onChange={(e) => setQuestionTag(e.target.value)}
                className="text-xs text-muted-foreground bg-transparent border-0 outline-none">
                <option value="">Choisir un sujet</option>
                {['soil-science', 'irrigation', 'pest-management', 'crop-production', 'fertilizers', 'greenhouse', 'agtech', 'sustainable', 'research'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <Button size="sm" type="submit" className="gap-1.5" disabled={posting}>
                <Send size={14} /> {posting ? 'Publication...' : 'Publier la question'}
              </Button>
            </div>
            {formError && <p role="alert" className="mt-2 text-sm text-destructive">{formError}</p>}
          </form>
        </div>}
      </Card>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Chargement des questions...</p> : questions.map((question) => {
        const authorName = question.author?.full_name || question.author?.username || 'Membre';
        return (
          <Card key={question.id} className="p-5 card-hover">
            <div className="flex gap-4">
              <div className="flex flex-col items-center text-center shrink-0">
                <button
                  type="button"
                  disabled={!user}
                  aria-label="Voter pour cette question"
                  onClick={() => onVoteQuestion(question.id, 'up')}
                  className={`grid h-8 w-8 place-items-center rounded-md hover:bg-secondary hover:text-primary transition-colors ${question.user_vote === 'up' ? 'text-primary' : 'text-muted-foreground'}`}>▲</button>
                <span className="text-sm font-semibold tabular-nums my-0.5">{question.votes_count}</span>
                <button
                  type="button"
                  disabled={!user}
                  aria-label="Voter contre cette question"
                  onClick={() => onVoteQuestion(question.id, 'down')}
                  className={`grid h-8 w-8 place-items-center rounded-md hover:bg-secondary hover:text-primary transition-colors ${question.user_vote === 'down' ? 'text-primary' : 'text-muted-foreground'}`}>▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={question.answered ? 'default' : 'secondary'} className={question.answered ? 'gap-1 bg-accent border-0' : 'font-normal'}>
                    {question.answered ? 'Répondue' : 'Ouverte'}
                  </Badge>
                  <Badge variant="outline" className="font-normal">#{question.tag}</Badge>
                </div>
                <h3 className="font-medium text-lg leading-snug mt-2">{question.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">{question.body}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={question.author?.avatar_url || undefined} alt={authorName} />
                    <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{authorName}</span>
                  <span>·</span>
                  <span className="tabular-nums">{question.answers_count} réponses</span>
                  <span>·</span>
                  <span className="tabular-nums">{formatCount(question.views_count)} vues</span>
                  <span>·</span>
                  <span>{timeAgo(question.created_at)}</span>
                </div>
                {!user && <p className="mt-3 text-xs text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour voter ou répondre.</p>}
                <QuestionAnswers questionId={question.id} user={user} onAnswerCreated={() => onAnswerCreated(question.id)} />
              </div>
            </div>
          </Card>
        );
      })}
      {!loading && !questions.length && <p className="text-sm text-muted-foreground">Aucune question pour le moment. Posez la première !</p>}
    </div>
  );
}

type QuestionAnswer = {
  id: string;
  body: string;
  created_at: string;
  votes_count: number;
  user_vote: 'up' | 'down' | null;
  author: { full_name: string | null; username: string | null; avatar_url: string | null } | null;
};

function QuestionAnswers({
  questionId,
  user,
  onAnswerCreated,
}: {
  questionId: string;
  user: ReturnType<typeof useAuth>['user'];
  onAnswerCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAnswers = async () => {
    setOpen(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de charger les réponses.');
      setAnswers(result.answers || []);
    } catch (requestError) {
      console.error('Failed to load answers:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les réponses.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de publier la réponse.');
      setAnswers((previous) => [...previous, { ...result.answer, votes_count: 0, user_vote: null }]);
      onAnswerCreated();
      setBody('');
    } catch (requestError) {
      console.error('Failed to submit answer:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de publier la réponse.');
    } finally {
      setSubmitting(false);
    }
  };

  const voteAnswer = async (answerId: string, vote: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/answers/${answerId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de voter.');
      setAnswers((previous) => previous.map((answer) => {
        if (answer.id !== answerId) return answer;
        const score = (value: 'up' | 'down' | null) => value === 'up' ? 1 : value === 'down' ? -1 : 0;
        return { ...answer, votes_count: answer.votes_count + score(result.vote) - score(answer.user_vote), user_vote: result.vote };
      }));
    } catch (requestError) {
      console.error('Failed to vote on answer:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de voter.');
    }
  };

  return (
    <div className="mt-4">
      <Button type="button" size="sm" variant="outline" onClick={open ? () => setOpen(false) : loadAnswers}>
        {open ? 'Masquer les réponses' : 'Voir les réponses'}
      </Button>
      {open && (
        <div className="mt-3 space-y-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {loading ? <p className="text-sm text-muted-foreground">Chargement des réponses...</p> : answers.map((answer) => {
            const name = answer.author?.full_name || answer.author?.username || 'Membre';
            return (
              <div key={answer.id} className="rounded-lg bg-secondary/40 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-6 w-6"><AvatarImage src={answer.author?.avatar_url || undefined} /><AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <span className="font-medium text-foreground">{name}</span>
                  <span>{timeAgo(answer.created_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{answer.body}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <button type="button" disabled={!user} onClick={() => void voteAnswer(answer.id, 'up')} aria-label="Voter pour cette réponse" className={answer.user_vote === 'up' ? 'text-primary' : 'text-muted-foreground'}>▲</button>
                  <span>{answer.votes_count}</span>
                  <button type="button" disabled={!user} onClick={() => void voteAnswer(answer.id, 'down')} aria-label="Voter contre cette réponse" className={answer.user_vote === 'down' ? 'text-primary' : 'text-muted-foreground'}>▼</button>
                </div>
              </div>
            );
          })}
          {!loading && !answers.length && <p className="text-sm text-muted-foreground">Pas encore de réponse.</p>}
          {user ? (
            <form onSubmit={submitAnswer} className="space-y-2">
              <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={10000} rows={2} placeholder="Écrivez une réponse..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <Button type="submit" size="sm" disabled={!body.trim() || submitting}>{submitting ? 'Publication...' : 'Répondre'}</Button>
            </form>
          ) : <p className="text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour répondre.</p>}
        </div>
      )}
    </div>
  );
}