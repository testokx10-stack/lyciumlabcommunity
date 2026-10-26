import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, BadgeCheck, ArrowLeft, Bookmark, Share2, ThumbsUp, MessageCircle, FileDown, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArticleCard } from '@/components/site/article-card';
import { articles, getMember, getCategory, formatDate } from '@/lib/data';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

const typeLabel: Record<string, string> = {
  guide: 'Practical Guide',
  research: 'Research Summary',
  'case-study': 'Case Study',
  tutorial: 'Tutorial',
  article: 'Article',
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) notFound();

  const author = getMember(article.authorId)!;
  const category = getCategory(article.category);
  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="container-px mx-auto max-w-3xl py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/learn" className="hover:text-primary transition-colors">Knowledge Hub</Link>
        <ChevronRight size={14} />
        <Link href={`/learn?cat=${category?.slug}`} className="hover:text-primary transition-colors">{category?.name}</Link>
      </nav>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{typeLabel[article.type]}</Badge>
        {article.evidenceBased && (
          <Badge variant="outline" className="gap-1 border-accent/30 text-accent">
            <BadgeCheck size={12} /> Evidence-based
          </Badge>
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

      {/* Article body */}
      <article className="prose prose-neutral max-w-none">
        <p className="text-base leading-relaxed">
          {article.excerpt} This {typeLabel[article.type].toLowerCase()} walks through the core concepts, the supporting evidence, and the practical steps you can apply in the field today.
        </p>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Background</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          For decades, the conventional view held that soil was a largely inert substrate — a physical medium delivering water and dissolved nutrients to roots. We now understand that healthy soil is a living ecosystem, and the interactions between plant roots and soil organisms are central to fertility, drought tolerance, and disease suppression.
        </p>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">What the research shows</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Meta-analyses of long-term trials consistently show that practices which feed the soil food web — cover cropping, reduced tillage, and organic amendments — improve aggregate stability, water-holding capacity, and nutrient-use efficiency within three to five seasons. The effect is strongest on degraded soils and weaker on already high-organic-matter land.
        </p>

        <Card className="p-4 my-6 bg-accent/5 border-accent/20">
          <p className="text-sm leading-relaxed">
            <strong className="text-accent">Key finding:</strong> Fields under continuous cover cropping gained an average of 0.3% soil organic carbon over five years compared to fallow controls — a meaningful shift in the context of annual cropping systems.
          </p>
        </Card>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Practical steps</h2>
        <ol className="list-decimal pl-5 space-y-2 text-base leading-relaxed text-muted-foreground">
          <li>Select a cover crop mix suited to your climate window and primary cash crop rotation.</li>
          <li>Minimize disturbance — move to strip-till or no-till where the system allows.</li>
          <li>Apply compost or manure based on a recent soil test, not a generic schedule.</li>
          <li>Monitor with annual soil organic matter tests and track infiltration rate as a low-cost proxy.</li>
        </ol>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">References</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
          <li>Lal, R. (2020). Soil organic matter and water retention. <em>Journal of Soil and Water Conservation</em>.</li>
          <li>FAO (2023). Soil microbiome management in production agriculture. Technical report.</li>
          <li>Field trial dataset — Lycium Lab community repository (open access).</li>
        </ul>

        {article.type === 'tutorial' && (
          <Card className="p-5 my-6 flex items-center gap-3">
            <FileDown size={20} className="text-accent shrink-0" />
            <div>
              <p className="text-sm font-medium">Download the companion worksheet</p>
              <p className="text-xs text-muted-foreground">A printable PDF checklist for this tutorial.</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto gap-1.5"><FileDown size={14} /> PDF</Button>
          </Card>
        )}
      </article>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/60">
        <Button variant="outline" size="sm" className="gap-1.5"><ThumbsUp size={15} /> Helpful</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle size={15} /> Discuss</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Share2 size={15} /> Share</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Bookmark size={15} /> Save</Button>
      </div>

      {/* Author card */}
      <Card className="p-5 mt-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Written by</p>
            <Link href={`/profile/${author.id}`} className="font-semibold hover:text-primary transition-colors">{author.name}</Link>
            <p className="text-sm text-muted-foreground mt-0.5">{author.title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{author.bio}</p>
          </div>
          <Button size="sm" variant="outline">Follow</Button>
        </div>
      </Card>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-5 flex items-center gap-2">
            <BookOpen size={20} className="text-accent" /> Related reading
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