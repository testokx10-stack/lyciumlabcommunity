import Link from 'next/link';
import { Logo } from './logo';
import { Youtube, Twitter, Linkedin, Instagram, Mail, MapPin, ArrowRight } from 'lucide-react';

const footerNav = [
  {
    title: 'Platform',
    links: [
      { label: 'Video Library', href: '/videos' },
      { label: 'Knowledge Hub', href: '/learn' },
      { label: 'Community', href: '/community' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
      { label: 'Upload a Video', href: '/upload' },
      { label: 'Your Profile', href: '/profile/u3' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Plant Science', href: '/videos?cat=plant-science' },
      { label: 'Soil & Fertility', href: '/videos?cat=soil-science' },
      { label: 'Greenhouse', href: '/videos?cat=greenhouse' },
      { label: 'AgTech & AI', href: '/videos?cat=agtech' },
    ],
  },
  {
    title: 'Organization',
    links: [
      { label: 'Admin Dashboard', href: '/admin' },
      { label: 'Our Mission', href: '/#mission' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Guidelines', href: '/community' },
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
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              An agricultural science and education platform where farmers, researchers, and enthusiasts learn, share, and grow together.
            </p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail size={14} /> hello@lyciumlab.org</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> Global · Remote-first</p>
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
            © {new Date().getFullYear()} Lycium Lab. Cultivating knowledge for a sustainable future.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Code of Conduct</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
