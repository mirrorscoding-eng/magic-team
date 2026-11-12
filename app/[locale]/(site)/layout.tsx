import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Notice } from "@/components/site/Notice";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { livePages } from "@/lib/pages";
import { getContent } from "@/lib/store";
import { t, type Locale } from "@/lib/types";

/** Shared chrome for the website pages (the presentation deck has its own). */
export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const { settings } = await getContent();
  const pages = livePages(settings);
  return (
    <>
      <SmoothScroll />
      <Nav locale={locale} pages={pages.map(({ slug, label }) => ({ slug, label }))} />
      {children}
      <Footer locale={locale} settings={settings} pages={pages} />
      <Notice text={t(settings.notice, locale)} />
    </>
  );
}
