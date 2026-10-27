import Link from 'next/link';
import { Eye, MessageCircle, Play, ThumbsUp, Youtube } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, formatCount, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

function VideoArtwork({ video, compact = false }: { video: Video; compact?: boolean }) {
  return (
    <div className={cn('group relative aspect-video overflow-hidden bg-secondary', compact && 'rounded-lg')}>
      <img
        src={video.thumbnail}
        alt=""
        loading="lazy"
        referrerPolicy="strict-origin"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
        {video.duration}
      </span>
      {!compact && <span className="absolute inset-0 grid place-items-center bg-black/15 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
          <Play size={22} className="ml-0.5" fill="currentColor" />
        </span>
      </span>}
      <span className="absolute left-3 top-3 rounded bg-black/65 px-2 py-1 text-[11px] font-medium text-white">
        YouTube
      </span>
    </div>
  );
}

export function VideoCard({ video, className }: { video: Video; className?: string }) {
  const category = getCategory(video.category);

  return (
    <Link href={`/videos/${video.id}`} className={cn('group block', className)}>
      <Card className="h-full gap-0 overflow-hidden p-0 card-hover">
        <VideoArtwork video={video} />
        <div className="space-y-2.5 p-3.5">
          {category && <Badge variant="secondary">{category.name}</Badge>}
          <h3 className="line-clamp-2 font-medium leading-snug transition-colors group-hover:text-primary">
            {video.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{video.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs tabular-nums text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Eye size={13} /> {formatCount(video.views)} vues</span>
            <span className="inline-flex items-center gap-1"><ThumbsUp size={13} /> {formatCount(video.likes)} j’aime</span>
            <span className="inline-flex items-center gap-1"><MessageCircle size={13} /> {video.comments}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function VideoCardCompact({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.id}`} className="group flex gap-3">
      <div className="w-40 shrink-0">
        <VideoArtwork video={video} compact />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-primary">{video.title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{getCategory(video.category)?.name}</p>
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">{formatCount(video.views)} vues · {formatCount(video.likes)} j’aime</p>
      </div>
    </Link>
  );
}
