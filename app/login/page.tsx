'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  return <LoginForm />;
}

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const { error: signInError } = await signIn(
      String(formData.get('email')),
      String(formData.get('password'))
    );

    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push('/community');
    router.refresh();
  };

  return (
    <div className="container-px mx-auto max-w-md py-14">
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" />
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-6">Bon retour</h1>
        <p className="text-muted-foreground mt-2 text-center">Connectez-vous pour continuer à apprendre et à partager avec la communauté.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@ferme.com" className="pl-10 h-11" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" className="pl-10 h-11 pr-10" required />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full gap-1.5 mt-2" disabled={submitting}>
            {submitting ? 'Connexion...' : 'Connexion'} <ArrowRight size={17} />
          </Button>
        </form>

      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Nouveau sur Lycium Media Lab ? <Link href="/register" className="text-primary font-medium hover:underline">Créer un compte</Link>
      </p>
    </div>
  );
}
