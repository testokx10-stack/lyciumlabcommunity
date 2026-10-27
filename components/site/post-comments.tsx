'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { timeAgo } from '@/lib/data';

type PostComment = {
  id: string;
  content: string;
  created_at: string;
  author: { full_name: string | null; username: string | null; avatar_url: string | null } | null;
  replies?: PostComment[];
};

export function PostComments({ postId, onCommentCreated }: { postId: string; onCommentCreated: () => void }) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/posts/${encodeURIComponent(postId)}/comments`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger les commentaires.');
        if (active) setComments(result.comments || []);
      })
      .catch((requestError: unknown) => {
        console.error('Failed to load post comments:', requestError);
        if (active) setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les commentaires.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [postId]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de publier le commentaire.');
      setComments((previous) => [...previous, result.comment]);
      setContent('');
      onCommentCreated();
    } catch (requestError) {
      console.error('Failed to post comment:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de publier le commentaire.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      {authLoading ? <p className="text-sm text-muted-foreground">Chargement du compte...</p> : user ? (
        <form onSubmit={submitComment} className="mb-4 flex gap-2">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Écrire un commentaire..."
            rows={2}
            maxLength={10000}
            className="min-h-0 resize-y"
          />
          <Button type="submit" size="icon" aria-label="Publier le commentaire" disabled={!content.trim() || submitting}>
            <Send size={15} />
          </Button>
        </form>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour commenter.</p>
      )}
      {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Chargement des commentaires...</p> : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const name = comment.author?.full_name || comment.author?.username || 'Membre';
            return (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={comment.author?.avatar_url || undefined} alt={name} />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xs"><span className="font-medium">{name}</span><span className="ml-2 text-muted-foreground">{timeAgo(comment.created_at)}</span></p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
                  {comment.replies?.map((reply) => {
                    const replyName = reply.author?.full_name || reply.author?.username || 'Membre';
                    return <p key={reply.id} className="ml-4 mt-2 border-l-2 border-border pl-3 text-sm"><span className="font-medium">{replyName}</span> {reply.content}</p>;
                  })}
                </div>
              </div>
            );
          })}
          {!comments.length && <p className="text-sm text-muted-foreground">Pas encore de commentaires.</p>}
        </div>
      )}
    </div>
  );
}
