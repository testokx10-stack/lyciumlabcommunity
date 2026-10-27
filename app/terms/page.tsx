import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Conditions d’utilisation</h1>
      <Card className="mt-6 border-amber-500/40 p-5">
        <p className="font-medium">Règles d’utilisation provisoires</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ces règles expliquent le fonctionnement attendu du site, mais nécessitent une vérification juridique et administrative. Le porteur actuel est Al Mahdi Mernissi au Maroc; l’adresse postale et la forme juridique restent à confirmer. Une inscription au site ne constitue pas une adhésion à une association.
        </p>
      </Card>
      <section className="mt-8 space-y-4 leading-relaxed">
        <h2 className="font-display text-xl font-semibold">Utilisation et comptes</h2>
        <p>
          Lycium Bio Lab met à disposition des ressources éducatives en sciences agricoles et des fonctions de compte et de participation communautaire. Vous devez fournir des informations exactes pour votre compte et protéger vos identifiants. Vous pouvez demander de l’aide concernant votre compte à{' '}
          <a className="text-primary underline" href="mailto:almahdi.mernissi@gmail.com">almahdi.mernissi@gmail.com</a>.
        </p>
        <p>
          Les contenus du site sont fournis à des fins d’information et d’éducation; ils ne remplacent pas un diagnostic ou un conseil professionnel adapté à votre situation.
        </p>
        <h2 className="font-display text-xl font-semibold">Contenus publiés par les membres</h2>
        <p>
          Vous êtes responsable des textes et médias que vous publiez. Ne publiez que des contenus que vous avez le droit de partager; respectez les droits d’auteur, la vie privée et les personnes. N’ajoutez pas de données personnelles d’autrui sans autorisation et ne publiez pas de contenu illégal, menaçant, harcelant, trompeur ou destiné au spam.
        </p>
        <p>
          Les publications communautaires peuvent être visibles par les autres visiteurs selon les fonctionnalités et réglages du site. En publiant, vous autorisez leur affichage sur Lycium Bio Lab pour faire fonctionner le service; vous conservez vos droits sur vos contenus. Contactez l’adresse ci-dessus pour demander de l’aide concernant un contenu ou un compte.
        </p>
        <h2 className="font-display text-xl font-semibold">Respect et modération</h2>
        <p>
          Le code de conduite s’applique aux échanges. En cas de non-respect de ces règles, le projet peut examiner un signalement et prendre des mesures raisonnables sur les contenus ou comptes concernés, dans la mesure permise par les fonctions disponibles.
        </p>
        <h2 className="font-display text-xl font-semibold">Données personnelles et changements</h2>
        <p>
          La collecte et l’utilisation des données sont décrites dans la{' '}
          <a href="/privacy" className="text-primary underline">notice de confidentialité</a>. Ces règles peuvent évoluer avec le service; les changements importants seront indiqués sur le site.
        </p>
      </section>
    </div>
  );
}
