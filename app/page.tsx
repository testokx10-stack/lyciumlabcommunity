import Link from 'next/link';
import { ArrowRight, Play, Sparkles, TrendingUp, Eye, Leaf, Layers, Wheat, Droplets, Bug, FlaskConical, Home as HomeIcon, Cpu, Recycle, Microscope, Users, BookOpen, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/site/video-card';
import { ArticleCard } from '@/components/site/article-card';
import { MemberCard } from '@/components/site/member-card';
import { categories, videos, members, formatCount } from '@/lib/data';
import { learningResources } from '@/lib/learning-resources';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const [membersResult, communityVideosResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('media_type', 'video'),
  ]);
  if (membersResult.error) console.error('Failed to load homepage member count:', membersResult.error);
  if (communityVideosResult.error) console.error('Failed to load homepage video count:', communityVideosResult.error);

  const memberCount = membersResult.error ? null : membersResult.count;
  const videoCount = communityVideosResult.error ? null : videos.length + (communityVideosResult.count || 0);
  const featured = videos.filter((v) => v.featured);
  const trending = videos.filter((v) => v.trending).slice(0, 4);
  const latestArticles = learningResources.slice(0, 3);
  const experts = members.filter((m) => m.role === 'expert' || m.role === 'moderator').slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

        <div className="container-px mx-auto max-w-7xl relative pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div className="animate-fade-up">
              <Badge className="mb-5 gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                <Sparkles size={13} /> Sciences agricoles · Communauté · Éducation
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-balance">
                Cultiver les connaissances. <span className="gradient-text">Privilégier l&apos;innovation.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl text-balance">
                Découvrez les sciences agricoles, partagez votre expertise et cultivons ensemble la communauté de Lycium Bio Lab.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 text-base h-12 px-6">
                  <Link href="/videos"><Play size={18} fill="currentColor" /> Explorer les vidéos</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-base h-12 px-6">
                  <Link href="/register"><Users size={18} /> Rejoindre la communauté</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Leaf size={16} className="text-accent" /> {categories.length} catégories spécialisées</span>
                <span className="flex items-center gap-2"><Users size={16} className="text-accent" /> {memberCount === null ? 'Indisponible' : memberCount.toLocaleString('fr-FR')} membres</span>
                <span className="flex items-center gap-2"><Play size={16} className="text-accent" /> {videoCount === null ? 'Indisponible' : videoCount.toLocaleString('fr-FR')} vidéos disponibles</span>
              </div>
            </div>

            {/* Featured video preview */}
            <div className="relative animate-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-border/50">
                <img
                  src={featured[0].thumbnail}
                  alt={featured[0].title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <Link href={`/videos/${featured[0].id}`} className="absolute inset-0 grid place-items-center group">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur-md text-white ring-1 ring-white/30 group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                    <Play size={28} className="ml-1" fill="currentColor" />
                  </span>
                </Link>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <Badge className="mb-2 bg-accent/90 border-0">À la une</Badge>
                  <h3 className="font-display text-xl font-semibold leading-snug line-clamp-2">{featured[0].title}</h3>
                  <p className="text-sm text-white/80 mt-1">{formatCount(featured[0].views)} vues</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2 rounded-xl bg-card border border-border shadow-lg px-4 py-3 animate-float">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                  <TrendingUp size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">Tendance maintenant</p>
                  <p className="text-xs text-muted-foreground">{formatCount(trending.length)} nouveaux cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured video strip */}
      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeader
          eyebrow="Sélectionné"
          title="À la une cette semaine"
          href="/videos"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-px mx-auto max-w-7xl py-16">
          <SectionHeader
            eyebrow="Ce que regarde la communauté"
            title="Vidéos agricoles tendances"
            href="/videos?filter=trending"
            icon={<TrendingUp size={16} className="text-accent" />}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="container-px mx-auto max-w-7xl py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.pexels.com/photos/3912470/pexels-photo-3912470.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Recherche en laboratoire" className="rounded-2xl object-cover h-56 w-full shadow-md" />
                <img src="https://images.pexels.com/photos/17765487/pexels-photo-17765487.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" alt="Irrigation" className="rounded-2xl object-cover h-40 w-full shadow-md" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://images.pexels.com/photos/20075896/pexels-photo-20075896.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" alt="Serre" className="rounded-2xl object-cover h-40 w-full shadow-md" />
                <img src="https://images.pexels.com/photos/34182409/pexels-photo-34182409.jpeg?auto=compress&cs=tinysrgb&h=500&w=400" alt="Agriculture par drone" className="rounded-2xl object-cover h-56 w-full shadow-md" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-5 py-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent"><Leaf size={16} /></span>
              <span className="text-sm font-medium">Science et communauté</span>
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-4 gap-1.5 border-accent/30 text-accent">
              <Microscope size={13} /> Notre mission
            </Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
              Rendre les sciences agricoles accessibles, pratiques et engageantes pour tous.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Lycium Bio Lab comble le fossé entre la recherche et le terrain. Nous réunissons agriculteurs, agronomes, chercheurs et étudiants pour partager des connaissances fondées sur des preuves — des microbiomes du sol aux drones de précision — sous une forme réellement utile.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Microscope, title: "D'abord la preuve", desc: "Nous séparons clairement les résultats évalués par les pairs de l'expérience personnelle." },
                { icon: Users, title: "Une communauté, pas une diffusion", desc: "Chaque membre peut enseigner, poser des questions et contribuer — aucun doctorat requis." },
                { icon: BookOpen, title: "Pratique par conception", desc: "Des guides, tutoriels et études de cas éprouvés sur le terrain que vous pouvez appliquer dès aujourd'hui." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <f.icon size={19} />
                  </span>
                  <div>
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-px mx-auto max-w-7xl py-16">
          <SectionHeader eyebrow="Parcourir par sujet" title="Catégories populaires" href="/videos" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/videos?cat=${cat.slug}`}>
                <Card className="p-5 card-hover h-full group">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}>
                    <CategoryIcon name={cat.icon} />
                  </span>
                  <h3 className="mt-3.5 font-medium leading-snug group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cat.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest discoveries */}
      <section className="container-px mx-auto max-w-7xl py-16">
        <SectionHeader
          eyebrow="Du hub de connaissances"
          title="Dernières découvertes scientifiques et innovations"
          href="/learn"
          icon={<BookOpen size={16} className="text-accent" />}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latestArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Community experts */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-px mx-auto max-w-7xl py-16">
          <SectionHeader
            eyebrow="Rencontrez la communauté"
            title="Membres et experts agricoles en vedette"
            href="/community"
            icon={<Users size={16} className="text-accent" />}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="container-px mx-auto max-w-7xl py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-8 lg:p-14">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/10 blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-white/15 text-white border-0 gap-1.5">
                <Mail size={13} /> Newsletter
              </Badge>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
                Le meilleur des sciences agricoles, directement dans votre boîte de réception.
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed max-w-md">
                Un résumé hebdomadaire des nouvelles vidéos, des synthèses de recherche et des actualités de la communauté. Pas de spam — juste des signaux dignes de croissance.
              </p>
            </div>
            <div className="lg:justify-self-end w-full max-w-md">
              <form className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Input
                    type="email"
                    placeholder="vous@ferme.com"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/40"
                  />
                  <Button size="lg" variant="secondary" className="h-12 gap-1.5 shrink-0">
                    S&apos;abonner <ArrowRight size={17} />
                  </Button>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <CheckCircle2 size={14} /> Rejoignez 12 400+ lecteurs. Désabonnez-vous à tout moment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, href, icon }: { eyebrow: string; title: string; href: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-accent flex items-center gap-1.5">
          {icon} {eyebrow}
        </p>
        <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight mt-1">{title}</h2>
      </div>
      <Link href={href} className="group flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
        Voir tout <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const map: Record<string, React.ElementType> = {
    Leaf, Layers, Wheat, Droplets, Bug, FlaskConical, Home: HomeIcon, Cpu, Recycle, Microscope,
  };
  const Icon = map[name] ?? Leaf;
  return <Icon size={20} />;
}
