import Link from 'next/link';
import { BookOpen, FileText, Microscope, FlaskConical, GraduationCap, ClipboardList, Download, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArticleCard, ArticleListItem } from '@/components/site/article-card';
import { articles, categories } from '@/lib/data';

const resourceTypes = [
  { icon: BookOpen, label: 'Educational Articles', count: 120 },
  { icon: Microscope, label: 'Research Summaries', count: 64 },
  { icon: GraduationCap, label: 'Practical Guides', count: 88 },
  { icon: ClipboardList, label: 'Case Studies', count: 42 },
  { icon: FlaskConical, label: 'Tutorials', count: 56 },
  { icon: FileText, label: 'References', count: 210 },
];

export default function LearnPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="container-px mx-auto max-w-7xl relative py-14">
          <Badge className="mb-4 gap-1.5 bg-primary/10 text-primary border-primary/20">
            <BookOpen size={13} /> Knowledge Hub
          </Badge>
          <h1 className="font-display text-3xl lg:text-5xl font-semibold tracking-tight max-w-2xl text-balance">
            Agricultural knowledge, explained with clarity and evidence.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Practical guides, research summaries, case studies, and tutorials — each tagged as evidence-based or experiential so you always know what you are reading.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-10">
            {resourceTypes.map((r) => (
              <Card key={r.label} className="p-4 card-hover">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                  <r.icon size={19} />
                </span>
                <p className="mt-3 text-sm font-medium leading-tight">{r.label}</p>
                <p className="text-xs text-muted-foreground tabular-nums mt-0.5">{r.count} resources</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container-px mx-auto max-w-7xl py-12">
        {/* Featured article */}
        <div className="mb-10">
          <Link href={`/learn/${featured.id}`} className="group block">
            <Card className="overflow-hidden p-0 gap-0 card-hover grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <img src={featured.cover} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground border-0 backdrop-blur-sm">Featured</Badge>
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="text-accent font-medium">Research</span>
                  {featured.evidenceBased && (
                    <Badge variant="outline" className="gap-0.5 border-accent/30 text-accent"><BadgeCheck size={11} /> Evidence-based</Badge>
                  )}
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors">{featured.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <p className="mt-5 text-sm text-muted-foreground">{featured.readTime} read · {featured.publishedAt}</p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          {/* Articles list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Latest resources</h2>
              <div className="flex gap-2 text-sm">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="ghost" size="sm">Guides</Button>
                <Button variant="ghost" size="sm">Research</Button>
                <Button variant="ghost" size="sm">Case Studies</Button>
              </div>
            </div>
            <Separator />
            <div className="divide-y divide-border/60">
              {rest.map((a) => (
                <ArticleListItem key={a.id} article={a} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Browse by category</h3>
              <div className="space-y-1.5">
                {categories.slice(0, 7).map((c) => (
                  <Link key={c.slug} href={`/learn?cat=${c.slug}`} className="flex items-center justify-between py-1.5 text-sm hover:text-primary transition-colors group">
                    <span className="group-hover:translate-x-0.5 transition-transform">{c.name}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-semibold flex items-center gap-1.5"><Download size={16} /> Downloads</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Free soil-testing worksheets, fertilizer calculators, and planting calendars.</p>
              <Button size="sm" className="mt-3 w-full gap-1.5"><Download size={14} /> Browse resources</Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}