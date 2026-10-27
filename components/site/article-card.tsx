import Link from 'next/link';
import { Clock, ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

const typeLabel: Record<Article['type'], string> = {
  guide: 'Guide pratique',
  research: 'Synthèse pédagogique',
  'case-study': 'Exemple pédagogique',
  tutorial: 'Tutoriel',
  article: 'Article',
  reference: 'Référence',
};

export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  const category = getCategory(article.category);

  return (
    <Link href={`/learn/${article.id}`} className={cn('group block', className)}>
      <Card className="overflow-hidden card-hover p-0 gap-0 h-full flex flex-col">
        <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary text-primary/50">
          <BookOpen size={42} strokeWidth={1.5} />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-background/90 text-foreground border-0 backdrop-blur-sm">
              <FileText size={12} className="mr-1" /> Ressource pédagogique
            </Badge>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="text-accent font-medium">{category?.name.split(' & ')[0]}</span>
          </div>
          <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium leading-tight text-foreground">Lycium Bio Lab</p>
              <p>Contenu éditorial</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Clock size={13} /> {article.readTime}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link href={`/learn/${article.id}`} className="group flex items-start gap-4 py-4">
      <div className="grid w-28 shrink-0 aspect-[16/9] place-items-center rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary text-primary/50">
        <BookOpen size={22} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="text-accent font-medium">{typeLabel[article.type]}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <h4 className="font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
      </div>
      <ArrowUpRight size={18} className="text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
    </Link>
  );
};
