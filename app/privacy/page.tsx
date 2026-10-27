import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Confidentialité et données personnelles</h1>
      <p className="mt-3 text-sm text-muted-foreground">Information sur le fonctionnement actuel de Lycium Media Lab</p>
      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Informations administratives à confirmer</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Lycium Media Lab est exploité par Al Mahdi Mernissi au Maroc, selon les informations communiquées par le porteur. L’adresse postale, la forme juridique, les durées de conservation, les régions de traitement et les formalités applicables au Maroc restent à confirmer. Cette notice décrit les traitements connus et doit être complétée après vérification; elle ne constitue pas un avis juridique.
        </p>
      </Card>
      <section className="mt-8 space-y-4 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">Qui traite vos données et pourquoi ?</h2>
        <p>
          Le projet a pour objectif déclaré de partager des connaissances et d’aider les visiteurs, sans objectif de profit. Pour toute question ou demande relative à vos données, contactez Al Mahdi Mernissi à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>
        <p>
          <strong>Consultation du site :</strong> vous n’avez pas à fournir votre nom ou votre adresse e-mail pour lire les pages. Vercel, le prestataire d’hébergement, peut traiter des données techniques de requête et de sécurité, telles que l’adresse IP, afin de fournir et protéger le site. Les journaux, leur durée de conservation et les régions de traitement doivent être confirmés.
        </p>
        <p>
          <strong>Création et utilisation d’un compte :</strong> l’inscription demande votre nom, votre adresse e-mail et un mot de passe. Supabase fournit l’authentification et stocke les informations nécessaires au compte; le mot de passe sert à vous authentifier. Le site utilise des mécanismes de session nécessaires au maintien de la connexion. Les réglages de cookies et de stockage du navigateur peuvent dépendre de votre navigateur et de Supabase.
        </p>
        <p>
          <strong>Participation communautaire :</strong> si vous choisissez de participer, les textes publiés, commentaires et réactions sont traités pour faire fonctionner la communauté et peuvent être visibles par les autres visiteurs selon les réglages du site. Dans les paramètres du compte, vous pouvez également fournir des éléments de profil facultatifs tels qu’une biographie, une localisation ou une photo. Ne publiez pas d’information personnelle ou de contenu que vous n’êtes pas autorisé à partager. Les données de compte et les contenus associés sont hébergés via Supabase; les délais de conservation et les procédures de suppression doivent être confirmés. Vous pouvez demander de l’aide à l’adresse de contact indiquée ci-dessus.
        </p>
        <p>
          <strong>Vidéos YouTube :</strong> les vignettes de la bibliothèque sont chargées depuis YouTube et peuvent transmettre à Google/YouTube des données techniques, dont votre adresse IP et des informations sur votre navigateur. Sur la page de détail, le lecteur YouTube ne se charge qu’après votre clic sur « Charger la vidéo YouTube »; YouTube peut alors utiliser ses propres cookies ou identifiants selon votre navigateur et ses réglages. Les vidéos restent hébergées par YouTube. Consultez la{' '}
          <a className="text-primary underline" href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noreferrer">politique de confidentialité de Google</a>.
        </p>
        <p>
          <strong>Mesure d’audience et prospection :</strong> le site ne propose actuellement ni formulaire de newsletter, ni publicité ciblée, ni outil d’analyse d’audience configuré par Lycium Media Lab.
        </p>
        <h2 className="font-display text-xl font-semibold">Prestataires, transferts et durée</h2>
        <p>
          Les prestataires techniques identifiés sont Vercel pour l’hébergement et Supabase pour l’authentification et les données communautaires; Google/YouTube fournit les vignettes et lecteurs vidéo. Leurs entités contractuelles, sous-traitants, lieux de traitement et transferts éventuels ne sont pas encore confirmés. Les durées de conservation précises restent également à établir. Ces informations doivent être vérifiées et précisées auprès des prestataires.
        </p>
        <h2 className="font-display text-xl font-semibold">Vos demandes et cadre marocain</h2>
        <p>
          Vous pouvez écrire à l’adresse de contact pour demander des informations, accéder à vos données, demander leur rectification ou leur suppression, ou vous opposer à un traitement lorsque cela s’applique. Une vérification proportionnée de votre identité peut être nécessaire. Le porteur doit confirmer les modalités et délais de traitement de ces demandes.
        </p>
        <p>
          Les obligations de la loi marocaine n° 09-08, les formalités auprès de la{' '}
          <a className="text-primary underline" href="https://www.cndp.ma/" target="_blank" rel="noreferrer">CNDP</a>{' '}
          et les conditions applicables aux transferts internationaux doivent être vérifiées. L’objectif éducatif et le caractère non commercial déclaré du projet ne dispensent pas de ces vérifications.
        </p>
        <p>
          Une inscription au site n’est pas une adhésion à une association. Pour les règles d’utilisation, consultez les{' '}
          <Link href="/terms" className="text-primary underline">conditions d’utilisation</Link> et le{' '}
          <Link href="/conduct" className="text-primary underline">code de conduite</Link>.
        </p>
      </section>
    </div>
  );
}
