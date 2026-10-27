import { Card } from '@/components/ui/card';

export default function LegalNoticePage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Mentions légales — informations à confirmer</h1>
      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Ces mentions sont provisoires et ne sont pas complètes.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          La forme juridique, l’adresse postale du porteur et les coordonnées contractuelles complètes des prestataires restent à renseigner avant de présenter ces mentions comme définitives.
        </p>
      </Card>
      <section className="mt-8 space-y-4 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">Éditeur</h2>
        <p>
          Nom du projet : Lycium Media Lab. Responsable de publication communiqué : Al Mahdi Mernissi, Maroc. Adresse postale et forme juridique : à confirmer.
        </p>
        <p>
          Contact : <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>
        <h2 className="font-display text-xl font-semibold">Hébergement</h2>
        <p>
          Vercel est utilisé pour l’hébergement du site et Supabase pour l’authentification et les données communautaires. Les entités contractuelles, adresses et régions de traitement doivent être vérifiées dans les comptes et contrats du projet.
        </p>
        <h2 className="font-display text-xl font-semibold">Statut</h2>
        <p>
          Lycium Media Lab est un projet de partage des connaissances. Les présentes informations signalent les éléments administratifs restant à confirmer et ne remplacent pas des mentions légales complètes.
        </p>
      </section>
    </div>
  );
}
