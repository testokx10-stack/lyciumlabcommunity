'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/auth/AuthProvider';

const benefits = [
  'Consulter des ressources pédagogiques en français',
  'Découvrir les catégories des sciences agricoles',
  'Échanger avec la communauté agricole',
];

export default function RegisterPage() {
  return <RegistrationForm />;
}

function RegistrationForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setConfirmationSent(false);
    if (!acceptedTerms || !acceptedPrivacy) {
      setError('Veuillez accepter les conditions d’utilisation et la politique de confidentialité pour créer votre compte.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const { error: signUpError, needsEmailConfirmation } = await signUp(
      String(formData.get('email')),
      String(formData.get('password')),
      String(formData.get('name'))
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
            Rejoignez une communauté qui partage les sciences agricoles.
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            Créez un compte pour participer aux échanges, poser des questions et partager des ressources.
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
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" name="name" autoComplete="name" placeholder="Jean Fermier" className="pl-10 h-11" required />
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
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pour créer votre compte, nous utilisons votre nom et votre adresse e-mail. Votre mot de passe est transmis à Supabase pour l’authentification; nous ne l’utilisons pas à d’autres fins. Les communications marketing ne sont pas activées par défaut. Consultez la <Link href="/privacy" className="text-primary underline">notice de confidentialité</Link>.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox id="privacy" className="mt-0.5" checked={acceptedPrivacy} onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)} />
                  <Label htmlFor="privacy" className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed">
                    J&apos;ai lu et j&apos;accepte la <Link href="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>.
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" className="mt-0.5" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked === true)} />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed">
                    J&apos;accepte les <Link href="/terms" className="text-primary hover:underline">Conditions d&apos;utilisation</Link> et le <Link href="/conduct" className="text-primary hover:underline">Code de conduite</Link>.
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="marketing" className="mt-0.5" checked={marketingConsent} onCheckedChange={(checked) => setMarketingConsent(checked === true)} />
                  <Label htmlFor="marketing" className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed">
                    Je souhaite recevoir des informations utiles du projet, si l’option est proposée à l’avenir. (Désactivé par défaut.)
                  </Label>
                </div>
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
