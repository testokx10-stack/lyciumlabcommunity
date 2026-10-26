import Link from 'next/link';
import { Clock, ArrowUpRight, BadgeCheck, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Article, formatDate, getMember, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

const typeLabel: Record<Article['type'], string> = {
  guide: 'Practical Guide',
  research: 'Research',
  'case-study': 'Case Study',
  tutorial: 'Tutorial',
  article: 'Article',
};

export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  const author = getMember(article.authorId);
  const category = getCategory(article.category);

  return (
    <Link href={`/learn/${article.id}`} className={cn('group block', className)}>
      <Card className="overflow-hidden card-hover p-0 gap-0 h-full flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={article.cover}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-background/90 text-foreground border-0 backdrop-blur-sm">
              <FileText size={12} className="mr-1" /> {typeLabel[article.type]}
            </Badge>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="text-accent font-medium">{category?.name.split(' & ')[0]}</span>
            {article.evidenceBased && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 gap-0.5 border-accent/30 text-accent">
                <BadgeCheck size={11} /> Evidence-based
              </Badge>
            )}
          </div>
          <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                {author && <AvatarImage src={author.avatar} alt={author.name} />}
                <AvatarFallback>{author?.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium leading-tight">{author?.name}</p>
                <p className="text-muted-foreground">{formatDate(article.publishedAt)}</p>
              </div>
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
      <div className="relative w-28 shrink-0 aspect-[16/9] rounded-lg overflow-hidden">
        <img src={article.cover} alt={article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
}
