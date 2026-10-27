'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (loading || !user) {
      setUnreadCount(0);
      return;
    }

    let active = true;
    const loadUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications?limit=1');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger les notifications.');
        if (active) setUnreadCount(result.unreadCount || 0);
      } catch (error) {
        console.error('Failed to load unread notification count:', error);
      }
    };

    void loadUnreadCount();
    const interval = window.setInterval(loadUnreadCount, 60000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [loading, pathname, user]);

  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notifications">
      <Link href={user ? '/notifications' : '/login'}>
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground ring-2 ring-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
