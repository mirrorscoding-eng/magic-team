import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedDetail } from "@/components/site/Featured";
import { PageCta } from "@/components/site/Footer";
import { featuredKind, livePages } from "@/lib/pages";
import { getContent } from "@/lib/store";
import { t, type Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

/** /[locale]/services/<slug> — a page for each signature service. */
async function load(page: string, service: string) {
  const kind = page === "services" ? featuredKind(service) : undefined;
  if (!kind) return null;
  const content = await getContent();
  const on = content.settings.sections.some((s) => s.key === "featured" && s.visible);
  if (!content.featured || !on) return null;
  return { kind, content, featured: content.featured };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[page]/[service]">): Promise<Metadata> {
  const { locale: l, page, service } = await params;
  const locale = l as Locale;
  const hit = await load(page, service);
  if (!hit) return {};
  const s = hit.featured[hit.kind];
  return {
    title: `${t(s.tab, locale)} | ${hit.content.settings.siteName || "Magic Team"}`,
    description: t(s.body, locale),
    alternates: { languages: { ar: `/ar/services/${service}`, en: `/en/services/${service}` } },
    icons: { icon: "/brand/mark.svg" },
  };
}

export default async function ServicePage({ params }: PageProps<"/[locale]/[page]/[service]">) {
  const { locale: l, page, service } = await params;
  const locale = l as Locale;
  const hit = await load(page, service);
  if (!hit) notFound();
  const live = livePages(hit.content.settings);
  return (
    <main className="pt-28 md:pt-32">
      <FeaturedDetail kind={hit.kind} data={hit.featured} members={hit.content.team.members} locale={locale} />
      <PageCta locale={locale} showContact={live.some((p) => p.slug === "contact")} />
    </main>
  );
}
