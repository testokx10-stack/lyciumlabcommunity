import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lycium Bio Lab',
    short_name: 'Lycium Bio Lab',
    description: 'Sciences agricoles, communauté et éducation.',
    lang: 'fr',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7faf6',
    theme_color: '#008a38',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
