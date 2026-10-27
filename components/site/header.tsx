'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, Search, Settings, Menu, UserRound, X } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Accueil', href: '/' },
  { label: 'Vidéos', href: '/videos' },
  { label: 'Communauté', href: '/community' },
  { label: 'Hub de connaissances', href: '/learn' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSignOutError('');
  }, [pathname]);

  const handleSignOut = async () => {
    setSignOutError('');
    try {
      const { error } = await signOut();
      if (error) throw error;
      setOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
      setSignOutError('La déconnexion a échoué. Veuillez réessayer.');
    }
  };

  const accountLinks = user ? (
    <>
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href={`/profile/${encodeURIComponent(user.id)}`}><UserRound size={16} /> Mon profil</Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href="/settings"><Settings size={16} /> Gérer mon profil</Link>
      </Button>
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleSignOut}>
        <LogOut size={16} /> Déconnexion
      </Button>
    </>
  ) : !authLoading ? (
    <>
      <Button asChild variant="ghost" size="sm"><Link href="/login">Connexion</Link></Button>
      <Button asChild size="sm"><Link href="/register">Créer un compte</Link></Button>
    </>
  ) : null;

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
            <div className="hidden lg:flex items-center gap-1">
              {accountLinks}
            </div>
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
          'lg:hidden overflow-y-auto transition-all duration-300 glass',
          open ? 'max-h-[80vh] border-t border-border/60' : 'max-h-0',
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
          <div className="flex flex-col gap-1 mt-2 pt-3 border-t border-border/60">
            <Button asChild variant="outline" size="sm" className="justify-start gap-1.5">
              <Link href="/search"><Search size={16} /> Recherche</Link>
            </Button>
            {accountLinks}
          </div>
        </nav>
      </div>
      {signOutError && (
        <p role="alert" className="container-px mx-auto max-w-7xl pb-2 text-right text-sm text-destructive">
          {signOutError}
        </p>
      )}
    </header>
  );
}
