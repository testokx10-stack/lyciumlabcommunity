'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, MessageCircle, Send, Share2, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { timeAgo } from '@/lib/data';

type VideoComment = {
  id: string;
  content: string;
  created_at: string;
  author: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export function VideoInteractions({ videoId }: { videoId: string }) {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/videos/${encodeURIComponent(videoId)}/comments`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger les commentaires.');
        if (active) {
          setComments(result.comments || []);
          setCommentCount(result.total || 0);
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load video comments:', error);
        if (active) setCommentsError(error instanceof Error ? error.message : 'Impossible de charger les commentaires.');
      })
      .finally(() => {
        if (active) setCommentsLoading(false);
      });
    return () => { active = false; };
  }, [videoId]);

  useEffect(() => {
    if (loading || !user) return;
    let active = true;
    fetch(`/api/follows/${encodeURIComponent(videoId)}/video`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger l’abonnement.');
        if (active) setSubscribed(result.subscribed);
      })
      .catch((error: unknown) => {
        console.error('Failed to load video subscription:', error);
        if (active) setSubscriptionError(error instanceof Error ? error.message : 'Impossible de charger l’abonnement.');
      });
    return () => { active = false; };
  }, [loading, user, videoId]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setCommentsError('');
    try {
      const response = await fetch(`/api/videos/${encodeURIComponent(videoId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de publier le commentaire.');
      setComments((previous) => [result.comment, ...previous]);
      setCommentCount((previous) => previous + 1);
      setContent('');
    } catch (error) {
      console.error('Failed to post video comment:', error);
      setCommentsError(error instanceof Error ? error.message : 'Impossible de publier le commentaire.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSubscription = async () => {
    setSubscriptionError('');
    try {
      const response = await fetch(`/api/follows/${encodeURIComponent(videoId)}/video`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de modifier l’abonnement.');
      setSubscribed(result.subscribed);
    } catch (error) {
      console.error('Failed to update video subscription:', error);
      setSubscriptionError(error instanceof Error ? error.message : 'Impossible de modifier l’abonnement.');
    }
  };

  const shareVideo = async () => {
    setShareError('');
    try {
      if (navigator.share) {
        await navigator.share({ url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSharing(true);
        window.setTimeout(() => setSharing(false), 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Failed to share video:', error);
      setShareError('Impossible de partager le lien depuis ce navigateur.');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={() => document.getElementById('video-comments')?.scrollIntoView({ behavior: 'smooth' })}>
          <MessageCircle size={15} /> {commentCount} commentaires
        </Button>
        <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={shareVideo}>
          <Share2 size={15} /> {sharing ? 'Lien copié' : 'Partager'}
        </Button>
        {!loading && (user ? (
          <Button type="button" variant={subscribed ? 'default' : 'secondary'} size="sm" className="gap-1.5" onClick={toggleSubscription}>
            <Bell size={15} /> {subscribed ? 'Abonné' : 'S’abonner à la vidéo'}
          </Button>
        ) : (
          <Button asChild variant="secondary" size="sm" className="gap-1.5"><Link href="/login"><Bell size={15} /> Connectez-vous pour vous abonner</Link></Button>
        ))}
        {subscriptionError && <p role="alert" className="w-full text-sm text-destructive">{subscriptionError}</p>}
        {shareError && <p role="alert" className="w-full text-sm text-destructive">{shareError}</p>}
      </div>

      <section id="video-comments" className="mt-8 scroll-mt-24">
        <h2 className="font-display text-xl font-semibold mb-4">{commentCount} commentaires</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement du compte...</p>
        ) : user ? (
          <form onSubmit={submitComment} className="mb-6 flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user.user_metadata.avatar_url || undefined} alt={user.user_metadata.full_name || 'Vous'} />
              <AvatarFallback>{(user.user_metadata.full_name || user.email || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Ajouter un commentaire..." className="resize-none bg-background" rows={2} maxLength={10000} />
              <div className="mt-2 flex justify-end">
                <Button size="sm" type="submit" className="gap-1.5" disabled={!content.trim() || submitting}>
                  <Send size={14} /> {submitting ? 'Publication...' : 'Commenter'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <p className="mb-6 text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour commenter cette vidéo.</p>
        )}
        {commentsError && <p role="alert" className="mb-4 text-sm text-destructive">{commentsError}</p>}
        {commentsLoading ? (
          <p className="text-sm text-muted-foreground">Chargement des commentaires...</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const name = comment.author?.full_name || comment.author?.username || 'Membre';
              return (
                <Card key={comment.id} className="flex gap-3 p-4">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={comment.author?.avatar_url || undefined} alt={name} />
                    <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </Card>
              );
            })}
            {!comments.length && <p className="text-sm text-muted-foreground">Pas encore de commentaires. Lancez la discussion !</p>}
          </div>
        )}
      </section>
    </>
  );
}
