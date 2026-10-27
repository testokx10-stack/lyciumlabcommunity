import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, ChevronRight, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VideoCardCompact } from '@/components/site/video-card';
import { MemberAvatarRow } from '@/components/site/member-card';
import { FollowButton } from '@/components/site/follow-button';
import { VideoInteractions } from '@/components/site/video-interactions';
import { videos, getMember, getCategory, formatCount, formatDate, members } from '@/lib/data';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return videos.map((v) => ({ id: v.id }));
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const video = videos.find((v) => v.id === params.id);
  if (!video) notFound();

  const author = getMember(video.authorId);
  const category = getCategory(video.category);
  const related = videos.filter((v) => v.id !== video.id && v.category === video.category).slice(0, 4);
  const moreFromAuthor = videos.filter((v) => v.id !== video.id && v.authorId === video.authorId).slice(0, 3);
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
            <iframe
              src={video.embed}
              title={video.title}
              className="h-full w-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Title + meta */}
          <h1 className="font-display text-2xl lg:text-3xl font-semibold leading-tight tracking-tight mt-5">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground tabular-nums">
            <span className="flex items-center gap-1.5"><Eye size={15} /> {formatCount(video.views)} vues</span>
            <span>·</span>
            <span>{formatDate(video.publishedAt)}</span>
            {category && (
              <>
                <span>·</span>
                <Link href={`/videos?cat=${category.slug}`}>
                  <Badge className={cn('bg-gradient-to-r text-white border-0', category.color)}>{category.name}</Badge>
                </Link>
              </>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <MemberAvatarRow member={author!} size={48} />
            {author && <FollowButton profileId={author.id} />}
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

          <div className="mt-5">
            <VideoInteractions videoId={video.id} />
          </div>
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
          {moreFromAuthor.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3">Plus de {author?.name}</h3>
                <div className="space-y-4">
                  {moreFromAuthor.map((v) => (
                    <VideoCardCompact key={v.id} video={v} />
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
