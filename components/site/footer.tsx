import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Twitter, Linkedin, Instagram, Mail, MapPin, ArrowRight } from 'lucide-react';

const footerNav = [
  {
    title: 'Plateforme',
    links: [
      { label: 'Bibliothèque vidéo', href: '/videos' },
      { label: 'Hub de connaissances', href: '/learn' },
      { label: 'Communauté', href: '/community' },
      { label: 'Recherche', href: '/search' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Connexion', href: '/login' },
      { label: 'Créer un compte', href: '/register' },
      { label: 'Téléverser une vidéo', href: '/upload' },
      { label: 'Votre profil', href: '/profile/u3' },
    ],
  },
  {
    title: 'Catégories',
    links: [
      { label: 'Sciences végétales', href: '/videos?cat=plant-science' },
      { label: 'Sol et fertilité', href: '/videos?cat=soil-science' },
      { label: 'Serre', href: '/videos?cat=greenhouse' },
      { label: 'AgTech & IA', href: '/videos?cat=agtech' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'Tableau de bord admin', href: '/admin' },
      { label: 'Notre mission', href: '/#mission' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Directives', href: '/community' },
    ],
  },
];

const socials = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="container-px mx-auto max-w-7xl py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <Image
              src="/lycium-bio-lab-logo.png"
              alt="Lycium Bio Lab — Innovative Agriculture. Sustainable Tomorrow."
              width={180}
              height={180}
              className="h-36 w-36 rounded-xl object-contain"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Une plateforme de sciences agricoles et d&apos;éducation où agriculteurs, chercheurs et passionnés apprennent, partagent et cultivent ensemble.
            </p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail size={14} /> hello@lyciumlab.org</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> Mondial · À distance</p>
            </div>
            <div className="flex gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                    >
                      {l.label}
                      <ArrowRight size={12} className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lycium Bio Lab. Cultivons des connaissances pour un avenir durable.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-primary transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-primary transition-colors">Code de conduite</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
