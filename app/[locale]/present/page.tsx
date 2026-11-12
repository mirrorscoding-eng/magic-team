import type { Metadata } from "next";
import { Presenter } from "@/components/site/Presenter";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Magic Team — Presentation", icons: { icon: "/brand/mark.svg" }, robots: { index: false } };

export default async function Present({ params }: PageProps<"/[locale]/present">) {
  const { locale } = await params;
  const content = await getContent();
  const keys = content.settings.sections.filter((s) => s.visible).map((s) => s.key);
  return <Presenter content={content} keys={keys} locale={locale as Locale} basePath={`/present`} />;
}
