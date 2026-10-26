'use client';

import { useState, useMemo } from 'react';
import { Search, TrendingUp, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { VideoCardCompact } from '@/components/site/video-card';
import { ArticleListItem } from '@/components/site/article-card';
import { MemberAvatarRow } from '@/components/site/member-card';
import { videos, articles, members, questions, formatCount } from '@/lib/data';
import { cn } from '@/lib/utils';

const types = ['Tout', 'Vidéos', 'Articles', 'Membres', 'Questions'];
const trendingTopics = ['microbiome du sol', 'irrigation goutte-à-goutte', 'NDVI', ' ventilation des serres', 'cultures couvrantes', 'tavelure précoce'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Tout');

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      videos: videos.filter((v) => v.title.toLowerCase().includes(q) || v.tags.some((t) => t.includes(q))),
      articles: articles.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
      members: members.filter((m) => m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.bio.toLowerCase().includes(q)),
      questions: questions.filter((qu) => qu.title.toLowerCase().includes(q) || qu.body.toLowerCase().includes(q)),
    };
  }, [query]);

  const total = results ? results.videos.length + results.articles.length + results.members.length + results.questions.length : 0;

  return (
    <div className="container-px mx-auto max-w-5xl py-10">
      <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight mb-2">Recherche</h1>
      <p className="text-muted-foreground mb-6">Trouvez des vidéos, des articles, des membres et des discussions à travers Lycium Lab.</p>

      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Rechercher partout..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 text-base"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        )}
      </div>

      {!query && (
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-1.5 mb-3"><TrendingUp size={16} className="text-accent" /> Sujets tendances</h2>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((t) => (
                <button key={t} onClick={() => setQuery(t)} className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-3">Recherches suggérées</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {['Calibrer un mètre de chlorophylle', 'Refroidir une serre sans électricité', 'Irrigation goutte-à-goutte pour légumes', 'Résultats de soja sans labour'].map((s) => (
                <button key={s} onClick={() => setQuery(s.split(' ')[1])} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-left hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <Search size={15} className="text-muted-foreground" /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {query && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <p className="text-sm text-muted-foreground">
              {total} résultat{total !== 1 ? 's' : ''} pour <span className="font-medium text-foreground">&quot;{query}&quot;</span>
            </p>
            <div className="flex gap-1.5">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {total === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucun résultat trouvé. Essayez un autre terme ou consultez les sujets tendances ci-dessus.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(type === 'Tout' || type === 'Vidéos') && results!.videos.length > 0 && (
                <Section title="Vidéos" count={results!.videos.length}>
                  <div className="space-y-4">
                    {results!.videos.slice(0, 5).map((v) => <VideoCardCompact key={v.id} video={v} />)}
                  </div>
                </Section>
              )}
              {(type === 'Tout' || type === 'Articles') && results!.articles.length > 0 && (
                <Section title="Articles" count={results!.articles.length}>
                  <Card className="px-5 divide-y divide-border/60">
                    {results!.articles.map((a) => <ArticleListItem key={a.id} article={a} />)}
                  </Card>
                </Section>
              )}
              {(type === 'Tout' || type === 'Membres') && results!.members.length > 0 && (
                <Section title="Membres" count={results!.members.length}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {results!.members.map((m) => <Card key={m.id} className="p-4"><MemberAvatarRow member={m} size={44} /></Card>)}
                  </div>
                </Section>
              )}
              {(type === 'Tout' || type === 'Questions') && results!.questions.length > 0 && (
                <Section title="Questions" count={results!.questions.length}>
                  <div className="space-y-3">
                    {results!.questions.map((qu) => (
                      <Card key={qu.id} className="p-4">
                        <p className="font-medium leading-snug">{qu.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{qu.body}</p>
                        <p className="text-xs text-muted-foreground mt-2 tabular-nums">{qu.answers} réponses · {formatCount(qu.views)} vues</p>
                      </Card>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">{title} <Badge variant="secondary" className="font-normal">{count}</Badge></h2>
      {children}
    </div>
  );
}
