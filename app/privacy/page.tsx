import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Politique de confidentialité</h1>
      <p className="mt-3 text-sm text-muted-foreground">Version 1.0 · Dernière mise à jour : 28 octobre 2026</p>

      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Important</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Cette notice décrit les traitements effectivement observés dans le code et les services actuellement utilisés par Lycium Media Lab. Les informations juridiques complètes (forme juridique, adresse postale, délais détaillés et formalités CNDP/ANRT) doivent être validées par le responsable du projet avant publication publique comme document final.
        </p>
      </Card>

      <section className="mt-8 space-y-5 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">1. Responsable du traitement</h2>
        <p>
          Le site est exploité par Lycium Media Lab. D’après les informations disponibles dans le projet, le contact administratif est{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">Al Mahdi Mernissi</a>{' '}
          (Maroc). L’identité juridique complète, l’adresse postale exacte et le statut de l’entité (personne physique ou structure immatriculée) doivent encore être confirmés avant une version définitive de cette politique. Pour toute demande relative à vos données, contactez le responsable par e-mail à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>

        <h2 className="font-display text-xl font-semibold">2. Données collectées</h2>
        <p>
          Les traitements actuellement identifiés dans le site sont les suivants :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Informations de compte : nom complet, adresse e-mail, mot de passe, session d’authentification.</li>
          <li>Profil utilisateur : photo, biographie, localisation ou autres éléments facultatifs si l’utilisateur les renseigne.</li>
          <li>Contenus communautaires : publications, commentaires, réactions, signalements éventuels.</li>
          <li>Fichiers et images : éléments téléversés ou partagés dans la communauté ou dans les profils.</li>
          <li>Données techniques : adresse IP, journaux de sécurité, données de navigateur, cookies de session et traces nécessaires au bon fonctionnement du site.</li>
          <li>Services tiers : YouTube/Google peuvent recevoir des données techniques lors du chargement de vignettes ou de vidéos.</li>
        </ul>

        <h2 className="font-display text-xl font-semibold">3. Finalités</h2>
        <p>
          Les données sont utilisées pour : créer et gérer un compte utilisateur, authentifier l’accès, faire fonctionner les échanges communautaires, modérer les contenus, gérer les profils et les fichiers, assurer la sécurité du service et répondre aux demandes des utilisateurs. Aucune analyse d’audience ciblée ou newsletter marketing n’est configurée dans le code actuel ; les communications commerciales restent désactivées par défaut.
        </p>

        <h2 className="font-display text-xl font-semibold">4. Droits des personnes concernées</h2>
        <p>
          Conformément à la loi marocaine n° 09-08, les personnes concernées peuvent demander l’accès à leurs données, leur rectification, leur suppression dans la mesure où le traitement le permet, et, lorsque les conditions légales le justifient, l’opposition à certains traitements. Les demandes doivent être adressées à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>{' '}
          en indiquant le contexte, la nature de la demande et les informations nécessaires à l’identification de l’utilisateur. Une vérification d’identité peut être demandée pour prévenir un accès non autorisé aux données.
        </p>

        <h2 className="font-display text-xl font-semibold">5. Conservation et suppression</h2>
        <p>
          Les durées de conservation exactes doivent être confirmées avec le responsable du service et les prestataires. En l’état, les données de compte et les contenus publiés sont conservés tant que le compte est actif ou tant qu’un besoin légitime ou technique le justifie. En cas de fermeture de compte, le projet doit préciser quels contenus, commentaires, fichiers et sauvegardes sont supprimés, anonymisés ou conservés conformément aux obligations légales et techniques.
        </p>

        <h2 className="font-display text-xl font-semibold">6. Prestataires et transferts</h2>
        <p>
          Les prestataires actuellement identifiés sont Vercel (hébergement), Supabase (authentification, base de données et stockage de contenu communautaire) et YouTube/Google pour les vignettes et le lecteur vidéo. Les régions exactes, les sous-traitants et les éventuels transferts hors Union européenne ou hors Maroc doivent être vérifiés dans les contrats et paramètres réels du projet. Le présent site ne doit pas être présenté comme conforme uniquement parce que la base est hébergée en Europe ; la qualification juridique dépend du traitement réel, du pays de traitement et des règles applicables.
        </p>

        <h2 className="font-display text-xl font-semibold">7. Sécurité</h2>
        <p>
          Lycium Media Lab met en place les mesures de sécurité normalement associées à un site moderne : authentification avec Supabase, gestion de session, protection des routes et accès restreint aux ressources selon les règles du projet. Ces mesures doivent être vérifiées et documentées dans la configuration réelle de Supabase et du déploiement. La présente politique ne prétend pas à une certification de sécurité ou à l’existence d’un audit externe.
        </p>

        <h2 className="font-display text-xl font-semibold">8. Version et contact</h2>
        <p>
          Cette politique est mise à jour régulièrement. Elle doit être complétée avec les informations juridiques finales avant toute présentation comme la version officielle du projet. En cas de question, veuillez écrire à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>
        <p>
          Voir aussi : <Link href="/terms" className="text-primary underline">Conditions d’utilisation</Link>, <Link href="/legal-notice" className="text-primary underline">Mentions légales</Link> et <Link href="/conduct" className="text-primary underline">Code de conduite</Link>.
        </p>
      </section>
    </div>
  );
}
