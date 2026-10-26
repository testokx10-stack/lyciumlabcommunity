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
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  authorId: string;
  category: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  readTime: string;
  publishedAt: string;
  authorId: string;
  type: 'guide' | 'research' | 'case-study' | 'tutorial' | 'article';
  evidenceBased: boolean;
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
  {
    slug: 'plant-science',
    name: 'Plant Science & Botany',
    description: 'The biology of plants — from cellular processes to whole-organism ecology.',
    icon: 'Leaf',
    color: 'from-emerald-500 to-green-600',
  },
  {
    slug: 'soil-science',
    name: 'Soil Science & Fertility',
    description: 'Understanding soil health, composition, and fertility management.',
    icon: 'Layers',
    color: 'from-amber-600 to-yellow-700',
  },
  {
    slug: 'crop-production',
    name: 'Crop Production',
    description: 'Practical techniques for growing and maximizing crop yields.',
    icon: 'Wheat',
    color: 'from-lime-500 to-green-600',
  },
  {
    slug: 'irrigation',
    name: 'Irrigation & Water Management',
    description: 'Efficient water use, irrigation systems, and conservation.',
    icon: 'Droplets',
    color: 'from-sky-500 to-blue-600',
  },
  {
    slug: 'pest-management',
    name: 'Plant Diseases & Pest Management',
    description: 'Identifying and managing plant diseases, pests, and pathogens.',
    icon: 'Bug',
    color: 'from-rose-500 to-red-600',
  },
  {
    slug: 'fertilizers',
    name: 'Fertilizers & Plant Nutrition',
    description: 'Nutrient management, fertilizer types, and application strategies.',
    icon: 'FlaskConical',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    slug: 'greenhouse',
    name: 'Greenhouse Agriculture',
    description: 'Controlled environment agriculture and protected cultivation.',
    icon: 'Home',
    color: 'from-green-500 to-emerald-600',
  },
  {
    slug: 'agtech',
    name: 'Agricultural Technology & AI',
    description: 'Drones, sensors, AI, and the future of precision farming.',
    icon: 'Cpu',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    slug: 'sustainable',
    name: 'Sustainable Agriculture',
    description: 'Regenerative practices, organic farming, and ecological balance.',
    icon: 'Recycle',
    color: 'from-green-600 to-teal-600',
  },
  {
    slug: 'research',
    name: 'Research, Experiments & Field Studies',
    description: 'Peer-reviewed findings, field trials, and experimental methods.',
    icon: 'Microscope',
    color: 'from-cyan-500 to-teal-600',
  },
];

export const members: Member[] = [
  {
    id: 'u1',
    name: 'Dr. Amara Okonkwo',
    handle: 'amara.agro',
    avatar:
      'https://images.pexels.com/photos/8185077/pexels-photo-8185077.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'expert',
    title: 'Soil Scientist · PhD Agronomy',
    bio: 'Researching soil microbiomes and their impact on crop resilience across West Africa.',
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
      'https://images.pexels.com/photos/29039798/pexels-photo-29039798.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'expert',
    title: 'Greenhouse Engineer',
    bio: 'Designing climate-controlled greenhouses for high-altitude and arid regions.',
    location: 'Medellín, Colombia',
    followers: 8200,
    following: 194,
    contributions: 97,
  },
  {
    id: 'u3',
    name: 'Yuki Tanaka',
    handle: 'yuki.precision',
    avatar:
      'https://images.pexels.com/photos/30907804/pexels-photo-30907804.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'expert',
    title: 'Precision Agriculture Specialist',
    bio: 'Bringing drones and AI-powered crop monitoring to smallholder farms in Asia.',
    location: 'Kyoto, Japan',
    followers: 15600,
    following: 421,
    contributions: 132,
  },
  {
    id: 'u4',
    name: 'Elena Petrova',
    handle: 'elena.irrigation',
    avatar:
      'https://images.pexels.com/photos/35069661/pexels-photo-35069661.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'member',
    title: 'Irrigation Consultant',
    bio: 'Helping farms cut water use by 40% with drip and micro-irrigation design.',
    location: 'Tashkent, Uzbekistan',
    followers: 3400,
    following: 89,
    contributions: 56,
  },
  {
    id: 'u5',
    name: 'Kwame Mensah',
    handle: 'kwame.organics',
    avatar:
      'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'member',
    title: 'Organic Farmer & Educator',
    bio: 'Running a 12-acre certified organic farm and teaching composting workshops.',
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
      'https://images.pexels.com/photos/19136500/pexels-photo-19136500.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    role: 'moderator',
    title: 'Plant Pathologist · PhD',
    bio: 'Diagnosing crop diseases and developing integrated pest management strategies.',
    location: 'Bologna, Italy',
    followers: 9800,
    following: 256,
    contributions: 211,
  },
];

export const videos: Video[] = [
  {
    id: 'v1',
    title: 'Understanding Soil Microbiomes: The Hidden Engine of Fertility',
    description:
      'A deep dive into the bacterial and fungal networks that drive nutrient cycling, and how to foster them through cover cropping and reduced tillage.',
    thumbnail:
      'https://images.pexels.com/photos/8851253/pexels-photo-8851253.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '18:42',
    views: 42100,
    likes: 1840,
    comments: 132,
    publishedAt: '2026-10-12',
    authorId: 'u1',
    category: 'soil-science',
    tags: ['soil health', 'microbiome', 'cover crops', 'fertility'],
    featured: true,
    trending: true,
  },
  {
    id: 'v2',
    title: 'Building a Climate-Controlled Greenhouse on a Budget',
    description:
      'Step-by-step construction of a passive-ventilation greenhouse using locally sourced materials, including thermal mass design.',
    thumbnail:
      'https://images.pexels.com/photos/20075896/pexels-photo-20075896.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '24:08',
    views: 38500,
    likes: 1620,
    comments: 98,
    publishedAt: '2026-10-08',
    authorId: 'u2',
    category: 'greenhouse',
    tags: ['greenhouse', 'controlled environment', 'DIY'],
    trending: true,
  },
  {
    id: 'v3',
    title: 'Drone-Based Crop Scouting: From Setup to Actionable Data',
    description:
      'How to configure a multispectral drone, plan flight missions, and turn NDVI maps into fertilizer and irrigation decisions.',
    thumbnail:
      'https://images.pexels.com/photos/34182313/pexels-photo-34182313.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '31:15',
    views: 52900,
    likes: 2310,
    comments: 204,
    publishedAt: '2026-10-15',
    authorId: 'u3',
    category: 'agtech',
    tags: ['drones', 'NDVI', 'precision agriculture', 'AI'],
    featured: true,
    trending: true,
  },
  {
    id: 'v4',
    title: 'Drip Irrigation 101: Designing a System That Saves Water',
    description:
      'Everything you need to plan, install, and maintain a drip irrigation system for vegetable beds and orchards.',
    thumbnail:
      'https://images.pexels.com/photos/10606633/pexels-photo-10606633.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '15:30',
    views: 28400,
    likes: 1190,
    comments: 76,
    publishedAt: '2026-10-05',
    authorId: 'u4',
    category: 'irrigation',
    tags: ['drip irrigation', 'water savings', 'installation'],
    trending: false,
  },
  {
    id: 'v5',
    title: 'Identifying Early Blight: A Field Diagnosis Guide',
    description:
      'Visual symptoms, host range, and the integrated approach to controlling early blight in tomato and potato crops.',
    thumbnail:
      'https://images.pexels.com/photos/12642803/pexels-photo-12642803.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '12:18',
    views: 33700,
    likes: 1450,
    comments: 89,
    publishedAt: '2026-10-10',
    authorId: 'u6',
    category: 'pest-management',
    tags: ['plant disease', 'blight', 'diagnosis', 'IPM'],
    trending: true,
  },
  {
    id: 'v6',
    title: 'Composting at Scale: Turning Farm Waste into Black Gold',
    description:
      'Thermophilic composting methods, C:N ratio management, and how to test finished compost for nutrient density.',
    thumbnail:
      'https://images.pexels.com/photos/19136500/pexels-photo-19136500.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '20:55',
    views: 21800,
    likes: 980,
    comments: 54,
    publishedAt: '2026-10-02',
    authorId: 'u5',
    category: 'sustainable',
    tags: ['composting', 'organic', 'waste', 'soil amendment'],
    trending: false,
  },
  {
    id: 'v7',
    title: 'Reading a Leaf: Chlorophyll Meters and Plant Health',
    description:
      'Using handheld chlorophyll meters to detect nitrogen deficiency weeks before symptoms become visible.',
    thumbnail:
      'https://images.pexels.com/photos/11465778/pexels-photo-11465778.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '09:47',
    views: 19200,
    likes: 760,
    comments: 41,
    publishedAt: '2026-09-28',
    authorId: 'u1',
    category: 'plant-science',
    tags: ['chlorophyll', 'nitrogen', 'plant health', 'sensors'],
    trending: false,
  },
  {
    id: 'v8',
    title: 'Controlled Release Fertilizers: When Slow Is Better',
    description:
      'How polymer-coated fertilizers work, when they pay off, and matching release curves to crop demand.',
    thumbnail:
      'https://images.pexels.com/photos/4031654/pexels-photo-4031654.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '16:22',
    views: 26100,
    likes: 1120,
    comments: 67,
    publishedAt: '2026-09-25',
    authorId: 'u1',
    category: 'fertilizers',
    tags: ['CRF', 'nutrient management', 'efficiency'],
    trending: false,
  },
  {
    id: 'v9',
    title: 'A 3-Year Field Trial on Regenerative Corn Rotation',
    description:
      'Results from a multi-season experiment comparing rye-vetch cover cropping with conventional fallow in a maize system.',
    thumbnail:
      'https://images.pexels.com/photos/36838598/pexels-photo-36838598.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '28:40',
    views: 31400,
    likes: 1390,
    comments: 118,
    publishedAt: '2026-09-20',
    authorId: 'u6',
    category: 'research',
    tags: ['field trial', 'cover crop', 'regenerative', 'data'],
    featured: true,
    trending: false,
  },
  {
    id: 'v10',
    title: 'Micropropagation: Cloning Plants in the Lab',
    description:
      'Tissue culture basics — sterilization, media preparation, and transferring explants under aseptic conditions.',
    thumbnail:
      'https://images.pexels.com/photos/8851084/pexels-photo-8851084.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '22:13',
    views: 24800,
    likes: 1080,
    comments: 73,
    publishedAt: '2026-09-18',
    authorId: 'u3',
    category: 'plant-science',
    tags: ['tissue culture', 'micropropagation', 'biotechnology'],
    trending: false,
  },
  {
    id: 'v11',
    title: 'Center Pivot Irrigation: Scheduling for Maximum Efficiency',
    description:
      'Using evapotranspiration data and soil moisture sensors to time pivot runs without leaching nutrients.',
    thumbnail:
      'https://images.pexels.com/photos/20286981/pexels-photo-20286981.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '14:05',
    views: 17600,
    likes: 690,
    comments: 38,
    publishedAt: '2026-09-14',
    authorId: 'u4',
    category: 'irrigation',
    tags: ['center pivot', 'ET', 'scheduling', 'sensors'],
    trending: false,
  },
  {
    id: 'v12',
    title: 'Integrating Livestock into Cropland: Silvopasture Results',
    description:
      'A case study on rotational grazing under nitrogen-fixing trees, with soil carbon measurements over two seasons.',
    thumbnail:
      'https://images.pexels.com/photos/17765487/pexels-photo-17765487.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    duration: '19:33',
    views: 20300,
    likes: 920,
    comments: 61,
    publishedAt: '2026-09-10',
    authorId: 'u5',
    category: 'sustainable',
    tags: ['silvopasture', 'regenerative', 'soil carbon', 'livestock'],
    trending: false,
  },
];

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'The Mycorrhizal Network: How Fungi Feed Your Crops',
    excerpt:
      'Arbuscular mycorrhizal fungi form underground partnerships with 80% of land plants. Here is what they do, and how to stop destroying them.',
    cover:
      'https://images.pexels.com/photos/12642803/pexels-photo-12642803.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'soil-science',
    readTime: '8 min',
    publishedAt: '2026-10-14',
    authorId: 'u1',
    type: 'research',
    evidenceBased: true,
  },
  {
    id: 'a2',
    title: 'A Practical Guide to Drip Irrigation Scheduling',
    excerpt:
      'Step-by-step instructions for calculating crop water demand from evapotranspiration data and soil type.',
    cover:
      'https://images.pexels.com/photos/10606633/pexels-photo-10606633.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'irrigation',
    readTime: '12 min',
    publishedAt: '2026-10-11',
    authorId: 'u4',
    type: 'guide',
    evidenceBased: true,
  },
  {
    id: 'a3',
    title: 'Why NDVI Matters — And When It Misleads',
    excerpt:
      'Normalized Difference Vegetation Index is the workhorse of remote sensing. This guide covers what it actually measures and its common pitfalls.',
    cover:
      'https://images.pexels.com/photos/34182311/pexels-photo-34182311.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'agtech',
    readTime: '10 min',
    publishedAt: '2026-10-09',
    authorId: 'u3',
    type: 'article',
    evidenceBased: true,
  },
  {
    id: 'a4',
    title: 'Greenhouse Ventilation: The Physics Every Grower Should Know',
    excerpt:
      'From buoyancy-driven ridge vents to HAF fans, the principles behind keeping a greenhouse cool without bleeding energy.',
    cover:
      'https://images.pexels.com/photos/20075896/pexels-photo-20075896.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'greenhouse',
    readTime: '9 min',
    publishedAt: '2026-10-06',
    authorId: 'u2',
    type: 'guide',
    evidenceBased: true,
  },
  {
    id: 'a5',
    title: 'Field Notes: Two Seasons of No-Till Soybean in Tashkent',
    excerpt:
      'A candid case study documenting yields, soil organic matter, and weed pressure through a transition to no-till.',
    cover:
      'https://images.pexels.com/photos/17765487/pexels-photo-17765487.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'research',
    readTime: '15 min',
    publishedAt: '2026-10-03',
    authorId: 'u4',
    type: 'case-study',
    evidenceBased: true,
  },
  {
    id: 'a6',
    title: 'Composting for Beginners: Getting the C:N Ratio Right',
    excerpt:
      'A friendly, illustrated tutorial on building your first hot-compost pile — what to add, what to avoid, and how to know when it is done.',
    cover:
      'https://images.pexels.com/photos/19136500/pexels-photo-19136500.jpeg?auto=compress&cs=tinysrgb&h=600&w=900',
    category: 'sustainable',
    readTime: '7 min',
    publishedAt: '2026-09-30',
    authorId: 'u5',
    type: 'tutorial',
    evidenceBased: false,
  },
];

export const posts: Post[] = [
  {
    id: 'p1',
    authorId: 'u5',
    content:
      'Just finished our third hot-compost batch of the season. Turned the pile at day 14 and hit 65°C — thermophiles are working. Sharing the full C:N worksheet in the comments.',
    image:
      'https://images.pexels.com/photos/19136500/pexels-photo-19136500.jpeg?auto=compress&cs=tinysrgb&h=400&w=800',
    likes: 142,
    comments: 23,
    shares: 11,
    postedAt: '2026-10-16',
    tag: 'composting',
  },
  {
    id: 'p2',
    authorId: 'u3',
    content:
      'New NDVI map from this morning\'s flight over the east field. Notice the clear nitrogen deficit in zone 3 — we will top-dress there next week. Drones pay for themselves when you catch this early.',
    image:
      'https://images.pexels.com/photos/34182313/pexels-photo-34182313.jpeg?auto=compress&cs=tinysrgb&h=400&w=800',
    likes: 208,
    comments: 41,
    shares: 18,
    postedAt: '2026-10-15',
    tag: 'precision-agriculture',
  },
  {
    id: 'p3',
    authorId: 'u6',
    content:
      'Reminder for tomato growers in humid regions: early blight pressure is high right now. Scout the lower leaves for concentric-ring lesions and remove infected tissue. Copper rotations help if you catch it early.',
    likes: 176,
    comments: 34,
    shares: 22,
    postedAt: '2026-10-14',
    tag: 'plant-disease',
  },
  {
    id: 'p4',
    authorId: 'u2',
    content:
      'Finished installing ridge vents on the new greenhouse. Passive cooling is underrated — on a 32°C day the interior stayed under 26°C with zero electricity. Sharing the airflow diagram shortly.',
    image:
      'https://images.pexels.com/photos/6342330/pexels-photo-6342330.jpeg?auto=compress&cs=tinysrgb&h=400&w=800',
    likes: 134,
    comments: 19,
    shares: 8,
    postedAt: '2026-10-13',
    tag: 'greenhouse',
  },
];

export const questions: Question[] = [
  {
    id: 'q1',
    authorId: 'u4',
    title: 'How do you calibrate a chlorophyll meter across different crop stages?',
    body: 'My SPAD readings drift a lot between vegetative and reproductive stages on the same maize plot. Is there a standard way to normalize for growth stage, or do I need crop-specific curves?',
    answers: 7,
    views: 1840,
    votes: 24,
    askedAt: '2026-10-15',
    tag: 'plant-science',
    answered: true,
  },
  {
    id: 'q2',
    authorId: 'u5',
    title: 'Best cover crop for compacted clay soil in a tropical climate?',
    body: 'I have a 2-hectare plot with heavily compacted clay. Looking for a fast-growing deep-rooted cover crop that can handle high rainfall and break up the compaction.',
    answers: 12,
    views: 2960,
    votes: 41,
    askedAt: '2026-10-12',
    tag: 'soil-science',
    answered: true,
  },
  {
    id: 'q3',
    authorId: 'u2',
    title: 'Why is my drip system pressure dropping across the laterals?',
    body: 'The first manifold is at 1.2 bar but the last drops to 0.6. Pipe sizing seems right. Could it be emitter clogging or a filtration issue?',
    answers: 5,
    views: 1120,
    votes: 18,
    askedAt: '2026-10-10',
    tag: 'irrigation',
    answered: false,
  },
  {
    id: 'q4',
    authorId: 'u1',
    title: 'Is there peer-reviewed evidence for biodynamic preparations?',
    body: 'I keep getting asked about biodynamic farming. Are there rigorous, replicated trials showing a yield or soil-health effect beyond what compost alone would explain?',
    answers: 9,
    views: 4210,
    votes: 56,
    askedAt: '2026-10-08',
    tag: 'research',
    answered: true,
  },
];

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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
