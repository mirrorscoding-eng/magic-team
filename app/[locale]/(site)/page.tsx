import type { Metadata } from "next";
import { ExplorePages } from "@/components/site/Footer";
import { RenderSection } from "@/components/site/RenderSection";
import { PAGES, livePages, pageSections } from "@/lib/pages";
import { getContent } from "@/lib/store";
import { t, type Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const { settings } = await getContent();
  return {
    title: t(settings.seoTitle, locale as Locale),
    description: t(settings.seoDescription, locale as Locale),
    alternates: { languages: { ar: "/ar", en: "/en" } },
    icons: { icon: "/brand/mark.svg" },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const content = await getContent();
  const home = PAGES[0];
  const others = livePages(content.settings).filter((p) => p.slug !== "");
  return (
    <main>
      {pageSections(home, content.settings).map((k) => (
        <RenderSection key={k} k={k} content={content} locale={locale} />
      ))}
      <ExplorePages locale={locale} pages={others} />
    </main>
  );
}
