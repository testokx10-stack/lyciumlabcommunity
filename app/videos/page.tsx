'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, TrendingUp, Clock, Eye, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoCard } from '@/components/site/video-card';
import { categories, videos, getCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

const filters = [
  { key: 'latest', label: 'Récents', icon: Clock },
  { key: 'trending', label: 'Tendances', icon: TrendingUp },
  { key: 'most-viewed', label: 'Plus vues', icon: Eye },
  { key: 'most-discussed', label: 'Plus commentés', icon: MessageCircle },
];

function VideosContent() {
  const params = useSearchParams();
  const activeCat = params.get('cat') ?? 'all';
  const filterParam = params.get('filter') ?? 'latest';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(filterParam);
  const [cat, setCat] = useState(activeCat);

  const filtered = useMemo(() => {
    let list = [...videos];
    if (cat !== 'all') list = list.filter((v) => v.category === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) => v.title.toLowerCase().includes(q) || v.tags.some((t) => t.includes(q)),
      );
    }
    switch (filter) {
      case 'trending':
        list.sort((a, b) => Number(b.trending) - Number(a.trending) || b.views - a.views);
        break;
      case 'most-viewed':
        list.sort((a, b) => b.views - a.views);
        break;
      case 'most-discussed':
        list.sort((a, b) => b.comments - a.comments);
        break;
      default:
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return list;
  }, [cat, search, filter]);

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Bibliothèque vidéo</h1>
        <p className="text-muted-foreground">
          {filtered.length} vidéos couvrant {categories.length} catégories de sciences agricoles.
        </p>
      </div>

      <div className="relative mb-6 max-w-xl">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher des vidéos, mots-clés, sujets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1">
          <SlidersHorizontal size={15} /> Trier :
        </span>
        {filters.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? 'default' : 'outline'}
            onClick={() => setFilter(f.key)}
            className="gap-1.5"
          >
            <f.icon size={14} /> {f.label}
          </Button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border/60">
        <button
          onClick={() => setCat('all')}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
            cat === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
          )}
        >
          Toutes les catégories
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              cat === c.slug ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
            )}
          >
            {c.name.split(' & ')[0]}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Aucune vidéo ne correspond à votre recherche. Essayez un autre terme ou une autre catégorie.</p>
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<div className="container-px mx-auto max-w-7xl py-20"><div className="skeleton h-8 w-48 rounded mb-4" /><div className="skeleton h-12 w-full max-w-xl rounded mb-6" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-xl" />)}</div></div>}>
      <VideosContent />
    </Suspense>
  );
}
