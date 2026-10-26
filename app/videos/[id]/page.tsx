import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, ThumbsUp, MessageCircle, Share2, Bookmark, Bell, ListChecks, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { VideoCardCompact, VideoActions } from '@/components/site/video-card';
import { MemberAvatarRow } from '@/components/site/member-card';
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

  const sampleComments = [
    { id: 'c1', authorId: 'u4', body: 'La section sur les cultures couvrantes pour la récupération du microbiome du sol était exactement ce dont j\'avais besoin. Je vais tester la trèfle+violette cette hiver.', postedAt: 'il y a 3 jours', likes: 24 },
    { id: 'c2', authorId: 'u5', body: 'Avez-vous constaté des différences entre la domination fongique et bactérienne selon la profondeur de travail du sol ? Un complément serait bienvenu.', postedAt: 'il y a 2 jours', likes: 12, replies: 1 },
    { id: 'c3', authorId: 'u6', body: 'Un résumé de preuves solide. La liste de références mycorhiziens est un trésor pour qui commence.', postedAt: 'hier', likes: 31 },
  ];

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

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <VideoActions video={video} />
          </div>

          <Separator className="my-5" />

          {/* Author */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <MemberAvatarRow member={author!} size={48} />
            <div className="flex gap-2">
              <Button size="sm" className="gap-1.5"><Bell size={15} /> S&apos;abonner</Button>
              <Button size="sm" variant="outline">Suivre</Button>
            </div>
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

          {/* Comments */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold mb-4">
              {video.comments} commentaires
            </h2>
            <div className="flex gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={members[2].avatar} alt="Vous" />
                <AvatarFallback>YT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea placeholder="Ajouter un commentaire..." className="resize-none bg-background" rows={2} />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="ghost">Annuler</Button>
                  <Button size="sm">Commenter</Button>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              {sampleComments.map((c) => {
                const ca = getMember(c.authorId)!;
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={ca.avatar} alt={ca.name} />
                      <AvatarFallback>{ca.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{ca.name}</span>
                        <span className="text-xs text-muted-foreground">{c.postedAt}</span>
                      </div>
                      <p className="text-sm mt-1 leading-relaxed">{c.body}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors"><ThumbsUp size={13} /> {c.likes}</button>
                        <button className="hover:text-primary transition-colors">Répondre</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
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
