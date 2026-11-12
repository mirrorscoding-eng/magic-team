import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageCta } from "@/components/site/Footer";
import { RenderSection } from "@/components/site/RenderSection";
import { SUB_PAGES, livePages, pageSections } from "@/lib/pages";
import { getContent } from "@/lib/store";
import { t, type Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function findPage(slug: string) {
  return SUB_PAGES.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[page]">): Promise<Metadata> {
  const { locale: l, page: slug } = await params;
  const locale = l as Locale;
  const page = findPage(slug);
  if (!page) return {};
  const { settings } = await getContent();
  return {
    title: `${t(page.label, locale)} | ${settings.siteName || "Magic Team"}`,
    description: t(page.blurb, locale) || t(settings.seoDescription, locale),
    alternates: { languages: { ar: `/ar/${slug}`, en: `/en/${slug}` } },
    icons: { icon: "/brand/mark.svg" },
  };
}

export default async function SubPage({ params }: PageProps<"/[locale]/[page]">) {
  const { locale: l, page: slug } = await params;
  const locale = l as Locale;
  const page = findPage(slug);
  if (!page) notFound();
  const content = await getContent();
  const keys = pageSections(page, content.settings);
  if (!keys.length) notFound();

  const live = livePages(content.settings);
  const idx = live.findIndex((p) => p.slug === page.slug);
  // Next page in the menu, skipping Contact (the CTA already links there).
  const next = live.slice(idx + 1).find((p) => p.slug !== "contact");
  const isContact = page.slug === "contact";

  return (
    <main className="pt-10 md:pt-14">
      {keys.map((k) => (
        <RenderSection key={k} k={k} content={content} locale={locale} />
      ))}
      {!isContact && <PageCta locale={locale} next={next} showContact={live.some((p) => p.slug === "contact")} />}
    </main>
  );
}
