'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Mail, Lock, User, MapPin, ArrowRight, Check } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/auth/AuthProvider';

const benefits = [
  'Publiez des vidéos, des articles et des questions',
  'Rejoignez des communautés et discussions thématiques',
  'Sauvegardez et organisez des listes de lecture d\'apprentissage',
  'Suivez des experts et obtenez des recommandations personnalisées',
];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setConfirmationSent(false);
    if (!acceptedTerms) {
      setError('Veuillez accepter les conditions pour créer votre compte.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const { error: signUpError, needsEmailConfirmation } = await signUp(
      String(formData.get('email')),
      String(formData.get('password')),
      String(formData.get('name')),
      String(formData.get('location') || '')
    );
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }

    router.push('/community');
    router.refresh();
  };

  return (
    <div className="container-px mx-auto max-w-5xl py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: benefits */}
        <div className="hidden lg:block sticky top-24">
          <Logo size="lg" />
          <h1 className="font-display text-4xl font-semibold tracking-tight mt-8 leading-tight text-balance">
            Rejoignez 12 400 agriculteurs, chercheurs et passionnés.
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            Gratuit pour toujours. Votre compte débloque toute la communauté Lycium Bio Lab, la bibliothèque vidéo et le hub de connaissances.
          </p>
          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent shrink-0">
                  <Check size={14} strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <div className="lg:pt-4">
          <div className="lg:hidden mb-6"><Logo size="md" /></div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Créer votre compte</h2>
            <p className="text-sm text-muted-foreground mt-1.5">Cela prend moins d&apos;une minute.</p>

            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" name="name" autoComplete="name" placeholder="Jean Fermier" className="pl-10 h-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Emplacement</Label>
                  <div className="relative">
                    <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="location" name="location" autoComplete="address-level2" placeholder="Ville, Pays" className="pl-10 h-11" />
                  </div>
                </div>
              </div>
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
                  <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Au moins 8 caractères" className="pl-10 h-11" required />
                </div>
                <p className="text-xs text-muted-foreground">Utilisez un mélange de lettres, de chiffres et de symboles.</p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-0.5" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked === true)} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed">
                  J&apos;accepte les <Link href="#" className="text-primary hover:underline">Conditions d&apos;utilisation</Link> et le <Link href="#" className="text-primary hover:underline">Code de conduite</Link>.
                </Label>
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              {confirmationSent && <p role="status" className="text-sm text-primary">Vérifiez votre e-mail pour confirmer votre compte.</p>}
              <Button type="submit" size="lg" className="w-full gap-1.5" disabled={submitting}>
                {submitting ? 'Création du compte...' : 'Créer le compte'} <ArrowRight size={17} />
              </Button>
            </form>

          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Vous avez déjà un compte ? <Link href="/login" className="text-primary font-medium hover:underline">Connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
