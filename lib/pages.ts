import type { L, Locale, SectionKey, Settings } from "./types";

/** Site pages. A section normally lives on one page (featured services sit on Home and Services); order inside a page follows the dashboard's section order. */
export type PageSlug = "" | "services" | "work" | "team" | "contact";

export type SitePage = { slug: PageSlug; label: L; blurb: L; sections: SectionKey[] };

export const PAGES: SitePage[] = [
  {
    slug: "",
    label: { ar: "الرئيسية", en: "Home" },
    blurb: { ar: "", en: "" },
    sections: ["hero", "clients", "featured", "manifesto"],
  },
  {
    slug: "services",
    label: { ar: "الخدمات", en: "Services" },
    blurb: { ar: "كل اللي تحتاجه علامتك حتى تكبر.", en: "Everything your brand needs to grow." },
    sections: ["featured", "services"],
  },
  {
    slug: "work",
    label: { ar: "أعمالنا", en: "Work" },
    blurb: { ar: "قصص عملائنا، والأرقام قبل ماجك وبعدها.", en: "Client stories, and the numbers before and after Magic." },
    sections: ["cases", "beforeAfter"],
  },
  {
    slug: "team",
    label: { ar: "الفريق", en: "Team" },
    blurb: { ar: "فريق ماجك يشتغل من داخل شركتك.", en: "The Magic team, working from inside your company." },
    sections: ["team"],
  },
  {
    slug: "contact",
    label: { ar: "تواصل", en: "Contact" },
    blurb: { ar: "احچيلنا عن مشروعك ونرجعلك بسرعة.", en: "Tell us about your project and we'll get back fast." },
    sections: ["contact"],
  },
];

export const SUB_PAGES = PAGES.filter((p) => p.slug !== "");

export function pageHref(locale: Locale, slug: PageSlug) {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Visible sections of a page, in the order set in the dashboard. */
export function pageSections(page: SitePage, settings: Settings): SectionKey[] {
  return settings.sections.filter((s) => s.visible && page.sections.includes(s.key)).map((s) => s.key);
}

/** Pages that have at least one visible section (hidden pages drop out of the nav and 404). */
export function livePages(settings: Settings): SitePage[] {
  return PAGES.filter((p) => pageSections(p, settings).length > 0);
}

/** Which page a section lives on — used to turn old `#section` links into page links. */
export function pageOf(key: SectionKey): PageSlug {
  return PAGES.find((p) => p.sections.includes(key))?.slug ?? "";
}
