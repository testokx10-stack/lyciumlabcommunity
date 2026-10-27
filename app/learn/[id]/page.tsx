import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, BadgeCheck, ArrowLeft, Bookmark, Share2, ThumbsUp, MessageCircle, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArticleCard } from '@/components/site/article-card';
import { getMember, getCategory, formatDate } from '@/lib/data';
import { learningResources, learningResourceSections } from '@/lib/learning-resources';

export function generateStaticParams() {
  return learningResources.map((article) => ({ id: article.id }));
}

const typeLabel: Record<string, string> = {
  guide: 'Guide pratique',
  research: 'Résumé de recherche',
  'case-study': 'Étude de cas',
  tutorial: 'Tutoriel',
  article: 'Article',
  reference: 'Référence pratique',
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = learningResources.find((a) => a.id === params.id);
  if (!article) notFound();

  const author = getMember(article.authorId)!;
  const category = getCategory(article.category);
  const related = learningResources.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const sections = learningResourceSections[article.id] || [];

  return (
    <div className="container-px mx-auto max-w-3xl py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/learn" className="hover:text-primary transition-colors">Hub de connaissances</Link>
        <ChevronRight size={14} />
        <Link href={`/learn?cat=${category?.slug}`} className="hover:text-primary transition-colors">{category?.name}</Link>
      </nav>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{typeLabel[article.type]}</Badge>
        {article.evidenceBased ? (
          <Badge variant="outline" className="gap-1 border-accent/30 text-accent">
            <BadgeCheck size={12} /> Basé sur des preuves
          </Badge>
        ) : (
          <Badge variant="outline">Ressource pédagogique</Badge>
        )}
      </div>

      <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${author.id}`}>
            <Avatar className="h-11 w-11">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${author.id}`} className="text-sm font-medium hover:text-primary transition-colors">{author.name}</Link>
            <p className="text-xs text-muted-foreground">{author.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground tabular-nums">
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-8">
        <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
      </div>

      <article className="prose prose-neutral max-w-none">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold mt-8 mb-3">{section.heading}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{section.body}</p>
            {section.points && (
              <ul className="list-disc pl-5 mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
                {section.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            )}
          </section>
        ))}
        <Card className="p-4 my-6 bg-accent/5 border-accent/20">
          <p className="text-sm leading-relaxed">
            <strong className="text-accent">À retenir :</strong> Cette fiche pédagogique donne des repères généraux. Adaptez les pratiques au sol, au climat, à la culture et à la réglementation locale ; demandez conseil à un professionnel en cas de doute.
          </p>
        </Card>
      </article>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/60">
        <Button variant="outline" size="sm" className="gap-1.5"><ThumbsUp size={15} /> Utile</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle size={15} /> Discuter</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Share2 size={15} /> Partager</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Bookmark size={15} /> Enregistrer</Button>
      </div>

      {/* Author card */}
      <Card className="p-5 mt-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Rédigé par</p>
            <Link href={`/profile/${author.id}`} className="font-semibold hover:text-primary transition-colors">{author.name}</Link>
            <p className="text-sm text-muted-foreground mt-0.5">{author.title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{author.bio}</p>
          </div>
          <Button size="sm" variant="outline">Suivre</Button>
        </div>
      </Card>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-5 flex items-center gap-2">
            <BookOpen size={20} className="text-accent" /> Lecture recommandée
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
