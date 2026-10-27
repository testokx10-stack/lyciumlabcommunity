import Link from 'next/link';
import { BookOpen, FileText, Microscope, FlaskConical, GraduationCap, ClipboardList, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArticleListItem } from '@/components/site/article-card';
import { categories } from '@/lib/data';
import { learningResources, learningResourceTypes } from '@/lib/learning-resources';

const resourceIcons = [
  BookOpen,
  Microscope,
  GraduationCap,
  ClipboardList,
  FlaskConical,
  FileText,
];

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; cat?: string }>;
}) {
  const { type, cat } = await searchParams;
  const selectedType = learningResourceTypes.some((resource) => resource.type === type)
    ? type
    : '';
  const selectedCategory = categories.some((category) => category.slug === cat)
    ? cat
    : '';
  const filteredResources = learningResources.filter((resource) => (
    (!selectedType || resource.type === selectedType) &&
    (!selectedCategory || resource.category === selectedCategory)
  ));
  const featured = !selectedType && !selectedCategory ? learningResources[0] : null;
  const listedResources = featured
    ? filteredResources.filter((resource) => resource.id !== featured.id)
    : filteredResources;

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="container-px mx-auto max-w-7xl relative py-14">
          <Badge className="mb-4 gap-1.5 bg-primary/10 text-primary border-primary/20">
            <BookOpen size={13} /> Hub de connaissances
          </Badge>
          <h1 className="font-display text-3xl lg:text-5xl font-semibold tracking-tight max-w-2xl text-balance">
            Des ressources agricoles claires, utiles et en français.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Des fiches pédagogiques, guides pratiques, études de cas et tutoriels pour mieux comprendre les sols, les cultures, l’irrigation et les technologies agricoles.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-10 sm:grid-cols-3 lg:grid-cols-6">
            {learningResourceTypes.map((resource, index) => {
              const count = learningResources.filter((article) => (
                article.type === resource.type &&
                (!selectedCategory || article.category === selectedCategory)
              )).length;
              const Icon = resourceIcons[index];
              return (
                <Link
                  key={resource.type}
                  href={`/learn?type=${resource.type}${selectedCategory ? `&cat=${selectedCategory}` : ''}#ressources`}
                  scroll={false}
                >
                  <Card className="h-full p-4 card-hover">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon size={19} />
                    </span>
                    <p className="mt-3 text-sm font-medium leading-tight">{resource.label}</p>
                    <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{count} ressource{count > 1 ? 's' : ''}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div id="ressources" className="container-px mx-auto max-w-7xl py-12">
        {/* Featured article */}
        {featured && (
          <div className="mb-10">
            <Link href={`/learn/${featured.id}`} className="group block">
            <Card className="overflow-hidden p-0 gap-0 card-hover grid md:grid-cols-2">
              <div className="relative grid aspect-video place-items-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary text-primary/50 md:aspect-auto">
                <BookOpen size={64} strokeWidth={1.25} />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground border-0 backdrop-blur-sm">En vedette</Badge>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="mb-3">À découvrir · Ressource pédagogique</Badge>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors">{featured.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <p className="mt-5 text-sm text-muted-foreground">{featured.readTime} de lecture · Contenu éditorial</p>
              </div>
            </Card>
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          {/* Articles list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {selectedType
                  ? learningResourceTypes.find((resource) => resource.type === selectedType)?.label
                  : selectedCategory
                    ? categories.find((category) => category.slug === selectedCategory)?.name
                    : 'Toutes les ressources'}
              </h2>
              <div className="flex gap-2 text-sm">
                <Button asChild variant={!selectedType ? 'outline' : 'ghost'} size="sm">
                  <Link href={`/learn${selectedCategory ? `?cat=${selectedCategory}` : ''}#ressources`}>Tout</Link>
                </Button>
                {learningResourceTypes.slice(2, 5).map((resource) => (
                  <Button key={resource.type} asChild variant={selectedType === resource.type ? 'outline' : 'ghost'} size="sm" className="hidden sm:inline-flex">
                    <Link href={`/learn?type=${resource.type}${selectedCategory ? `&cat=${selectedCategory}` : ''}#ressources`}>
                      {resource.type === 'guide' ? 'Guides' : resource.type === 'case-study' ? 'Études de cas' : 'Tutoriels'}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="divide-y divide-border/60">
              {listedResources.length ? (
                listedResources.map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))
              ) : (
                <p className="py-8 text-sm text-muted-foreground">Aucune ressource dans cette catégorie pour le moment.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Parcourir par catégorie</h3>
              <div className="space-y-1.5">
                {categories.slice(0, 10).map((category) => (
                  <Link key={category.slug} href={`/learn?cat=${category.slug}${selectedType ? `&type=${selectedType}` : ''}#ressources`} className="flex items-center justify-between py-1.5 text-sm hover:text-primary transition-colors group">
                    <span className="group-hover:translate-x-0.5 transition-transform">{category.name}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-semibold flex items-center gap-1.5"><Download size={16} /> Conseils pratiques</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Retrouvez des repères pour préparer un prélèvement de sol, planifier une rotation et suivre une irrigation.</p>
              <Button asChild size="sm" className="mt-3 w-full gap-1.5"><Link href="#ressources"><Download size={14} /> Parcourir les ressources</Link></Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
