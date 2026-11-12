import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Presenter } from "@/components/site/Presenter";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/present/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { presentations } = await getContent();
  const p = presentations.find((x) => x.slug === slug);
  return { title: p ? `Magic Team × ${p.client}` : "Magic Team", icons: { icon: "/brand/mark.svg" }, robots: { index: false } };
}

export default async function PresentCustom({ params }: PageProps<"/[locale]/present/[slug]">) {
  const { locale, slug } = await params;
  const content = await getContent();
  const deck = content.presentations.find((p) => p.slug === slug);
  if (!deck) notFound();
  const cases = deck.caseIds.length ? content.cases.items.filter((c) => deck.caseIds.includes(c.id)) : content.cases.items;
  return <Presenter content={content} keys={deck.sections} locale={locale as Locale} deck={deck} cases={cases} basePath={`/present/${slug}`} />;
}
