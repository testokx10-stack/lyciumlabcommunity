import Link from 'next/link';
import { Video as VideoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VideoCard } from '@/components/site/video-card';
import { categories, videos } from '@/lib/data';

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const selectedCategory = categories.find((category) => category.slug === cat);
  const filteredVideos = selectedCategory
    ? videos.filter((video) => video.category === selectedCategory.slug)
    : videos;

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <VideoIcon size={24} />
        </span>
        <div>
          <Badge variant="outline" className="mb-2">Vidéos YouTube</Badge>
          <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">Bibliothèque vidéo</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Retrouvez les vidéos sélectionnées sur les sciences agricoles. Les compteurs et profils de démonstration ont été retirés.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Les vues, mentions J’aime et commentaires affichés sont des compteurs relevés sur YouTube et peuvent évoluer. Les vignettes sont fournies par YouTube et leur chargement peut transmettre des données techniques à Google. Le lecteur ne se charge qu’après votre clic. <Link href="/privacy" className="underline underline-offset-4">Détails</Link>.
          </p>
        </div>
      </div>

      <nav aria-label="Filtrer les vidéos par catégorie" className="mt-8 flex flex-wrap gap-2 border-b border-border/60 pb-6">
        <Link href="/videos">
          <Badge variant={!selectedCategory ? 'default' : 'secondary'}>Toutes les vidéos</Badge>
        </Link>
        {categories.map((category) => (
          <Link key={category.slug} href={`/videos?cat=${category.slug}`}>
            <Badge variant={selectedCategory?.slug === category.slug ? 'default' : 'secondary'}>
              {category.name}
            </Badge>
          </Link>
        ))}
      </nav>

      {filteredVideos.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVideos.map((video) => <VideoCard key={video.id} video={video} />)}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          Aucune vidéo dans cette catégorie pour le moment.
        </p>
      )}
    </div>
  );
}
