import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lyciumlab.org'),
  title: {
    default: 'Lycium Lab — Growing Knowledge. Cultivating Innovation.',
    template: '%s · Lycium Lab',
  },
  description:
    'Lycium Lab is an agricultural science and education platform where farmers, engineers, researchers, and enthusiasts learn, share videos, and build a community around sustainable farming.',
  keywords: [
    'agricultural science',
    'sustainable farming',
    'agronomy',
    'crop science',
    'soil fertility',
    'irrigation',
    'greenhouse',
    'agtech',
    'plant science',
  ],
  openGraph: {
    title: 'Lycium Lab — Growing Knowledge. Cultivating Innovation.',
    description:
      'Discover agricultural science, share your expertise, and grow together with the Lycium Lab community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lycium Lab — Growing Knowledge. Cultivating Innovation.',
    description:
      'Discover agricultural science, share your expertise, and grow together with the Lycium Lab community.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
