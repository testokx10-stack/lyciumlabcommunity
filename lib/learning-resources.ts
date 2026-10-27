import { Article } from '@/lib/data';

export type LearningResourceSection = {
  heading: string;
  body: string;
  points?: string[];
};

export const learningResources: Article[] = [
  {
    id: 'a7',
    title: 'Rotation des cultures : construire un plan pluriannuel',
    excerpt: 'Une méthode simple pour alterner familles botaniques, besoins nutritifs et périodes de couverture du sol.',
    category: 'crop-production',
    readTime: '8 min',
    type: 'article',
  },
  {
    id: 'a8',
    title: 'Synthèse : interpréter une analyse de sol avant fertilisation',
    excerpt: 'Des repères pour relier pH, éléments nutritifs et matière organique aux besoins de la culture, sans appliquer de dose générique.',
    category: 'fertilizers',
    readTime: '9 min',
    type: 'research',
  },
  {
    id: 'a9',
    title: 'Étude de cas pédagogique : diagnostiquer une baisse de pression',
    excerpt: 'Une démarche de vérification des filtres, conduites, dénivelés et goutteurs avant de modifier un réseau d’irrigation.',
    category: 'irrigation',
    readTime: '6 min',
    type: 'case-study',
  },
  {
    id: 'a10',
    title: 'Tutoriel : cartographier les zones d’une parcelle',
    excerpt: 'Créer un relevé de terrain simple pour relier les observations de culture au relief, au sol et aux interventions.',
    category: 'agtech',
    readTime: '7 min',
    type: 'tutorial',
  },
  {
    id: 'a11',
    title: 'Référence pratique : vocabulaire de la santé des sols',
    excerpt: 'Des définitions accessibles pour mieux comprendre les analyses et échanger avec un laboratoire ou un conseiller agricole.',
    category: 'soil-science',
    readTime: '5 min',
    type: 'reference',
  },
  {
    id: 'a12',
    title: 'Référence pratique : préparer un prélèvement de sol',
    excerpt: 'Une liste de contrôle pour obtenir un échantillon représentatif et des résultats interprétables.',
    category: 'fertilizers',
    readTime: '5 min',
    type: 'reference',
  },
  {
    id: 'a13',
    title: 'Sciences végétales : suivre la croissance d’une plante au champ',
    excerpt: 'Repérer les grandes étapes du développement, observer les feuilles et les racines, puis consigner des mesures utiles sans confondre symptôme et diagnostic.',
    category: 'plant-science',
    readTime: '7 min',
    type: 'guide',
  },
  {
    id: 'a14',
    title: 'Photosynthèse et stress hydrique : comprendre les premiers signes',
    excerpt: 'Un guide pour relier lumière, échanges gazeux et disponibilité en eau, et organiser des observations de terrain avant de décider d’une intervention.',
    category: 'plant-science',
    readTime: '8 min',
    type: 'article',
  },
  {
    id: 'a15',
    title: 'Maladies des plantes : observer et décrire un symptôme',
    excerpt: 'Une méthode d’observation pour noter les signes, leur répartition et leur évolution, puis préparer un diagnostic à confirmer localement.',
    category: 'pest-management',
    readTime: '7 min',
    type: 'guide',
  },
  {
    id: 'a16',
    title: 'Lutte intégrée : prévenir et surveiller les ravageurs',
    excerpt: 'Les étapes d’une protection intégrée : prévention, observation régulière, identification fiable et choix d’une réponse proportionnée selon les règles locales.',
    category: 'pest-management',
    readTime: '9 min',
    type: 'tutorial',
  },
  {
    id: 'a17',
    title: 'Concevoir un essai au champ : comparer sans biaiser',
    excerpt: 'Une fiche pédagogique pour formuler une question, comparer des modalités, répartir les répétitions et consigner les conditions d’un essai agricole.',
    category: 'research',
    readTime: '10 min',
    type: 'research',
  },
  {
    id: 'a18',
    title: 'Lire les résultats d’un essai agricole avec esprit critique',
    excerpt: 'Comprendre la variabilité, les témoins, la taille d’échantillon et les limites d’une étude avant d’appliquer ses résultats à une autre parcelle.',
    category: 'research',
    readTime: '8 min',
    type: 'article',
  },
];

export const learningResourceSections: Record<string, LearningResourceSection[]> = {
  a1: [
    { heading: 'Une association entre racines et champignons', body: 'Les mycorhizes sont des associations entre certains champignons du sol et les racines des plantes. Les filaments fongiques explorent le sol autour des racines ; la plante leur fournit en échange des composés issus de la photosynthèse. Leur présence et leur importance varient selon les plantes, le sol et les pratiques agricoles.' },
    { heading: 'Ce que cela signifie au champ', body: 'Les mycorhizes ne remplacent ni une analyse de sol ni une fertilisation raisonnée. Elles font partie d’un réseau biologique complexe : un inoculant commercial ne garantit donc pas, à lui seul, une hausse de rendement.', points: ['Éviter les interventions du sol inutiles lorsque le système de culture le permet.', 'Diversifier les rotations et maintenir des racines vivantes quand c’est adapté.', 'Raisonner les apports de phosphore à partir des analyses et des besoins de la culture.'] },
  ],
  a2: [
    { heading: 'Commencer par la parcelle', body: 'Avant de choisir tuyaux et goutteurs, repérer la pente, la source d’eau, le type de sol, les cultures et leur espacement. Le débit et la fréquence d’irrigation doivent être adaptés à ces conditions et aux règles locales de prélèvement.' },
    { heading: 'Contrôler le réseau', body: 'Une installation filtrée et entretenue aide à maintenir une distribution régulière. Comparer les débits de goutteurs au début et à la fin de plusieurs lignes permet de repérer les écarts.', points: ['Mesurer la pression en plusieurs points du réseau.', 'Nettoyer les filtres et rincer les conduites selon les recommandations du fabricant.', 'Observer l’humidité à plusieurs endroits, pas seulement au pied d’un goutteur.'] },
  ],
  a3: [
    { heading: 'Un indicateur, pas un diagnostic', body: 'Le NDVI compare la lumière réfléchie par la végétation dans le rouge et le proche infrarouge. Il aide à repérer des différences de couvert végétal, mais ne mesure pas directement une carence en nutriments, une maladie ou un rendement.' },
    { heading: 'Vérifier avant d’intervenir', body: 'La date de prise de vue, les nuages, le stade de la culture, l’humidité et le type de sol influencent l’interprétation. Une zone de couleur différente est une piste à vérifier sur le terrain.', points: ['Comparer des images prises à des stades de culture similaires.', 'Vérifier la météo et la qualité de l’image.', 'Visiter plusieurs zones et croiser l’observation avec des mesures agronomiques.'] },
  ],
  a4: [
    { heading: 'Pourquoi renouveler l’air', body: 'La ventilation évacue une partie de la chaleur et de l’humidité produites dans la serre. Son efficacité dépend de la conception du bâtiment, du vent extérieur, de la surface des ouvertures et de leur entretien.' },
    { heading: 'Contrôles au quotidien', body: 'Mesurer la température et l’humidité à hauteur de culture aide à comprendre les conditions réellement subies par les plantes. Les consignes doivent être adaptées à l’espèce, au stade de développement et au climat local.', points: ['Maintenir les entrées et sorties d’air dégagées.', 'Vérifier le fonctionnement des ouvrants et des ventilateurs.', 'Suivre la température à plusieurs endroits de la serre.'] },
  ],
  a5: [
    { heading: 'La question à examiner', body: 'Une exploitation souhaite évaluer si la réduction du travail du sol convient à sa rotation. Il ne s’agit pas de présumer du résultat : les effets dépendent notamment du sol, du matériel, des adventices et de la météo.' },
    { heading: 'Construire une comparaison utile', body: 'Comparer des bandes proches et documenter les interventions pour limiter les différences autres que l’itinéraire étudié.', points: ['Noter les dates de semis, les interventions et les conditions météo.', 'Suivre la levée, la couverture du sol, les adventices et le rendement.', 'Comparer les coûts, le temps de travail et les observations sur plusieurs campagnes.'] },
  ],
  a6: [
    { heading: 'Préparer un mélange varié', body: 'Associer des matières végétales sèches et des matières plus humides, en évitant les déchets contaminés ou inadaptés. La composition des résidus varie : il n’existe pas de recette universelle à appliquer sans observation.' },
    { heading: 'Suivre la décomposition', body: 'Un compost a besoin d’oxygène et d’une humidité suffisante, sans être détrempé. La température peut informer sur l’activité du tas, mais ne suffit pas à prouver que le produit est mûr ou sûr.', points: ['Mélanger des matières de tailles différentes et limiter les gros blocs.', 'Contrôler régulièrement l’humidité et l’aération.', 'Laisser mûrir le compost et vérifier son aspect avant utilisation.'] },
  ],
  a7: [
    { heading: 'Partir des contraintes de l’exploitation', body: 'Une rotation doit tenir compte des débouchés, du matériel, de la disponibilité en eau et des dates de semis et de récolte. L’objectif est de planifier dans le temps, pas de suivre une séquence rigide.' },
    { heading: 'Équilibrer les cultures', body: 'Alterner des cultures de familles différentes peut aider à diversifier les pratiques et à éviter de répéter certaines contraintes au même endroit.', points: ['Lister les cultures et leurs familles botaniques.', 'Repérer les périodes où le sol reste nu et celles où il peut être couvert.', 'Réviser le plan chaque année selon les observations et les résultats.'] },
  ],
  a8: [
    { heading: 'Lire le résultat dans son contexte', body: 'Les méthodes de laboratoire et les seuils d’interprétation peuvent différer. Une valeur ne se comprend qu’avec la méthode d’analyse, le type de sol, la culture et l’historique de la parcelle.' },
    { heading: 'Relier analyse et décision', body: 'L’analyse de sol est un outil d’aide à la décision à croiser avec les besoins de la culture, l’historique des apports et les recommandations locales.', points: ['Vérifier la date et la profondeur du prélèvement.', 'Utiliser la grille d’interprétation fournie par le laboratoire.', 'Respecter les règles locales relatives aux apports et à la qualité de l’eau.'] },
  ],
  a9: [
    { heading: 'Décrire le problème', body: 'Une pression plus faible en bout de ligne peut avoir plusieurs causes. Avant tout réglage, relever la pression au même moment de fonctionnement et vérifier que les instruments sont adaptés.' },
    { heading: 'Procéder par étapes', body: 'Cette étude de cas pédagogique organise les contrôles ; elle ne décrit pas une exploitation réelle.', points: ['Contrôler le filtre et rechercher des signes de colmatage.', 'Examiner les conduites et raccords pour repérer les fuites ou pincements.', 'Comparer plusieurs goutteurs et vérifier le dénivelé.', 'Consigner les mesures avant et après intervention.'] },
  ],
  a10: [
    { heading: 'Préparer le relevé', body: 'Utiliser un plan de parcelle et choisir des points d’observation représentatifs. Une carte numérique est utile, mais un carnet papier suffit pour débuter.' },
    { heading: 'Associer une observation à chaque point', body: 'Noter les observations avec la date, le stade de la culture et les conditions de visite afin de pouvoir les comparer plus tard.', points: ['Repérer les limites et les zones particulières.', 'Noter les symptômes, la couverture végétale ou l’humidité observés.', 'Garder les mêmes repères lors des passages suivants.', 'Vérifier les constats sur place avant de décider d’une intervention.'] },
  ],
  a11: [
    { heading: 'Quelques notions utiles', body: 'Les termes de pédologie décrivent des propriétés distinctes. Ils ne constituent pas, isolément, un diagnostic de fertilité ou une recommandation de traitement.', points: ['Texture : proportions relatives de sable, limon et argile.', 'Structure : organisation des particules du sol en agrégats.', 'pH : mesure liée à l’acidité ou à l’alcalinité selon une méthode donnée.', 'Matière organique : ensemble de matières d’origine biologique à différents stades de transformation.'] },
  ],
  a12: [
    { heading: 'Avant le prélèvement', body: 'Suivre en priorité le protocole du laboratoire choisi : profondeur, outils, conditionnement et quantité demandée dépendent de l’analyse souhaitée.' },
    { heading: 'Liste de contrôle', body: 'Un échantillon composite n’est représentatif que si les points de prélèvement couvrent correctement une zone homogène.', points: ['Séparer les zones ayant des sols ou des historiques différents.', 'Éviter les bordures et les endroits récemment amendés, sauf si l’analyse les vise.', 'Utiliser un outil propre et mélanger les sous-échantillons d’une même zone.', 'Étiqueter la parcelle, la date et la profondeur.'] },
  ],
  a13: [
    { heading: 'Observer les étapes du développement', body: 'La germination, l’installation des feuilles, la croissance végétative puis la floraison et la formation des organes récoltés se succèdent selon l’espèce et les conditions. Noter le stade de la culture aide à comparer les plantes entre elles et à interpréter les observations.' },
    { heading: 'Transformer une observation en suivi', body: 'Un relevé simple et régulier permet de repérer une évolution, mais ne suffit pas à identifier sa cause. Comparer des plantes situées dans des conditions proches et consigner la météo, le sol et les interventions aide à préparer un diagnostic.', points: ['Choisir quelques plants représentatifs et conserver les mêmes repères de suivi.', 'Noter la date, le stade, la hauteur ou le nombre de feuilles selon la culture.', 'Photographier les symptômes avec une échelle et noter où ils apparaissent sur la parcelle.', 'Comparer les zones atteintes et non atteintes avant toute conclusion.'] },
  ],
  a14: [
    { heading: 'La photosynthèse en bref', body: 'Les feuilles captent une partie de l’énergie lumineuse et utilisent le dioxyde de carbone et l’eau pour fabriquer des composés carbonés. Les stomates, petits pores de la feuille, participent aux échanges gazeux et à la régulation des pertes d’eau.' },
    { heading: 'Interpréter les signes de stress avec prudence', body: 'Un flétrissement ou une croissance ralentie peut avoir plusieurs causes : manque ou excès d’eau, chaleur, salinité, atteinte racinaire ou maladie. Un symptôme isolé ne permet pas de trancher. Il faut le replacer dans le contexte de la parcelle et vérifier l’humidité à plusieurs endroits.', points: ['Comparer les plantes aux heures fraîches et chaudes de la journée.', 'Examiner la distribution des symptômes, le sol et l’état des racines si cela est possible.', 'Consigner les conditions météorologiques et l’irrigation récente.', 'Demander un avis technique ou un diagnostic de laboratoire si le doute persiste.'] },
  ],
  a15: [
    { heading: 'Décrire avant de nommer', body: 'Jaunissement, taches, nécroses, déformations ou dépérissement sont des symptômes, pas le nom d’une maladie. Des agents différents, mais aussi des stress abiotiques, peuvent produire des signes qui se ressemblent.' },
    { heading: 'Établir une fiche d’observation', body: 'Un relevé précis facilite les échanges avec un conseiller ou un laboratoire et évite de traiter sur la base d’une ressemblance visuelle seulement.', points: ['Noter l’espèce, la variété si elle est connue, le stade et la date d’apparition.', 'Décrire la forme, la couleur et la partie de la plante touchée.', 'Cartographier la répartition : plants isolés, foyers, bordure ou parcelle entière.', 'Prendre des photos nettes et conserver un échantillon selon les consignes du laboratoire.'] },
  ],
  a16: [
    { heading: 'Une démarche par étapes', body: 'La lutte intégrée associe prévention, surveillance et choix d’actions fondées sur une identification correcte et le niveau de risque. Elle vise à limiter les dommages tout en réduisant les interventions inutiles et leurs effets sur les organismes non ciblés.' },
    { heading: 'Prévenir, surveiller, décider', body: 'Les méthodes adaptées varient selon la culture, le ravageur, le climat et la réglementation. Avant toute intervention, consulter les recommandations officielles locales et l’étiquette des produits autorisés ; en cas de doute, solliciter un professionnel.', points: ['Favoriser des pratiques culturales préventives adaptées à la culture et au contexte local.', 'Inspecter régulièrement les plantes et enregistrer les observations de façon constante.', 'Confirmer l’identification et évaluer la présence d’auxiliaires et les dégâts observés.', 'Choisir une réponse proportionnée et vérifier ensuite son efficacité et ses effets non ciblés.'] },
  ],
  a17: [
    { heading: 'Formuler une question testable', body: 'Un essai utile commence par une question précise, par exemple comparer deux modalités de conduite sur un indicateur défini. Il faut distinguer ce que l’on change (le facteur étudié) de ce que l’on mesure (le résultat), et décrire les conditions de l’essai.' },
    { heading: 'Réduire les biais', body: 'Le sol, la pente ou l’exposition peuvent varier dans une parcelle. Un témoin, des répétitions et une répartition équilibrée des modalités aident à séparer l’effet étudié de la variabilité naturelle. La taille et la disposition de l’essai doivent rester compatibles avec le matériel et la parcelle.', points: ['Définir à l’avance les modalités, les indicateurs et le calendrier de mesure.', 'Inclure un témoin pertinent et répéter les modalités lorsque c’est possible.', 'Répartir les modalités de façon à limiter l’influence des gradients du terrain.', 'Consigner les interventions, incidents, conditions météo et données manquantes.'] },
  ],
  a18: [
    { heading: 'Résultat observé et conclusion ne sont pas identiques', body: 'Une différence entre deux modalités peut provenir du traitement, de la variabilité du terrain ou du hasard. La taille de l’échantillon, la répétition et la qualité des mesures influencent la solidité de l’interprétation.' },
    { heading: 'Vérifier la portée de l’étude', body: 'Avant de transposer un résultat, examiner le lieu, les années, le type de sol, les espèces, le protocole et les indicateurs étudiés. Une étude bien conduite dans un contexte précis n’est pas automatiquement généralisable à toutes les exploitations.', points: ['Rechercher la présence d’un témoin, de répétitions et d’une méthode clairement décrite.', 'Regarder les résultats complets et leur variabilité, pas seulement la moyenne ou le résumé.', 'Vérifier si d’autres essais indépendants aboutissent à des résultats comparables.', 'Présenter les limites et traiter une conclusion comme une piste à vérifier localement.'] },
  ],
};

export const learningResourceTypes = [
  { type: 'article', label: 'Articles pédagogiques' },
  { type: 'research', label: 'Résumés de recherche' },
  { type: 'guide', label: 'Guides pratiques' },
  { type: 'case-study', label: 'Études de cas' },
  { type: 'tutorial', label: 'Tutoriels' },
  { type: 'reference', label: 'Références' },
] as const;
