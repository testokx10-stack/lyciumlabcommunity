import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Eye, ListChecks, MessageCircle, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VideoCardCompact } from '@/components/site/video-card';
import { YouTubePlayer } from '@/components/site/youtube-player';
import { VideoInteractions } from '@/components/site/video-interactions';
import { videos, formatCount, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return videos.map((v) => ({ id: v.id }));
}

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = videos.find((v) => v.id === id);
  if (!video) notFound();

  const category = getCategory(video.category);
  const related = videos.filter((v) => v.id !== video.id && v.category === video.category).slice(0, 4);
  const continueWatching = videos.filter((v) => v.id !== video.id).slice(0, 4);

  return (
    <div className="container-px mx-auto max-w-7xl py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
        <Link href="/videos" className="hover:text-primary transition-colors">Vidéos</Link>
        <ChevronRight size={14} />
        <Link href={`/videos?cat=${category?.slug}`} className="hover:text-primary transition-colors">{category?.name}</Link>
        <ChevronRight size={14} />
        <span className="text-foreground truncate">{video.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="min-w-0">
          {/* Player */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-primary/10">
            <YouTubePlayer video={video} />
          </div>

          {/* Title + meta */}
          <h1 className="font-display text-2xl lg:text-3xl font-semibold leading-tight tracking-tight mt-5">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span>{video.duration}</span>
            <span>·</span>
            <span>Vidéo YouTube</span>
            {category && (
              <>
                <span>·</span>
                <Link href={`/videos?cat=${category.slug}`}>
                  <Badge className={cn('bg-gradient-to-r text-white border-0', category.color)}>{category.name}</Badge>
                </Link>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm tabular-nums text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Eye size={15} /> {formatCount(video.views)} vues</span>
            <span className="inline-flex items-center gap-1.5"><ThumbsUp size={15} /> {formatCount(video.likes)} j’aime</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> {video.comments} commentaires YouTube</span>
          </div>

          {/* Description */}
          <Card className="p-5 mt-5 bg-secondary/40">
            <p className="text-sm leading-relaxed text-muted-foreground">{video.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {video.tags.map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">#{t}</Badge>
              ))}
            </div>
          </Card>

          <div className="mt-5"><VideoInteractions videoId={video.id} /></div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><ListChecks size={15} /> Continuer l&apos;apprentissage</h3>
            <div className="space-y-4">
              {continueWatching.map((v) => (
                <VideoCardCompact key={v.id} video={v} />
              ))}
            </div>
          </div>
          <Separator />
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Vidéos connexes</h3>
              <div className="space-y-4">
                {related.map((v) => (
                  <VideoCardCompact key={v.id} video={v} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
