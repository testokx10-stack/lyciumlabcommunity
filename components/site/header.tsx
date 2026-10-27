'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Menu, X, Bell, Plus } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const nav = [
  { label: 'Accueil', href: '/' },
  { label: 'Vidéos', href: '/videos' },
  { label: 'Communauté', href: '/community' },
  { label: 'Hub de connaissances', href: '/learn' },
];

export function SiteHeader() {
  const { user, loading: authLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'glass shadow-sm' : 'bg-transparent',
      )}
    >
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" className="hidden sm:grid place-items-center">
              <span className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Search size={19} />
              </span>
            </Link>
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex relative">
              <span>
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
              </span>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex gap-1.5">
              <Link href="/upload">
                <Plus size={16} /> Téléverser
              </Link>
            </Button>
            {!authLoading && (
              user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || 'Profil'} />
                    <AvatarFallback>{(user.user_metadata.full_name || user.email || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" onClick={() => void signOut()}>Déconnexion</Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1">
                  <Button asChild variant="ghost" size="sm"><Link href="/login">Connexion</Link></Button>
                  <Button asChild size="sm"><Link href="/register">Créer un compte</Link></Button>
                </div>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 glass',
          open ? 'max-h-96 border-t border-border/60' : 'max-h-0',
        )}
      >
        <nav className="container-px mx-auto max-w-7xl py-4 flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex gap-2 mt-2 pt-3 border-t border-border/60">
            <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
              <Link href="/search"><Search size={16} /> Recherche</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 gap-1.5">
              <Link href="/upload"><Plus size={16} /> Téléverser</Link>
            </Button>
          </div>
          {!authLoading && (
            <div className="flex gap-2 mt-2">
              {user ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => void signOut()}>Déconnexion</Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link href="/login">Connexion</Link></Button>
                  <Button asChild size="sm" className="flex-1"><Link href="/register">Créer un compte</Link></Button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
