import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/site/article-card';
import { getCategory } from '@/lib/data';
import { learningResources, learningResourceSections } from '@/lib/learning-resources';

export function generateStaticParams() {
  return learningResources.map((article) => ({ id: article.id }));
}

const typeLabel: Record<string, string> = {
  guide: 'Guide pratique',
  research: 'Synthèse pédagogique',
  'case-study': 'Exemple pédagogique',
  tutorial: 'Tutoriel',
  article: 'Article',
  reference: 'Référence pratique',
};

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = learningResources.find((a) => a.id === id);
  if (!article) notFound();

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
        <Badge variant="secondary">Ressource pédagogique · {typeLabel[article.type]}</Badge>
      </div>

      <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pb-6 border-b border-border/60">
        <p className="text-sm text-muted-foreground">Contenu éditorial · Lycium Bio Lab</p>
        <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock size={14} /> {article.readTime}</span>
      </div>

      <div className="my-8 grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary text-primary/50">
        <BookOpen size={72} strokeWidth={1.25} />
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
