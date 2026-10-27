import Link from 'next/link';
import { ArrowRight, Sparkles, Leaf, Layers, Wheat, Droplets, Bug, FlaskConical, Home as HomeIcon, Cpu, Recycle, Microscope, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArticleCard } from '@/components/site/article-card';
import { categories } from '@/lib/data';
import { learningResources } from '@/lib/learning-resources';
import { Logo } from '@/components/site/logo';

export default function Home() {
  const latestArticles = learningResources.slice(0, 3);

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
                <Sparkles size={13} /> Sciences agricoles · Ressources · Éducation
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-balance">
                Cultiver les connaissances. <span className="gradient-text">Privilégier l&apos;innovation.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl text-balance">
                Un espace de ressources pédagogiques en sciences agricoles, conçu pour rapprocher les connaissances du terrain.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 text-base h-12 px-6">
                  <Link href="/learn"><BookOpen size={18} /> Consulter les ressources</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-base h-12 px-6">
                  <a href="#mission">Découvrir le projet <ArrowRight size={17} /></a>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf size={16} className="text-accent" /> Partage ouvert · Ressources et communauté
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
              <Card className="flex min-h-80 flex-col items-center justify-center gap-5 p-8 text-center">
                <Logo size="lg" />
                <p className="max-w-sm text-muted-foreground">
                  Un espace ouvert pour consulter des ressources et partager des connaissances agricoles.
                </p>
                <Badge variant="outline">Éducation ouverte · Partage des connaissances</Badge>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="container-px mx-auto max-w-7xl py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Card className="flex min-h-[25rem] flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/10 p-8">
              <div className="grid grid-cols-3 gap-5 text-primary/70">
                <Leaf size={34} />
                <Microscope size={34} />
                <Layers size={34} />
              </div>
              <Logo size="lg" />
              <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                Des contenus pédagogiques pour explorer les sciences végétales, les sols, l’eau et les pratiques agricoles.
              </p>
            </Card>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-lg">
              Ressources en français
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
              Lycium Media Lab partage des connaissances en sciences agricoles pour les rendre plus accessibles et utiles à toutes et tous.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Microscope, title: "Rigueur et prudence", desc: "Les fiches distinguent les repères pédagogiques des conseils professionnels adaptés à une situation particulière." },
                { icon: BookOpen, title: "Des ressources pédagogiques", desc: "Des fiches en français pour explorer les sujets agricoles et approfondir ses connaissances." },
                { icon: Users, title: "Une communauté ouverte", desc: "Posez vos questions et partagez des connaissances avec les autres membres." },
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
          <SectionHeader eyebrow="Parcourir par sujet" title="Thèmes abordés" href="/learn" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/learn?cat=${cat.slug}#ressources`}>
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
          title="Ressources pédagogiques"
          href="/learn"
          icon={<BookOpen size={16} className="text-accent" />}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latestArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Participation */}
      <section id="contact" className="container-px mx-auto max-w-7xl py-20">
        <Card className="mx-auto max-w-3xl p-8 text-center sm:p-12">
          <Badge variant="outline" className="mb-4">Rejoindre la communauté</Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Partageons les connaissances agricoles.</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Créez un compte pour poser vos questions, échanger avec d’autres membres et partager vos connaissances.
          </p>
          <Button asChild className="mt-6"><Link href="/register">Créer un compte <ArrowRight size={16} className="ml-2" /></Link></Button>
        </Card>
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
