'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

type Notification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'answer' | 'mention' | 'answer_accepted';
  reference_id: string;
  read: boolean;
  created_at: string;
  actor: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};

const typeLabels: Record<Notification['type'], string> = {
  like: 'a aimé votre publication.',
  comment: 'a commenté votre publication.',
  follow: 'a commencé à vous suivre.',
  answer: 'a répondu à votre question.',
  mention: 'vous a mentionné.',
  answer_accepted: 'a accepté votre réponse.',
};

function notificationHref(notification: Notification) {
  if (notification.type === 'follow') return `/profile/${notification.actor?.id || notification.reference_id}`;
  if (notification.type === 'like' || notification.type === 'comment') return '/community';
  return '/community?tab=qa';
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications?limit=50');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de charger les notifications.');
      setNotifications(result.notifications || []);
    } catch (requestError) {
      console.error('Failed to load notifications:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) void loadNotifications();
    else if (!authLoading) setLoading(false);
  }, [authLoading, user, loadNotifications]);

  const markAsRead = async (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.read) return;
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible de marquer la notification comme lue.');
      setNotifications((previous) => previous.map((item) => item.id === id ? { ...item, read: true } : item));
    } catch (requestError) {
      console.error('Failed to mark notification as read:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Impossible de marquer la notification comme lue.');
    }
  };

  return (
    <div className="container-px mx-auto max-w-3xl py-10">
      <div className="mb-6 flex items-center gap-3">
        <Bell className="text-primary" size={24} />
        <div>
          <h1 className="font-display text-3xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Likes, commentaires, réponses et nouveaux abonnés.</p>
        </div>
      </div>

      {authLoading || loading ? (
        <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
      ) : !user ? (
        <Card className="p-5 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour consulter vos notifications.
        </Card>
      ) : error ? (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      ) : notifications.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const actorName = notification.actor?.full_name || notification.actor?.username || 'Un membre';
            const Icon = notification.type === 'like' ? Heart : notification.type === 'follow' ? UserPlus : MessageCircle;
            return (
              <Link
                key={notification.id}
                href={notificationHref(notification)}
                onClick={() => void markAsRead(notification.id)}
                className="block"
              >
                <Card className={`flex items-center gap-3 p-4 transition-colors hover:bg-secondary/50 ${!notification.read ? 'border-primary/30 bg-primary/[0.03]' : ''}`}>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={notification.actor?.avatar_url || undefined} alt={actorName} />
                    <AvatarFallback>{actorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm"><span className="font-medium">{actorName}</span> {typeLabels[notification.type]}</p>
                    <time className="text-xs text-muted-foreground" dateTime={notification.created_at}>
                      {new Date(notification.created_at).toLocaleString('fr-FR')}
                    </time>
                  </div>
                  {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Non lue" />}
                  <Icon className="shrink-0 text-muted-foreground" size={17} />
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 text-center text-sm text-muted-foreground">Vous n’avez pas encore de notification.</Card>
      )}
    </div>
  );
}
