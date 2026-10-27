import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
      { label: 'Inscription', href: '/register' },
    ],
  },
  {
    title: 'Catégories',
    links: [
      { label: 'Sciences végétales', href: '/learn?cat=plant-science#ressources' },
      { label: 'Sol et fertilité', href: '/learn?cat=soil-science#ressources' },
      { label: 'Serre', href: '/learn?cat=greenhouse#ressources' },
      { label: 'AgTech & IA', href: '/learn?cat=agtech#ressources' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'Notre mission', href: '/#mission' },
      { label: 'Rejoindre la communauté', href: '/register' },
    ],
  },
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
              Un espace éducatif ouvert de partage des connaissances en sciences agricoles.
            </p>
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
            <Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Conditions</Link>
            <Link href="/legal-notice" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link href="/conduct" className="hover:text-primary transition-colors">Code de conduite</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
