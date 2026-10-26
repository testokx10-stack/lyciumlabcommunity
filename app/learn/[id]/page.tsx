import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, BadgeCheck, ArrowLeft, Bookmark, Share2, ThumbsUp, MessageCircle, FileDown, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArticleCard } from '@/components/site/article-card';
import { articles, getMember, getCategory, formatDate } from '@/lib/data';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

const typeLabel: Record<string, string> = {
  guide: 'Guide pratique',
  research: 'Résumé de recherche',
  'case-study': 'Étude de cas',
  tutorial: 'Tutoriel',
  article: 'Article',
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) notFound();

  const author = getMember(article.authorId)!;
  const category = getCategory(article.category);
  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="container-px mx-auto max-w-3xl py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/learn" className="hover:text-primary transition-colors">Hub de connaissances</Link>
        <ChevronRight size={14} />
        <Link href={`/learn?cat=${category?.slug}`} className="hover:text-primary transition-colors">{category?.name}</Link>
      </nav>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{typeLabel[article.type]}</Badge>
        {article.evidenceBased && (
          <Badge variant="outline" className="gap-1 border-accent/30 text-accent">
            <BadgeCheck size={12} /> Basé sur des preuves
          </Badge>
        )}
      </div>

      <h1 className="font-display text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${author.id}`}>
            <Avatar className="h-11 w-11">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${author.id}`} className="text-sm font-medium hover:text-primary transition-colors">{author.name}</Link>
            <p className="text-xs text-muted-foreground">{author.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground tabular-nums">
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-8">
        <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
      </div>

      {/* Article body */}
      <article className="prose prose-neutral max-w-none">
        <p className="text-base leading-relaxed">
          {article.excerpt} Cette {typeLabel[article.type].toLowerCase()} parcourt les concepts clés, les preuves soutenues et les étapes pratiques que vous pouvez appliquer sur le terrain dès aujourd'hui.
        </p>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Contexte</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Pendant des décennies, la vision conventionnelle considérait le sol comme un substrat passif — un milieu physique transportant l'eau et les nutriments dissous vers les racines. Nous savons aujourd'hui que le sol sain est un écosystème vivant, et les interactions entre les racines des plantes et les organismes du sol sont au cœur de la fertilité, de la résistance à la sécheresse et de la lutte contre les maladies.
        </p>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Ce que montre la recherche</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Des méta-analyses d'essais à long terme montrent consistentement que les pratiques qui nourrissent la faune du sol — cultures couvrantes, réduction du travail du sol et amendements organiques — améliorent la stabilité des agrégats, la capacité de rétention d'eau et l'efficacité d'utilisation des nutriments en trois à cinq saisons. L'effet est le plus fort sur les sols dégradés et plus faible sur les sols déjà riches en matière organique.
        </p>

        <Card className="p-4 my-6 bg-accent/5 border-accent/20">
          <p className="text-sm leading-relaxed">
            <strong className="text-accent">Point clé :</strong> Les parcelles sous cultures couvrantes continues ont accumulé en moyenne 0,3 % de carbone organique du sol en cinq ans par rapport aux témoins à repos — un changement significatif dans le contexte des systèmes de culture annuelle.
          </p>
        </Card>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Étapes pratiques</h2>
        <ol className="list-decimal pl-5 space-y-2 text-base leading-relaxed text-muted-foreground">
          <li>Sélectionnez un mélange de culture couvrante adapté à votre fenêtre climatique et à votre rotation principale.</li>
          <li>Minimisez les efforts — passez au labour sur bande ou au travail du sol zéro là que le système le permet.</li>
          <li>Appliquez du compost ou du fumier en fonction d'un test de sol récent, pas selon un horaire générique.</li>
          <li>Suivez avec des tests annuels de matière organique du sol et mesurez le taux d'infiltration comme indicateur à faible coût.</li>
        </ol>

        <h2 className="font-display text-xl font-semibold mt-8 mb-3">Références</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
          <li>Lal, R. (2020). Matière organique du sol et rétention d'eau. <em>Journal of Soil and Water Conservation</em>.</li>
          <li>FAO (2023). Gestion du microbiome du sol en agriculture de production. Rapport technique.</li>
          <li>Jeu de données d'essai sur le terrain — répertoire communautaire Lycium Lab (accès ouvert).</li>
        </ul>

        {article.type === 'tutorial' && (
          <Card className="p-5 my-6 flex items-center gap-3">
            <FileDown size={20} className="text-accent shrink-0" />
            <div>
              <p className="text-sm font-medium">Télécharger la feuille de calcul</p>
              <p className="text-xs text-muted-foreground">Une liste de contrôle PDF imprimable pour ce tutoriel.</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto gap-1.5"><FileDown size={14} /> PDF</Button>
          </Card>
        )}
      </article>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/60">
        <Button variant="outline" size="sm" className="gap-1.5"><ThumbsUp size={15} /> Utile</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle size={15} /> Discuter</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Share2 size={15} /> Partager</Button>
        <Button variant="outline" size="sm" className="gap-1.5"><Bookmark size={15} /> Enregistrer</Button>
      </div>

      {/* Author card */}
      <Card className="p-5 mt-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Rédigé par</p>
            <Link href={`/profile/${author.id}`} className="font-semibold hover:text-primary transition-colors">{author.name}</Link>
            <p className="text-sm text-muted-foreground mt-0.5">{author.title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{author.bio}</p>
          </div>
          <Button size="sm" variant="outline">Suivre</Button>
        </div>
      </Card>

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
