'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArticleListItem } from '@/components/site/article-card';
import { VideoCard } from '@/components/site/video-card';
import { videos } from '@/lib/data';
import { learningResources } from '@/lib/learning-resources';

const suggestedTopics = ['microbiome du sol', 'irrigation goutte-à-goutte', 'ventilation des serres', 'cultures couvrantes', 'maladies des plantes'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Tout');

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLocaleLowerCase('fr');
    return {
      articles: learningResources.filter((article) => (
        article.title.toLocaleLowerCase('fr').includes(q)
        || article.excerpt.toLocaleLowerCase('fr').includes(q)
      )),
      videos: videos.filter((video) => (
        video.title.toLocaleLowerCase('fr').includes(q)
        || video.description.toLocaleLowerCase('fr').includes(q)
        || video.tags.some((tag) => tag.toLocaleLowerCase('fr').includes(q))
      )),
    };
  }, [query]);

  const total = results ? results.articles.length + results.videos.length : 0;

  return (
    <div className="container-px mx-auto max-w-5xl py-10">
      <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight mb-2">Recherche</h1>
      <p className="text-muted-foreground mb-6">Recherchez dans les ressources pédagogiques et les vidéos de Lycium Media Lab.</p>
      <p className="mb-6 text-sm text-muted-foreground">
        Les résultats vidéo affichent des vignettes fournies par YouTube, qui peut recevoir des données techniques lors de leur chargement. <Link href="/privacy" className="underline underline-offset-4">En savoir plus</Link>.
      </p>

      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Rechercher dans les ressources..."
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
            <h2 className="text-sm font-semibold mb-3">Explorer des sujets agricoles</h2>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((t) => (
                <button key={t} onClick={() => setQuery(t)} className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                  {t}
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
            <span className="rounded-full bg-secondary px-3 py-1.5 text-sm">Ressources pédagogiques</span>
          </div>

          {total === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucune ressource ne correspond à cette recherche. Essayez un autre terme.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results!.articles.length > 0 && (
                <Section title="Articles" count={results!.articles.length}>
                  <Card className="px-5 divide-y divide-border/60">
                    {results!.articles.map((a) => <ArticleListItem key={a.id} article={a} />)}
                  </Card>
                </Section>
              )}
              {results!.videos.length > 0 && (
                <Section title="Vidéos YouTube" count={results!.videos.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results!.videos.map((video) => <VideoCard key={video.id} video={video} />)}
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
