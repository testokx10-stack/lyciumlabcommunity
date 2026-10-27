import { Article, articles as initialArticles } from '@/lib/data';

export type LearningResourceSection = {
  heading: string;
  body: string;
  points?: string[];
};

const frenchEdits: Record<string, Partial<Article>> = {
  a1: {
    title: 'Le sol vivant : comprendre le rôle des champignons mycorhiziens',
    excerpt: 'Une introduction aux associations entre racines et champignons, à leur intérêt potentiel pour les cultures et aux pratiques qui préservent la vie du sol.',
    type: 'research',
    evidenceBased: false,
  },
  a2: {
    title: 'Planifier une irrigation goutte-à-goutte',
    excerpt: 'Les points à vérifier pour dimensionner un réseau, suivre l’humidité du sol et repérer une distribution d’eau inégale.',
    type: 'guide',
    evidenceBased: false,
  },
  a3: {
    title: 'Lire une carte NDVI sans surinterpréter les couleurs',
    excerpt: 'Ce que l’indice NDVI indique sur la végétation, comment comparer des cartes et pourquoi une image satellite ne suffit pas à diagnostiquer une parcelle.',
    type: 'article',
    evidenceBased: false,
  },
  a4: {
    title: 'Ventiler une serre : gérer chaleur et humidité',
    excerpt: 'Les principes de ventilation naturelle et mécanique, les paramètres à surveiller et les vérifications utiles pour une serre plus régulière.',
    type: 'guide',
    evidenceBased: false,
  },
  a5: {
    title: 'Étude de cas pédagogique : comparer deux itinéraires de soja',
    excerpt: 'Une grille de suivi pour comparer un itinéraire avec travail du sol et un itinéraire simplifié, sans confondre observation et preuve généralisable.',
    category: 'crop-production',
    readTime: '10 min',
    type: 'case-study',
    evidenceBased: false,
  },
  a6: {
    title: 'Composter à la ferme : démarrer et suivre son tas',
    excerpt: 'Choisir les matières, équilibrer les apports et surveiller l’humidité et l’aération pour conduire un compost de manière régulière.',
    type: 'tutorial',
    evidenceBased: false,
  },
};

export const learningResources: Article[] = [
  ...initialArticles.map((article) => ({ ...article, ...frenchEdits[article.id] })),
  {
    id: 'a7',
    title: 'Rotation des cultures : construire un plan pluriannuel',
    excerpt: 'Une méthode simple pour alterner familles botaniques, besoins nutritifs et périodes de couverture du sol.',
    cover: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'crop-production',
    readTime: '8 min',
    publishedAt: '2026-09-27',
    authorId: 'u5',
    type: 'article',
    evidenceBased: false,
  },
  {
    id: 'a8',
    title: 'Synthèse : interpréter une analyse de sol avant fertilisation',
    excerpt: 'Des repères pour relier pH, éléments nutritifs et matière organique aux besoins de la culture, sans appliquer de dose générique.',
    cover: 'https://images.pexels.com/photos/7728082/pexels-photo-7728082.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'fertilizers',
    readTime: '9 min',
    publishedAt: '2026-09-24',
    authorId: 'u1',
    type: 'research',
    evidenceBased: false,
  },
  {
    id: 'a9',
    title: 'Étude de cas pédagogique : diagnostiquer une baisse de pression',
    excerpt: 'Une démarche de vérification des filtres, conduites, dénivelés et goutteurs avant de modifier un réseau d’irrigation.',
    cover: 'https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'irrigation',
    readTime: '6 min',
    publishedAt: '2026-09-21',
    authorId: 'u2',
    type: 'case-study',
    evidenceBased: false,
  },
  {
    id: 'a10',
    title: 'Tutoriel : cartographier les zones d’une parcelle',
    excerpt: 'Créer un relevé de terrain simple pour relier les observations de culture au relief, au sol et aux interventions.',
    cover: 'https://images.pexels.com/photos/7656744/pexels-photo-7656744.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'agtech',
    readTime: '7 min',
    publishedAt: '2026-09-18',
    authorId: 'u3',
    type: 'tutorial',
    evidenceBased: false,
  },
  {
    id: 'a11',
    title: 'Référence pratique : vocabulaire de la santé des sols',
    excerpt: 'Des définitions accessibles pour mieux comprendre les analyses et échanger avec un laboratoire ou un conseiller agricole.',
    cover: 'https://images.pexels.com/photos/7728082/pexels-photo-7728082.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'soil-science',
    readTime: '5 min',
    publishedAt: '2026-09-15',
    authorId: 'u1',
    type: 'reference',
    evidenceBased: false,
  },
  {
    id: 'a12',
    title: 'Référence pratique : préparer un prélèvement de sol',
    excerpt: 'Une liste de contrôle pour obtenir un échantillon représentatif et des résultats interprétables.',
    cover: 'https://images.pexels.com/photos/7656744/pexels-photo-7656744.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'fertilizers',
    readTime: '5 min',
    publishedAt: '2026-09-12',
    authorId: 'u4',
    type: 'reference',
    evidenceBased: false,
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
};

export const learningResourceTypes = [
  { type: 'article', label: 'Articles pédagogiques' },
  { type: 'research', label: 'Résumés de recherche' },
  { type: 'guide', label: 'Guides pratiques' },
  { type: 'case-study', label: 'Études de cas' },
  { type: 'tutorial', label: 'Tutoriels' },
  { type: 'reference', label: 'Références' },
] as const;
