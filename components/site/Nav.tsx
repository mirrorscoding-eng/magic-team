"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/brand/Icon";
import { pageHref, type PageSlug } from "@/lib/pages";
import type { L, Locale } from "@/lib/types";

export type NavPage = { slug: PageSlug; label: L };

export function Nav({ locale, pages }: { locale: Locale; pages: NavPage[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // "/ar/work" -> "work", "/ar" -> ""
  const current = pathname.split("/")[2] ?? "";
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const ar = locale === "ar";
  const other: Locale = ar ? "en" : "ar";
  const links = pages.filter((p) => p.slug !== "contact");
  const hasContact = pages.some((p) => p.slug === "contact");
  const otherHref = `/${other}${current ? `/${current}` : ""}`;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-[padding] duration-500 md:px-8 ${scrolled ? "pt-3" : "pt-5"}`}>
      <nav
        className={`flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border transition-all duration-500 ${
          scrolled ? "glass border-[var(--line)] py-2 pe-2 ps-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,.6)]" : "border-transparent px-2 py-2"
        }`}
      >
        <Link href={pageHref(locale, "")} aria-label="Magic Team" className="shrink-0 text-lilac">
          <Logo className={`w-auto transition-all duration-500 ${scrolled ? "h-8" : "h-10 md:h-12"}`} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.slug === current;
            return (
              <li key={l.slug}>
                <Link
                  href={pageHref(locale, l.slug)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[1.05rem] transition hover:bg-white/5 hover:text-white ${active ? "bg-white/[.07] text-white" : "text-lilac/80"}`}
                >
                  {ar ? l.label.ar : l.label.en}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link href={otherHref} hrefLang={other} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-lilac/60 hover:text-white sm:inline-flex">
            {other === "en" ? "EN" : "عربي"}
          </Link>
          <Link
            href={`/${locale}/present`}
            className="hidden items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/[.03] px-5 py-3 font-semibold text-white transition hover:border-orchid hover:bg-orchid/10 md:inline-flex"
          >
            {ar ? "ابدأ العرض" : "Start presenting"}
            <Icon name="present" className="h-5 w-5 text-lilac" />
          </Link>
          {hasContact && (
            <Link href={pageHref(locale, "contact")} aria-current={current === "contact" ? "page" : undefined} className="btn btn-primary py-3! px-6!">
              {ar ? "تواصل معنا" : "Contact us"}
            </Link>
          )}
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <i className={`absolute inset-x-0 top-0 h-0.5 bg-lilac transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <i className={`absolute inset-x-0 bottom-0 h-0.5 bg-lilac transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass absolute inset-x-4 top-20 rounded-3xl p-4 lg:hidden" onClick={() => setOpen(false)}>
          {pages.map((l) => (
            <Link
              key={l.slug}
              href={pageHref(locale, l.slug)}
              aria-current={l.slug === current ? "page" : undefined}
              className={`block rounded-2xl px-4 py-3 text-lg hover:bg-white/5 ${l.slug === current ? "bg-white/[.07] text-white" : "text-lilac"}`}
            >
              {ar ? l.label.ar : l.label.en}
            </Link>
          ))}
          <Link href={`/${locale}/present`} className="mt-2 flex items-center gap-2 rounded-2xl px-4 py-3 text-lg text-orchid hover:bg-white/5">
            <Icon name="present" /> {ar ? "ابدأ العرض" : "Start presenting"}
          </Link>
          <Link href={otherHref} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-lg text-lilac/70 hover:bg-white/5">
            {other === "en" ? "English" : "عربي"}
          </Link>
        </div>
      )}
    </header>
  );
}
