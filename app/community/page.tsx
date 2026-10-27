'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, ImagePlus, Send, TrendingUp, HelpCircle, Users, Flame, BadgeCheck, Bookmark } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MemberCard } from '@/components/site/member-card';
import { questions, members, getMember, formatCount, timeAgo } from '@/lib/data';
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

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

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

  const toggleFollow = async (userId: string) => {
    try {
      const res = await fetch(`/api/follows/${userId}`, { method: 'POST' });
      if (res.ok) {
        setFollowedUsers(prev => {
          const next = new Set(prev);
          if (next.has(userId)) next.delete(userId);
          else next.add(userId);
          return next;
        });
      }
    } catch (e) {
      console.error('Failed to toggle follow:', e);
    }
  };

  const toggleVote = async (questionId: string, vote: 'up' | 'down') => {
    try {
      await fetch(`/api/questions/${questionId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
    } catch (e) {
      console.error('Failed to vote:', e);
    }
  };

  const submitPost = async (content: string) => {
    if (!content.trim() || posting) return false;
    setPostError('');
    setPosting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Impossible de publier. Veuillez réessayer.');
      }
      setFeedPosts(prev => [result.post, ...prev]);
      return true;
    } catch (e) {
      console.error('Failed to post:', e);
      setPostError(e instanceof Error ? e.message : 'Impossible de publier. Veuillez réessayer.');
      return false;
    } finally {
      setPosting(false);
    }
  };

  const submitComment = async (postId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (e) {
      console.error('Failed to comment:', e);
    }
  };

  const submitQuestion = async (title: string, body: string, tag: string) => {
    if (!title.trim() || !body.trim() || !tag) return;
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, tag })
      });
    } catch (e) {
      console.error('Failed to post question:', e);
    }
  };

  const voteQuestion = async (questionId: string, vote: 'up' | 'down') => {
    try {
      await fetch(`/api/questions/${questionId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
    } catch (e) {
      console.error('Failed to vote:', e);
    }
  };

  const submitAnswer = async (questionId: string, body: string) => {
    if (!body.trim()) return;
    try {
      await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body })
      });
    } catch (e) {
      console.error('Failed to answer:', e);
    }
  };

  const toggleFollowUser = async (userId: string) => {
    try {
      await fetch(`/api/follows/${userId}`, { method: 'POST' });
      setFollowedUsers(prev => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId);
        else next.add(userId);
        return next;
      });
    } catch (e) {
      console.error('Failed to toggle follow:', e);
    }
  };

  const toggleSubscribe = async (videoId: string) => {
    try {
      await fetch(`/api/follows/${videoId}/video`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to subscribe:', e);
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
                    {postError && <p role="alert" className="text-sm text-destructive mt-2">{postError}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1">
                        <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" disabled>
                          <ImagePlus size={16} /> Photo
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1.5"
                        disabled={!postContent.trim() || posting}
                        onClick={async () => {
                          if (await submitPost(postContent)) setPostContent('');
                        }}
                      >
                        <Send size={15} /> {posting ? 'Publishing...' : 'Post'}
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
          {tab === 'qa' && <QA onVoteQuestion={voteQuestion} onSubmitQuestion={submitQuestion} />}
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
                </div>
                <p className="text-sm mt-2.5 leading-relaxed">{post.content}</p>
                {post.image_url && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-border/60">
                    <img src={post.image_url} alt="" className="w-full max-h-80 object-cover" loading="lazy" />
                  </div>
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

function QA({ onVoteQuestion, onSubmitQuestion }: { onVoteQuestion: (questionId: string, vote: 'up' | 'down') => void; onSubmitQuestion: (title: string, body: string, tag: string) => void }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [questionTag, setQuestionTag] = useState('');

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={members[2].avatar} alt="You" />
            <AvatarFallback>YT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="Ask an agricultural or scientific question..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground border-b border-border pb-2 focus:border-primary transition-colors"
            />
            <textarea
              value={questionBody}
              onChange={(e) => setQuestionBody(e.target.value)}
              placeholder="Add details..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground border-b border-border pb-2 focus:border-primary transition-colors mt-2"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <select
                value={questionTag}
                onChange={(e) => setQuestionTag(e.target.value)}
                className="text-xs text-muted-foreground bg-transparent border-0 outline-none">
                <option value="">Select a topic</option>
                {['soil-science', 'irrigation', 'pest-management'].map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button size="sm" className="gap-1.5" onClick={() => {
                if (questionTitle.trim() && questionBody.trim() && questionTag) {
                  onSubmitQuestion(questionTitle, questionBody, questionTag);
                  setQuestionTitle('');
                  setQuestionBody('');
                  setQuestionTag('');
                }
              }}>
                <Send size={14} /> Post question
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {questions.map((q) => {
        const author = getMember(q.authorId)!;
        return (
          <Card key={q.id} className="p-5 card-hover">
            <div className="flex gap-4">
              <div className="flex flex-col items-center text-center shrink-0">
                <button
                  onClick={() => onVoteQuestion(q.id, 'up')}
                  className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">▲</button>
                <span className="text-sm font-semibold tabular-nums my-0.5">{q.votes}</span>
                <button
                  onClick={() => onVoteQuestion(q.id, 'down')}
                  className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={q.answered ? 'default' : 'secondary'} className={q.answered ? 'gap-1 bg-accent border-0' : 'font-normal'}>
                    {q.answered ? 'Répondu' : 'Ouverte'}
                  </Badge>
                  <Badge variant="outline" className="font-normal">#{q.tag}</Badge>
                </div>
                <h3 className="font-medium text-lg leading-snug mt-2 hover:text-primary transition-colors cursor-pointer">{q.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{q.body}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{author.name}</span>
                  <span>·</span>
                  <span className="tabular-nums">{q.answers} réponses</span>
                  <span>·</span>
                  <span className="tabular-nums">{formatCount(q.views)} vues</span>
                  <span>·</span>
                  <span>{timeAgo(q.askedAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}