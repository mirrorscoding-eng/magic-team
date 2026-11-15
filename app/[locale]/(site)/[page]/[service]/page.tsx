import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedDetail } from "@/components/site/Featured";
import { PageCta } from "@/components/site/Footer";
import { ProjectDetail } from "@/components/site/Gallery";
import { featuredKind, livePages, pageHref } from "@/lib/pages";
import { getContent } from "@/lib/store";
import { t, type Content, type Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

const isOn = (content: Content, key: string) => content.settings.sections.some((s) => s.key === key && s.visible);

/** /[locale]/services/<slug> — a page for each signature service. */
async function loadService(page: string, service: string) {
  const kind = page === "services" ? featuredKind(service) : undefined;
  if (!kind) return null;
  const content = await getContent();
  if (!content.featured || !isOn(content, "featured")) return null;
  return { kind, content, featured: content.featured };
}

/** /[locale]/work/<slug> — a page for each portfolio project. */
async function loadProject(page: string, slug: string) {
  if (page !== "work") return null;
  const content = await getContent();
  const projects = content.gallery?.projects ?? [];
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0 || !isOn(content, "gallery")) return null;
  const project = projects[idx];
  const next = projects.length > 1 ? projects[(idx + 1) % projects.length] : undefined;
  const story = content.cases.items.find((c) => c.id === slug);
  return { content, project, next, story };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[page]/[service]">): Promise<Metadata> {
  const { locale: l, page, service } = await params;
  const locale = l as Locale;
  const svc = await loadService(page, service);
  const proj = svc ? null : await loadProject(page, service);
  const hit = svc ?? proj;
  if (!hit) return {};
  const title = svc ? t(svc.featured[svc.kind].tab, locale) : [proj!.project.client, t(proj!.project.title, locale)].filter(Boolean).join(" — ");
  const description = svc ? t(svc.featured[svc.kind].body, locale) : t(proj!.project.summary, locale);
  return {
    title: `${title} | ${hit.content.settings.siteName || "Magic Team"}`,
    description,
    alternates: { languages: { ar: `/ar/${page}/${service}`, en: `/en/${page}/${service}` } },
    icons: { icon: "/brand/mark.svg" },
  };
}

export default async function DetailPage({ params }: PageProps<"/[locale]/[page]/[service]">) {
  const { locale: l, page, service } = await params;
  const locale = l as Locale;

  const svc = await loadService(page, service);
  if (svc) {
    const live = livePages(svc.content.settings);
    return (
      <main className="pt-28 md:pt-32">
        <FeaturedDetail kind={svc.kind} data={svc.featured} members={svc.content.team.members} locale={locale} />
        <PageCta locale={locale} showContact={live.some((p) => p.slug === "contact")} />
      </main>
    );
  }

  const proj = await loadProject(page, service);
  if (!proj) notFound();
  const live = livePages(proj.content.settings);
  return (
    <main className="pt-28 md:pt-32">
      <ProjectDetail project={proj.project} next={proj.next} story={proj.story} workHref={pageHref(locale, "work")} nextLabel={proj.content.gallery.more} locale={locale} />
      <PageCta locale={locale} showContact={live.some((p) => p.slug === "contact")} />
    </main>
  );
}
