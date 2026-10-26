import Link from 'next/link';
import { Play, Eye, ThumbsUp, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, formatCount, timeAgo, getMember, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

export function VideoCard({ video, className }: { video: Video; className?: string }) {
  const author = getMember(video.authorId);
  const category = getCategory(video.category);

  return (
    <Link href={`/videos/${video.id}`} className={cn('group block', className)}>
      <Card className="overflow-hidden card-hover p-0 gap-0 h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm translate-y-2 group-hover:translate-y-0 transition-transform">
              <Play size={22} className="ml-0.5" fill="currentColor" />
            </span>
          </div>
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
            {video.duration}
          </span>
          {category && (
            <span className="absolute top-2 left-2">
              <Badge className={cn('bg-gradient-to-r text-white border-0', category.color)}>
                {category.name.split(' & ')[0]}
              </Badge>
            </span>
          )}
        </div>
        <div className="p-3.5 space-y-2.5">
          <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="h-6 w-6">
              {author && <AvatarImage src={author.avatar} alt={author.name} />}
              <AvatarFallback>{author?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{author?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
            <span className="flex items-center gap-1"><Eye size={13} /> {formatCount(video.views)}</span>
            <span className="flex items-center gap-1"><ThumbsUp size={13} /> {formatCount(video.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle size={13} /> {video.comments}</span>
            <span className="ml-auto">{timeAgo(video.publishedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function VideoCardCompact({ video }: { video: Video }) {
  const author = getMember(video.authorId);
  return (
    <Link href={`/videos/${video.id}`} className="group flex gap-3">
      <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden">
        <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">{video.duration}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{author?.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">{formatCount(video.views)} vues · {timeAgo(video.publishedAt)}</p>
      </div>
    </Link>
  );
}

export function VideoActions({ video }: { video: Video }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
        <ThumbsUp size={15} /> {formatCount(video.likes)}
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
        <MessageCircle size={15} /> {video.comments}
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
        <Share2 size={15} /> Partager
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
        <Bookmark size={15} /> Enregistrer
      </button>
    </div>
  );
}
