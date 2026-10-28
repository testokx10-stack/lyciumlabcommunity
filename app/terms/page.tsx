import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Conditions d’utilisation</h1>
      <p className="mt-3 text-sm text-muted-foreground">Version 1.0 · Dernière mise à jour : 28 octobre 2026</p>

      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Avertissement</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ces conditions sont applicables au service public et éducatif offert par Lycium Media Lab. Elles sont conçues pour refléter les fonctionnalités actuellement disponibles et doivent être complétées avec les informations juridiques finales du responsable du site avant toute version officielle définitive.
        </p>
      </Card>

      <section className="mt-8 space-y-5 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">1. Objet du service</h2>
        <p>
          Lycium Media Lab met à disposition des ressources pédagogiques, des contenus éducatifs et des outils de participation communautaire destinés à la découverte et au partage de connaissances en sciences agricoles. Le site vise à soutenir l’apprentissage, l’échange et la mise en réseau sans remplacer un conseil professionnel spécifique à votre situation.
        </p>

        <h2 className="font-display text-xl font-semibold">2. Création et gestion du compte</h2>
        <p>
          La création d’un compte implique la fourniture d’informations exactes, notamment votre nom et votre adresse e-mail, ainsi qu’un mot de passe fiable. Vous êtes responsable de la confidentialité de vos identifiants et de l’utilisation de votre compte. Les éléments de profil peuvent être ajoutés ou modifiés selon les fonctions du site.
        </p>

        <h2 className="font-display text-xl font-semibold">3. Règles de participation</h2>
        <p>
          Vous acceptez de respecter les règles du site, notamment en matière de courtoisie, de sécurité, de vie privée et de protection des droits d’auteur. Les publications, commentaires et fichiers doivent être utiles, fiables et conformes à la loi. Les contenus illicites, trompeurs, harassants ou abusifs peuvent être signalés et supprimés à la discrétion du modérateur ou du responsable du service.
        </p>

        <h2 className="font-display text-xl font-semibold">4. Responsabilité sur les contenus</h2>
        <p>
          Vous êtes responsable des contenus que vous publiez sur la plateforme. Vous vous engagez à ne pas publier de données personnelles d’autrui sans son autorisation, ni de contenu portant atteinte aux droits d’auteur, à la dignité, à la sécurité ou à la vie privée. Les contenus publiés ne doivent pas être utilisés pour diffuser du spam, des menaces, des sollicitations abusives ou des fausses informations.
        </p>

        <h2 className="font-display text-xl font-semibold">5. Modération, signalements et suspension</h2>
        <p>
          Les signalements peuvent être adressés au projet via <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>. Le responsable du service peut examiner le signalement et prendre des mesures proportionnées, notamment la suppression d’un contenu ou la suspension d’un compte si une violation justifiée est constatée.
        </p>

        <h2 className="font-display text-xl font-semibold">6. Propriété intellectuelle et contenus tiers</h2>
        <p>
          Les contenus publiés par les utilisateurs restent, en principe, de leur propriété, sous réserve des droits des tiers et des conditions du site. Les publications ou fichiers ne doivent pas enfreindre les droits d’auteur, les marques, les images de tiers ou les données personnelles non autorisées. Dans la mesure où le site propose des contenus ou des ressources d’autres fournisseurs, les conditions applicables à ces contenus doivent être respectées.
        </p>

        <h2 className="font-display text-xl font-semibold">7. Disponibilité du service</h2>
        <p>
          Lycium Media Lab s’efforce de maintenir la disponibilité du service, mais ne garantit pas un accès permanent ou exempt d’erreurs. Le site peut être suspendu, mis à jour ou modifié pour des raisons de maintenance, de sécurité ou de conformité. Les modifications importantes de service doivent être portées à la connaissance des utilisateurs quand cela est nécessaire.
        </p>

        <h2 className="font-display text-xl font-semibold">8. Modifications et contact</h2>
        <p>
          Ces conditions peuvent être mises à jour pour refléter les fonctionnalités, les règles de sécurité et les obligations applicables. Pour toute question, veuillez contacter le responsable du service à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>
        <p>
          Consulter aussi : <a href="/privacy" className="text-primary underline">Politique de confidentialité</a>, <a href="/conduct" className="text-primary underline">Code de conduite</a> et <a href="/legal-notice" className="text-primary underline">Mentions légales</a>.
        </p>
      </section>
    </div>
  );
}
