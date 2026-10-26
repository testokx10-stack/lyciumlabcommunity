import Link from 'next/link';
import { Mail, Lock, User, MapPin, ArrowRight, Sprout, Check } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const benefits = [
  'Publish videos, articles, and questions',
  'Join topic-based communities and discussions',
  'Save and organize learning playlists',
  'Follow experts and get personalized recommendations',
];

export default function RegisterPage() {
  return (
    <div className="container-px mx-auto max-w-5xl py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: benefits */}
        <div className="hidden lg:block sticky top-24">
          <Logo size="lg" />
          <h1 className="font-display text-4xl font-semibold tracking-tight mt-8 leading-tight text-balance">
            Join 12,400+ farmers, researchers, and agricultural enthusiasts.
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            Free forever. Your account unlocks the full Lycium Lab community, video library, and knowledge hub.
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
            <h2 className="font-display text-2xl font-semibold tracking-tight">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1.5">It takes less than a minute.</p>

            <form className="space-y-4 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" placeholder="Jane Farmer" className="pl-10 h-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="location" placeholder="City, Country" className="pl-10 h-11" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@farm.com" className="pl-10 h-11" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="At least 8 characters" className="pl-10 h-11" required />
                </div>
                <p className="text-xs text-muted-foreground">Use a mix of letters, numbers, and symbols.</p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-0.5" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed">
                  I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Code of Conduct</Link>.
                </Label>
              </div>
              <Button type="submit" size="lg" className="w-full gap-1.5">Create account <ArrowRight size={17} /></Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2"><Sprout size={16} /> ORCID</Button>
              <Button variant="outline" className="gap-2">Google</Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
