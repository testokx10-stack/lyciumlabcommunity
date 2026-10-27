'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Pencil, Send, Trash2, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { timeAgo } from '@/lib/data';

type PostComment = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: { full_name: string | null; username: string | null; avatar_url: string | null } | null;
  replies?: PostComment[];
};

export function PostComments({ postId, onCommentCountChange }: { postId: string; onCommentCountChange: (change: number) => void }) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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
      onCommentCountChange(1);
    } catch (requestError) {
      console.error('Failed to post comment:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de publier le commentaire.');
    } finally {
      setSubmitting(false);
    }
  };

  const saveEdit = async (commentId: string) => {
    if (!editContent.trim() || savingEdit) return;
    setSavingEdit(true);
    setError('');
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de modifier le commentaire.');
      setComments((previous) => previous.map((comment) => comment.id === commentId ? { ...comment, content: result.comment.content } : comment));
      setEditingId(null);
    } catch (requestError) {
      console.error('Failed to edit post comment:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de modifier le commentaire.');
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    setError('');
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de supprimer le commentaire.');
      setComments((previous) => previous.filter((comment) => comment.id !== commentId));
      onCommentCountChange(-1);
    } catch (requestError) {
      console.error('Failed to delete post comment:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de supprimer le commentaire.');
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
                  {editingId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} maxLength={10000} rows={2} />
                      <div className="flex gap-2">
                        <Button type="button" size="sm" disabled={savingEdit || !editContent.trim()} onClick={() => void saveEdit(comment.id)}><Check size={14} className="mr-1" />Enregistrer</Button>
                        <Button type="button" size="sm" variant="ghost" disabled={savingEdit} onClick={() => setEditingId(null)}><X size={14} className="mr-1" />Annuler</Button>
                      </div>
                    </div>
                  ) : <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>}
                  {user?.id === comment.author_id && editingId !== comment.id && (
                    <div className="mt-1 flex gap-2">
                      <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}><Pencil size={12} className="mr-1" />Modifier</Button>
                      <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => void deleteComment(comment.id)}><Trash2 size={12} className="mr-1" />Supprimer</Button>
                    </div>
                  )}
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
