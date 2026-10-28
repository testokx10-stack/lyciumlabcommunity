import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lyciumbiolab.vercel.app'),
  title: {
    default: 'Lycium Media Lab — Cultiver les connaissances. Privilégier l\'innovation.',
    template: '%s · Lycium Media Lab',
  },
  description:
    'Lycium Media Lab est une plateforme de sciences agricoles et d\'éducation où agriculteurs, ingénieurs, chercheurs et passionnés apprennent, partagent des vidéos et construisent une communauté autour de l\'agriculture durable.',
  keywords: [
    'sciences agricoles',
    'agriculture durable',
    'agronomie',
    'science des cultures',
    'fertilité du sol',
    'irrigation',
    'serre',
    'agtech',
    'sciences végétales',
  ],
  openGraph: {
    title: 'Lycium Media Lab — Cultiver les connaissances. Privilégier l\'innovation.',
    description:
      'Découvrez les sciences agricoles, partagez votre expertise et cultivons ensemble la communauté de Lycium Media Lab.',
    type: 'website',
    images: [
      {
        url: '/social-image',
        width: 1200,
        height: 630,
        alt: 'Lycium Media Lab — Sciences agricoles, ressources et éducation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lycium Media Lab — Cultiver les connaissances. Privilégier l\'innovation.',
    description:
      'Découvrez les sciences agricoles, partagez votre expertise et cultivons ensemble la communauté de Lycium Media Lab.',
    images: ['/social-image'],
  },
  applicationName: 'Lycium Media Lab',
  appleWebApp: {
    capable: true,
    title: 'Lycium Media Lab',
    statusBarStyle: 'default',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
