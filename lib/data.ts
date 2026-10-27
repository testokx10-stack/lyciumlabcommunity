export type VideoCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
  tags: string[];
  featured?: boolean;
  embed: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  type: 'guide' | 'research' | 'case-study' | 'tutorial' | 'article' | 'reference';
};

export type Member = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'member' | 'expert' | 'moderator' | 'admin';
  title: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  contributions: number;
};

export type Post = {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  tag?: string;
};

export type Question = {
  id: string;
  authorId: string;
  title: string;
  body: string;
  answers: number;
  views: number;
  votes: number;
  askedAt: string;
  tag: string;
  answered?: boolean;
};

export const categories: VideoCategory[] = [
  { slug: 'plant-science', name: 'Sciences végétales & Botanique', description: 'La biologie des plantes — des processus cellulaires à l\'écologie de l\'organisme entier.', icon: 'Leaf', color: 'from-emerald-500 to-green-600' },
  { slug: 'soil-science', name: 'Sciences du sol & Fertilité', description: 'Comprendre la santé, la composition et la gestion de la fertilité du sol.', icon: 'Layers', color: 'from-amber-600 to-yellow-700' },
  { slug: 'crop-production', name: 'Production végétale', description: 'Techniques pratiques pour cultiver et maximiser les rendements.', icon: 'Wheat', color: 'from-lime-500 to-green-600' },
  { slug: 'irrigation', name: 'Irrigation & Gestion de l\'eau', description: 'Utilisation efficace de l\'eau, systèmes d\'irrigation et conservation.', icon: 'Droplets', color: 'from-sky-500 to-blue-600' },
  { slug: 'pest-management', name: 'Maladies des plantes & Lutte contre les ravageurs', description: 'Identifier et gérer les maladies, ravageurs et pathogènes des plantes.', icon: 'Bug', color: 'from-rose-500 to-red-600' },
  { slug: 'fertilizers', name: 'Engrais & Nutrition végétale', description: 'Gestion des nutriments, types d\'engrais et stratégies d\'application.', icon: 'FlaskConical', color: 'from-teal-500 to-emerald-600' },
  { slug: 'greenhouse', name: 'Agriculture en serre', description: 'Agriculture en milieu contrôlé et cultivation protégée.', icon: 'Home', color: 'from-green-500 to-emerald-600' },
  { slug: 'agtech', name: 'Technologie agricole & IA', description: 'Drones, capteurs, IA et l\'avenir de l\'agriculture de précision.', icon: 'Cpu', color: 'from-indigo-500 to-violet-600' },
  { slug: 'sustainable', name: 'Agriculture durable', description: 'Pratiques régénératives, agriculture biologique et équilibre écologique.', icon: 'Recycle', color: 'from-green-600 to-teal-600' },
  { slug: 'research', name: 'Recherche, expériences & études de terrain', description: 'Résultats évalués par les pairs, essais sur le terrain et méthodes expérimentales.', icon: 'Microscope', color: 'from-cyan-500 to-teal-600' },
];

const demonstrationMembers: Member[] = [
  {
    id: 'u1',
    name: 'Dr. Amara Okonkwo',
    handle: 'amara.agro',
    avatar:
      '',
    role: 'expert',
    title: 'Spécialiste des sols · Doctorat en agronomie',
    bio: 'Recherche sur les microbiomes du sol et leur impact sur la résilience des cultures à travers l\'Afrique de l\'Ouest. Plus de 15 ans d\'études.',
    location: 'Ibadan, Nigeria',
    followers: 12400,
    following: 312,
    contributions: 184,
  },
  {
    id: 'u2',
    name: 'Mateo Salazar',
    handle: 'mateo.grows',
    avatar:
      '',
    role: 'expert',
    title: 'Ingénieur en serre',
    bio: 'Conception de serres climatisées pour les régions à haute altitude et arides.',
    location: 'Medellín, Colombie',
    followers: 8200,
    following: 194,
    contributions: 97,
  },
  {
    id: 'u3',
    name: 'Yuki Tanaka',
    handle: 'yuki.precision',
    avatar:
      '',
    role: 'expert',
    title: 'Spécialiste de l\'agriculture de précision',
    bio: 'Faire voler des drones et une surveillance des cultures guidée par IA pour les petits agriculteurs d\'Asie.',
    location: 'Kyoto, Japon',
    followers: 15600,
    following: 421,
    contributions: 132,
  },
  {
    id: 'u4',
    name: 'Elena Petrova',
    handle: 'elena.irrigation',
    avatar:
      '',
    role: 'member',
    title: 'Consultante en irrigation',
    bio: 'Aide les exploitations à réduire leur consommation d\'eau de 40 % grâce à la conception d\'irrigation goutte-à-goutte et micro-irrigation.',
    location: 'Tachkent, Ouzbékistan',
    followers: 3400,
    following: 89,
    contributions: 56,
  },
  {
    id: 'u5',
    name: 'Kwame Mensah',
    handle: 'kwame.organics',
    avatar:
      '',
    role: 'member',
    title: 'Agriculteur biologique & éducateur',
    bio: 'Exploitation agricole biologique certifiée de 12 acres et ateliers de compostage.',
    location: 'Kumasi, Ghana',
    followers: 5200,
    following: 143,
    contributions: 78,
  },
  {
    id: 'u6',
    name: 'Dr. Sofia Bianchi',
    handle: 'sofia.pathology',
    avatar:
      '',
    role: 'moderator',
    title: 'Phytopathologiste · Doctorat',
    bio: 'Diagnostic des maladies des cultures et développement de stratégies intégrées de lutte contre les ravageurs.',
    location: 'Bologne, Italie',
    followers: 9800,
    following: 256,
    contributions: 211,
  },
];

export const members: Member[] = [];

type DemonstrationVideo = Video & {
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  authorId: string;
  trending?: boolean;
};

const demonstrationVideos: DemonstrationVideo[] = [
  {
    id: 'v1',
    title: 'Comprendre les microbiomes du sol : le moteur caché de la fertilité',
    description:
      'Plongez dans les réseaux bactériens et fongiques qui assurent le cycle des nutriments, et comment les favoriser par des cultures couvrantes et un travail du sol réduit.',
    thumbnail:
      '',
    duration: '18:42',
    views: 42100,
    likes: 1840,
    comments: 132,
    publishedAt: '2026-10-12',
    authorId: 'u1',
    category: 'soil-science',
    tags: ['santé du sol', 'microbiome', 'cultures couvrantes', 'fertilité'],
featured: true,
    trending: true,
    embed: 'https://www.youtube.com/embed/pcrrA-Am6oQ',
  },
  {
    id: 'v2',
    title: 'Construire une serre climatisée à petit prix',
    description:
      'Construction pas à pas d\'une serre à ventilation passive à l\'aide de matériaux locaux, y compris la conception de la masse thermique.',
    thumbnail:
      '',
    duration: '24:08',
    views: 38500,
    likes: 1620,
    comments: 98,
    publishedAt: '2026-10-08',
    authorId: 'u2',
    category: 'greenhouse',
    tags: ['serre', 'milieu contrôlé', 'DIY'],
    trending: true,
    embed: 'https://www.youtube.com/embed/ISi2VrIm0-s',
  },
  {
    id: 'v3',
    title: 'Détection aérienne des cultures : de la configuration aux données exploitables',
    description:
      'Configurer un drone multispectral, planifier des missions de survol et transformer les cartes NDVI en décisions concrètes d\'engrais et d\'irrigation.',
    thumbnail:
      '',
    duration: '31:15',
    views: 52900,
    likes: 2310,
    comments: 204,
    publishedAt: '2026-10-15',
    authorId: 'u3',
    category: 'agtech',
    tags: ['drones', 'NDVI', 'agriculture de précision', 'IA'],
    featured: true,
    trending: true,
    embed: 'https://www.youtube.com/embed/9j4MU_GgkHA',
  },
  {
    id: 'v4',
    title: 'Irrigation goutte-à-goutte 101 : concevoir un système qui économise l\'eau',
    description:
      'Tout ce qu\'il faut savoir pour planifier, installer et entretenir un système d\'irrigation goutte-à-goutte pour des plates-bandes et des vergers.',
    thumbnail:
      '',
    duration: '15:30',
    views: 28400,
    likes: 1190,
    comments: 76,
    publishedAt: '2026-10-05',
    authorId: 'u4',
    category: 'irrigation',
    tags: ['irrigation goutte-à-goutte', 'économie d\'eau', 'installation'],
    trending: false,
    embed: 'https://www.youtube.com/embed/BsgtnkXc-LE',
  },
  {
    id: 'v5',
    title: 'Identifier la tavelure précoce : un guide de diagnostic sur le terrain',
    description:
      'Symptômes visuels, spectre d\'hôtes et approche intégrée pour maîtriser la tavelure précoce du tomate et de la pomme de terre.',
    thumbnail:
      '',
    duration: '12:18',
    views: 33700,
    likes: 1450,
    comments: 89,
    publishedAt: '2026-10-10',
    authorId: 'u6',
    category: 'pest-management',
    tags: ['maladie des plantes', 'tavelure', 'diagnostic', 'IPM'],
    trending: true,
    embed: 'https://www.youtube.com/embed/kpLbSwvHxl8',
  },
  {
    id: 'v6',
    title: 'Compostage à grande échelle : transformer les déchets agricoles en or noir',
    description:
      'Méthodes de compostage thermophile, gestion du rapport C:N et contrôle du compost pour une densité nutritive optimale.',
    thumbnail:
      '',
    duration: '20:55',
    views: 21800,
    likes: 980,
    comments: 54,
    publishedAt: '2026-10-02',
    authorId: 'u5',
    category: 'sustainable',
    tags: ['compostage', 'biologique', 'déchets', 'amendement du sol'],
    trending: false,
    embed: 'https://www.youtube.com/embed/b59JBgRv2Xo',
  },
  {
    id: 'v7',
    title: 'Lire une feuille : les mètres de chlorophylle et la santé des plantes',
    description:
      'Utiliser des mètres portatifs de chlorophylle pour détecter un déficit d\'azote plusieurs semaines avant l\'apparition des symptômes.',
    thumbnail:
      '',
    duration: '09:47',
    views: 19200,
    likes: 760,
    comments: 41,
    publishedAt: '2026-09-28',
    authorId: 'u1',
    category: 'plant-science',
    tags: ['chlorophylle', 'azote', 'santé des plantes', 'capteurs'],
    trending: false,
    embed: 'https://www.youtube.com/embed/c_K40RAMJa4',
  },
  {
    id: 'v8',
    title: 'Engrais à libération contrôlée : quand lent vaut mieux',
    description:
      'Fonctionnement des engrais revêtus par polymère, rentabilité et adaptation des courbes de libération à la demande des cultures.',
    thumbnail:
      '',
    duration: '16:22',
    views: 26100,
    likes: 1120,
    comments: 67,
    publishedAt: '2026-09-25',
    authorId: 'u1',
    category: 'fertilizers',
    tags: ['CRF', 'gestion des nutriments', 'efficacité'],
    trending: false,
    embed: 'https://www.youtube.com/embed/cAdUEGuxjfU',
  },
  {
    id: 'v9',
    title: 'Un essai sur le terrain de 3 ans sur la rotation du maïs régénérative',
    description:
      'Résultats d\'une expérience pluriannuelle comparant un système de culture couvrante trèfle-violette avec un témoin à repos dans une parcelle de maïs.',
    thumbnail:
      '',
    duration: '28:40',
    views: 31400,
    likes: 1390,
    comments: 118,
    publishedAt: '2026-09-20',
    authorId: 'u6',
    category: 'research',
    tags: ['essai sur le terrain', 'culture couvrante', 'régénérative', 'données'],
    featured: true,
    trending: false,
    embed: 'https://www.youtube.com/embed/nryU4l9xjWY',
  },
  {
    id: 'v10',
    title: 'Micropropagation : cloner des plantes en laboratoire',
    description:
      'Principes de base de la culture de tissu — stérilisation, préparation des milieux et repiquage sous conditions aspergées.',
    thumbnail:
      '',
    duration: '22:13',
    views: 24800,
    likes: 1080,
    comments: 73,
    publishedAt: '2026-09-18',
    authorId: 'u3',
    category: 'plant-science',
    tags: ['culture de tissu', 'micropropagation', 'biotechnologie'],
trending: false,
    embed: 'https://www.youtube.com/embed/nr5pc5hYW4E',
  },
  {
    id: 'v11',
    title: 'Irrigation pivot centre : planifier pour une efficacité maximale',
    description:
      'Exploiter les données d\'évapotranspiration et les capteurs d\'humidité du sol pour chronoréguler les passages du pivot sans lessivage des éléments nutritifs.',
    thumbnail:
      '',
    duration: '14:05',
    views: 17600,
    likes: 690,
    comments: 38,
    publishedAt: '2026-09-14',
    authorId: 'u4',
    category: 'irrigation',
    tags: ['pivot centre', 'ET', 'planification', 'capteurs'],
    trending: false,
    embed: 'https://www.youtube.com/embed/MTMgoVJv0vo',
  },
  {
    id: 'v12',
    title: 'Intégrer le bétail dans les prairies : résultats du sylvopâturage',
    description:
      'Étude de cas d\'un système associant arbres fixateurs d\'azote, pâturages rotatifs et cultures, avec mesures de carbone du sol sur deux saisons.',
    thumbnail:
      '',
    duration: '19:33',
    views: 20300,
    likes: 920,
    comments: 61,
    publishedAt: '2026-09-10',
    authorId: 'u5',
    category: 'sustainable',
    tags: ['sylvopâturage', 'régénérative', 'carbone du sol', 'élevage'],
    trending: false,
    embed: 'https://www.youtube.com/embed/lY-oAQvWcvo',
  },
];

export const videos: Video[] = demonstrationVideos.map(
  ({ id, title, description, duration, views, likes, comments, category, tags, featured, embed }) => ({
    id,
    title,
    description,
    duration,
    views,
    likes,
    comments,
    thumbnail: `https://i.ytimg.com/vi/${embed.split('/').pop()}/hqdefault.jpg`,
    category,
    tags,
    featured,
    embed: embed.replace('www.youtube.com', 'www.youtube-nocookie.com'),
  }),
);

export const articles: Article[] = [];

const demonstrationPosts: Post[] = [
  { id: 'p1', authorId: 'u5', content: 'Venant de finir notre troisième lots de compost thermophile de la saison. Nous avons retourné le tas au jour 14 et atteint 65 °C — les thermophiles sont au travail. Je partage la feuille de calcul complète du C:N dans les commentaires.', image: '', likes: 142, comments: 23, shares: 11, postedAt: '2026-10-16', tag: 'compostage' },
  { id: 'p2', authorId: 'u3', content: 'Nouvelle carte NDVI du vol d\'hier matin au-dessus du champ est. Remarquez le déséquilibre en azote évident dans la zone 3 — nous appliquerons un complémentazote l\'année prochaine. Les drones rapent leur coût dès que l\'on repère cela tôt.', image: '', likes: 208, comments: 41, shares: 18, postedAt: '2026-10-15', tag: 'agriculture-precision' },
  { id: 'p3', authorId: 'u6', content: 'Rappel aux maraîchers de tomate en milieu humide : la pression de la tavelure précoce est élevée en ce moment. Inspectez les feuilles inférieures pour des lésions en anneaux coniques et retirez les tissus infectés. Les traitements au cuivre aident si on les attrape tôt.', likes: 176, comments: 34, shares: 22, postedAt: '2026-10-14', tag: 'maladie-des-plantes' },
  { id: 'p4', authorId: 'u2', content: 'Installation terminée des prises d\'air sur la nouvelle serre. La climatisation passive est sous-estimée — à 32 °C dehors, l\'intérieur est resté sous 26 °C sans aucune électricité. Je partage le schéma d\'air embaumé très vite.', image: '', likes: 134, comments: 19, shares: 8, postedAt: '2026-10-13', tag: 'serre' },
];

export const posts: Post[] = [];

const demonstrationQuestions: Question[] = [
  { id: 'q1', authorId: 'u4', title: 'Comment étalonner un mètre de chlorophylle entre les différents stades de développement des cultures ?', body: 'Mes relevés SPAD varient énormément entre les stades végétatif et reproducteur sur la même parcelle de maïs. Existe-t-il un moyen standard de normaliser selon le stade de développement, ou faut-il des courbes spécifiques par culture ?', answers: 7, views: 1840, votes: 24, askedAt: '2026-10-15', tag: 'sciences-vegetales', answered: true },
  { id: 'q2', authorId: 'u5', title: 'Quelle est la meilleure culture couvrante pour un sol argileux compacté dans un climat tropical ?', body: 'J\'ai une parcelle de 2 hectares avec une argile fortement compactée. À la recherche d\'une culture couvrante à racines profondes et à forte croissance qui supporte de fortes précipitations et casse le compactage.', answers: 12, views: 2960, votes: 41, askedAt: '2026-10-12', tag: 'sciences-du-sol', answered: true },
  { id: 'q3', authorId: 'u2', title: 'Pourquoi la pression de mon système de goutte-à-goutte baisse-t-elle le long des latéraux ?', body: 'Le premier manchon est à 1,2 bar mais le dernier descend à 0,6. Le diamètre des tuyaux me semble juste. S\'agit-il d\'encrassement des goutteurs ou d\'un problème de filtration ?', answers: 5, views: 1120, votes: 18, askedAt: '2026-10-10', tag: 'irrigation', answered: false },
  { id: 'q4', authorId: 'u1', title: 'Existe-t-il des preuves évaluées par les pairs sur les préparations biodynamiques ?', body: 'Je suis régulièrement interrogé au sujet de l\'agriculture biodynamique. Y a-t-il des essais rigoureux et répétés montrant un effet sur le rendement ou la santé du sol au-delà de ce que le compost seul expliquerait ?', answers: 9, views: 4210, votes: 56, askedAt: '2026-10-08', tag: 'recherche', answered: true },
];

export const questions: Question[] = [];

export function getMember(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

export function getCategory(slug: string): VideoCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "aujourd'hui";
  if (days < 2) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
  return `il y a ${Math.floor(days / 30)} mois`;
}
