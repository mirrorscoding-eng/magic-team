export type Locale = "ar" | "en";
export const LOCALES: Locale[] = ["ar", "en"];

/** Bilingual text */
export type L = { ar: string; en: string };

export type BrandColor = "orchid" | "lilac" | "cyan" | "yellow" | "green" | "ink";

export const SECTION_KEYS = [
  "hero",
  "clients",
  "featured",
  "team",
  "gallery",
  "cases",
  "beforeAfter",
  "manifesto",
  "services",
  "contact",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type Settings = {
  siteName: string;
  seoTitle: L;
  seoDescription: L;
  email: string;
  phone: string;
  whatsapp: string;
  address: L;
  instagram: string;
  tiktok: string;
  linkedin: string;
  notice: L;
  sections: { key: SectionKey; visible: boolean }[];
};

export type Hero = {
  title: L;
  highlight: L;
  tagline: L;
  subtitle: L;
  ctaPrimary: L;
  ctaSecondary: L;
  pills: { label: L; color: BrandColor }[];
  cards: { image: string; alt: string }[];
};

export type ClientLogo = { name: string; logo: string };
export type Clients = { eyebrow: L; title: L; subtitle: L; logos: ClientLogo[] };


export type TeamMember = { name: L; role: L; photo: string; color: BrandColor };
export type Team = {
  eyebrow: L;
  title: L;
  subtitle: L;
  points: { title: L; body: L }[];
  members: TeamMember[];
};

export type GalleryCategory = "photo" | "branding" | "design" | "video";
export type GalleryItem = { title: L; category: GalleryCategory; image: string; video?: string };
/** One client project: its own page at /work/<slug> with all of its work. */
export type Project = { slug: string; client: string; logo: string; color: BrandColor; title: L; summary: L; cover: string; items: GalleryItem[] };
export type Gallery = { eyebrow: L; title: L; subtitle: L; more: L; projects: Project[] };

export type Metric = {
  label: L;
  before: number;
  after: number;
  prefix: string;
  suffix: string;
  decimals: number;
  lowerIsBetter: boolean;
};

export type Chapter = { title: L; body: L; image: string };

export type CaseStudy = {
  id: string;
  client: string;
  logo: string;
  industry: L;
  color: BrandColor;
  duration: L;
  headline: L;
  cover: string;
  challenge: Chapter;
  idea: Chapter;
  execution: Chapter;
  result: Chapter;
  metrics: Metric[];
};
export type Cases = { eyebrow: L; title: L; subtitle: L; items: CaseStudy[] };

export type BeforeAfter = {
  eyebrow: L;
  title: L;
  subtitle: L;
  beforeLabel: L;
  afterLabel: L;
  button: L;
  reset: L;
};

export type Manifesto = { line1: L; line2: L; line3: L };

export type TradeZone = { title: L; body: L; tags: L; icon: string; color: BrandColor; image?: string };
export type Stat = { value: L; label: L };
export type Branch = { name: L; task: L; people: number; image?: string };
export type CompareRow = { label: L; remote: L; inside: L };
export type Featured = {
  eyebrow: L;
  title: L;
  subtitle: L;
  cta: L;
  trade: {
    tab: L;
    audience: L;
    title: L;
    body: L;
    fits: L;
    image?: string;
    mapTitle: L;
    zones: TradeZone[];
    stats: Stat[];
  };
  embedded: {
    tab: L;
    audience: L;
    title: L;
    body: L;
    fits: L;
    image?: string;
    hq: L;
    hqTask: L;
    hqImage?: string;
    branches: Branch[];
    steps: { title: L; body: L }[];
    compareRemote: L;
    compareInside: L;
    compare: CompareRow[];
    stats: Stat[];
  };
};

export type Service = { title: L; body: L; tags: L; color: BrandColor; icon: string; image?: string };
export type Services = { eyebrow: L; title: L; subtitle: L; items: Service[] };

export type Contact = {
  eyebrow: L;
  title: L;
  subtitle: L;
  button: L;
  success: L;
  serviceOptions: L[];
};

export type Presentation = {
  slug: string;
  client: string;
  clientLogo: string;
  note: L;
  sections: SectionKey[];
  caseIds: string[];
};

export type Content = {
  settings: Settings;
  hero: Hero;
  clients: Clients;
  featured: Featured;
  team: Team;
  gallery: Gallery;
  cases: Cases;
  beforeAfter: BeforeAfter;
  manifesto: Manifesto;
  services: Services;
  contact: Contact;
  presentations: Presentation[];
};

export type ContentKey = keyof Content;

export type Message = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  read: boolean;
};

export const SECTION_LABELS: Record<SectionKey, L> = {
  hero: { ar: "الواجهة", en: "Hero" },
  clients: { ar: "علامات وثقت بنا", en: "Trusted by" },
  featured: { ar: "خدمات مميزة", en: "Signature services" },
  team: { ar: "فريق ماجك", en: "Magic team" },
  gallery: { ar: "معرض الأعمال", en: "Portfolio" },
  cases: { ar: "ماذا حققنا", en: "Case stories" },
  beforeAfter: { ar: "قبل وبعد ماجك", en: "Before / After" },
  manifesto: { ar: "البيان", en: "Manifesto" },
  services: { ar: "خدماتنا", en: "Services" },
  contact: { ar: "تواصل", en: "Contact" },
};

export const t = (v: L | undefined, locale: Locale) => (v ? v[locale] || v.ar || v.en : "");
