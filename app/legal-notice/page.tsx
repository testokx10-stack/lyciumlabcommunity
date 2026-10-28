import { Card } from '@/components/ui/card';

export default function LegalNoticePage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Mentions légales</h1>
      <p className="mt-3 text-sm text-muted-foreground">Version 1.0 · Dernière mise à jour : 28 octobre 2026</p>

      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Mentions provisoires à valider</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ces mentions sont destinées à documenter le site en cours de fonctionnement et à exposer les informations vérifiées à ce jour. L’identité juridique complète, l’adresse postale et les coordonnées formelles des prestataires doivent être confirmées par le responsable avant une version définitive.
        </p>
      </Card>

      <section className="mt-8 space-y-5 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">1. Éditeur / responsable de publication</h2>
        <p>
          Nom du projet : Lycium Media Lab. Le responsable de publication indiqué dans le projet est Al Mahdi Mernissi, basé au Maroc. L’identité juridique exacte, la forme sociale (personne physique ou entité juridique), l’adresse postale et les éventuels numéros d’immatriculation restent à confirmer.
        </p>
        <p>
          Contact : <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>
        </p>

        <h2 className="font-display text-xl font-semibold">2. Objet du service</h2>
        <p>
          Lycium Media Lab propose un espace de partage de connaissances, d’apprentissage et d’échanges autour des sciences agricoles et de l’innovation. Le projet ne prétend pas à une certification officielle ni à une autorisation réglementaire sans justificatif.
        </p>

        <h2 className="font-display text-xl font-semibold">3. Hébergement et sous-traitance</h2>
        <p>
          Le site est hébergé par Vercel. L’authentification, la base de données et les contenus communautaires sont gérés via Supabase. YouTube/Google peut être utilisé pour l’affichage de vignettes et de vidéos. Les coordonnées contractuelles complètes, les régions de traitement et les sous-traitants doivent être vérifiés dans la configuration réelle du projet et les contrats de prestataires.
        </p>

        <h2 className="font-display text-xl font-semibold">4. Contact pour la modération et les demandes</h2>
        <p>
          Pour signaler un contenu, demander des informations sur les données personnelles ou contacter le responsable pour des questions juridiques, veuillez écrire à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>

        <h2 className="font-display text-xl font-semibold">5. Statut</h2>
        <p>
          Ces mentions légales doivent être considérées comme une première version de documentation civique et technique. Elles ne remplacent ni un avis juridique, ni les formalités administratives à compléter auprès des autorités compétentes.
        </p>
      </section>
    </div>
  );
}
