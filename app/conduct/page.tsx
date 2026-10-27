import { Card } from '@/components/ui/card';

export default function ConductPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Code de conduite</h1>
      <Card className="mt-6 p-5">
        <p className="leading-relaxed text-muted-foreground">
          Lycium Media Lab est un espace d’échange autour des sciences agricoles. Ces règles s’appliquent aux publications, commentaires et autres interactions communautaires.
        </p>
      </Card>
      <section className="mt-8 space-y-4 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">Contribuer avec respect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Échangez avec respect, même en cas de désaccord; évitez les insultes, le harcèlement et les propos discriminatoires.</li>
          <li>Partagez des informations utiles et signalez clairement les incertitudes; ne présentez pas un avis comme un diagnostic professionnel.</li>
          <li>Publiez uniquement des textes et médias que vous avez le droit de partager; respectez les droits d’auteur et la vie privée.</li>
          <li>Ne publiez pas les coordonnées ou informations personnelles d’une autre personne sans son accord.</li>
          <li>Évitez le spam, les contenus trompeurs et les sollicitations répétées sans rapport avec le sujet.</li>
        </ul>
        <h2 className="font-display text-xl font-semibold">Demander de l’aide</h2>
        <p>
          Pour signaler un contenu ou demander de l’aide, écrivez à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>{' '}
          en indiquant le lien concerné et la raison du signalement. N’incluez pas de données sensibles qui ne sont pas nécessaires. Le traitement et les délais de réponse doivent être confirmés par le porteur du projet.
        </p>
      </section>
    </div>
  );
}
