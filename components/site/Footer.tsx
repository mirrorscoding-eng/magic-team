import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Icon } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
import { pageHref, type SitePage } from "@/lib/pages";
import { t, type Locale, type Settings } from "@/lib/types";
import { SocialLinks } from "./Contact";

/** "Have a project?" band shown at the end of every page except Contact, plus a link to the next page. */
export function PageCta({ locale, next, showContact }: { locale: Locale; next?: SitePage; showContact: boolean }) {
  const ar = locale === "ar";
  return (
    <section className="relative overflow-hidden px-5 py-24 md:py-32">
      <div className="aurora opacity-50" aria-hidden><span className="a1" /><span className="a2" /></div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <h2 className="text-[clamp(2.2rem,6vw,4.75rem)] font-bold leading-[1.05]">
          {ar ? "عندك مشروع؟ " : "Got a project? "}
          <span className="text-orchid">{ar ? "خل نسويله سحر." : "Let's make it magic."}</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {showContact && (
            <Link href={pageHref(locale, "contact")} className="btn btn-primary px-7! py-4! text-lg!">
              {ar ? "خل نحچي" : "Let's talk"}
              <span className="arrow h-10! w-10!"><Icon name="arrow" className="flip-rtl h-5 w-5" /></span>
            </Link>
          )}
          {next && (
            <Link href={pageHref(locale, next.slug)} className="btn btn-ghost px-7! py-4! text-lg! text-white!">
              {ar ? "التالي: " : "Next: "}
              {t(next.label, locale)}
              <span className="arrow h-10! w-10! bg-lilac! text-ink!"><Icon name="arrow" className="flip-rtl h-5 w-5" /></span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const CARD_COLORS = ["bg-cyan", "bg-yellow", "bg-green", "bg-lilac"];

/** Home-page cards that lead to the other pages. */
export function ExplorePages({ locale, pages }: { locale: Locale; pages: SitePage[] }) {
  const ar = locale === "ar";
  if (!pages.length) return null;
  return (
    <section className="relative px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow">{ar ? "اكتشف ماجك" : "Explore Magic"}</span>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pages.map((p, i) => (
            <Link
              key={p.slug}
              href={pageHref(locale, p.slug)}
              className={`group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-ink transition duration-300 hover:-translate-y-1 md:p-9 ${CARD_COLORS[i % CARD_COLORS.length]}`}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="text-sm font-semibold opacity-60 font-latin">0{i + 1}</span>
                <BrandIcon name={p.slug} className="h-16 w-16 md:h-20 md:w-20" />
              </div>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none">{t(p.label, locale)}</h3>
                  <p className="mt-3 max-w-sm text-base opacity-75">{t(p.blurb, locale)}</p>
                </div>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-lilac transition duration-300 group-hover:scale-110">
                  <Icon name="arrow" className="flip-rtl h-6 w-6" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ locale, settings, pages }: { locale: Locale; settings: Settings; pages: SitePage[] }) {
  const ar = locale === "ar";
  return (
    <footer className="relative border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div>
          <Link href={pageHref(locale, "")} aria-label="Magic Team" className="inline-block text-lilac">
            <Logo className="h-9 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-lilac/60">{t(settings.address, locale)}</p>
        </div>
        <nav aria-label={ar ? "صفحات الموقع" : "Site pages"}>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-lilac/80">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link href={pageHref(locale, p.slug)} className="hover:text-white">{t(p.label, locale)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks settings={settings} />
      </div>
      <p className="border-t border-[var(--line)] px-5 py-6 text-center text-xs text-lilac/40">
        © {new Date().getFullYear()} Magic Team. {ar ? "كل الحقوق محفوظة." : "All rights reserved."}
      </p>
    </footer>
  );
}
