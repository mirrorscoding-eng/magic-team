"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projectHref } from "@/lib/pages";
import type {
  CaseStudy,
  Gallery as GalleryT,
  GalleryCategory,
  GalleryItem,
  L,
  Locale,
  Project,
} from "@/lib/types";
import { t } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { Reveal } from "./shown";

const FILTERS: { key: "all" | GalleryCategory; label: L; color: string }[] = [
  { key: "all", label: { ar: "الكل", en: "All" }, color: "orchid" },
  { key: "photo", label: { ar: "تصوير", en: "Photography" }, color: "yellow" },
  {
    key: "branding",
    label: { ar: "هوية بصرية", en: "Branding" },
    color: "cyan",
  },
  {
    key: "design",
    label: { ar: "تصاميم ومنيوهات", en: "Design & menus" },
    color: "lilac",
  },
  { key: "video", label: { ar: "فيديو", en: "Video" }, color: "green" },
];
const CAT_LABEL = Object.fromEntries(FILTERS.map((f) => [f.key, f])) as Record<
  string,
  (typeof FILTERS)[number]
>;

/** Stagger step for tile entrance animation. */
const PAGE = 12;

function categoriesOf(p: Project) {
  return FILTERS.filter(
    (f) => f.key !== "all" && p.items.some((i) => i.category === f.key),
  );
}

function countLabel(n: number, locale: Locale) {
  if (locale === "en") return `${n} ${n === 1 ? "piece" : "pieces"}`;
  if (n === 1) return "عمل واحد";
  if (n === 2) return "عملين";
  return `${n.toLocaleString("ar-IQ")} ${n <= 10 ? "أعمال" : "عمل"}`;
}

/** Plays a muted loop only while it is on screen. */
function AutoVideo({
  item,
  className,
}: {
  item: GalleryItem;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={item.video}
      poster={item.image}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}

function Lightbox({
  items,
  client,
  index,
  locale,
  onClose,
  onMove,
}: {
  items: GalleryItem[];
  client: string;
  index: number;
  locale: Locale;
  onClose: () => void;
  onMove: (d: number) => void;
}) {
  const it = items[index];
  const ar = locale === "ar";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // arrows follow reading direction
      if (e.key === "ArrowRight") onMove(ar ? -1 : 1);
      if (e.key === "ArrowLeft") onMove(ar ? 1 : -1);
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [ar, onClose, onMove]);
  if (!it) return null;
  const cat = CAT_LABEL[it.category];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(it.title, locale)}
      className="gallery-lightbox fixed inset-0 z-[200] flex flex-col bg-ink/95 backdrop-blur-xl"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 md:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <div className="truncate text-lg font-bold text-white">
            {t(it.title, locale)}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-lilac/60">
            {client && <span dir="ltr">{client}</span>}
            {cat && (
              <span
                className={`c-${cat.color} font-semibold text-[color:var(--c)]`}
              >
                {t(cat.label, locale)}
              </span>
            )}
            <span dir="ltr" className="text-lilac/40">
              {index + 1} / {items.length}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ar ? "إغلاق" : "Close"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-orchid hover:text-ink"
        >
          ×
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-8 md:px-24">
        {it.video ? (
          <video
            key={it.video}
            src={it.video}
            poster={it.image}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={it.image}
            src={it.image}
            alt={t(it.title, locale)}
            className="gallery-zoom max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label={ar ? "السابق" : "Previous"}
              onClick={(e) => (e.stopPropagation(), onMove(-1))}
              className="absolute start-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-orchid hover:text-ink md:start-6"
            >
              <span className="rtl:rotate-180">‹</span>
            </button>
            <button
              type="button"
              aria-label={ar ? "التالي" : "Next"}
              onClick={(e) => (e.stopPropagation(), onMove(1))}
              className="absolute end-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-orchid hover:text-ink md:end-6"
            >
              <span className="rtl:rotate-180">›</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Work page: one card per project, each opening its own page. */
export function Gallery({ data, locale }: { data: GalleryT; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section id="gallery" className="relative py-28 md:py-36">
      <Reveal className="mx-auto max-w-7xl px-5" threshold={0.05}>
        <SectionHead
          eyebrow={data.eyebrow}
          title={data.title}
          subtitle={data.subtitle}
          locale={locale}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {data.projects.map((p, i) => {
            const cats = categoriesOf(p);
            const cover = p.cover || p.items[0]?.image;
            return (
              <Link
                key={p.slug}
                href={projectHref(locale, p.slug)}
                className={`project-card reveal group relative block overflow-hidden rounded-[1.75rem] bg-ink-2 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:ring-[color:var(--c)]/70 c-${p.color || "orchid"}`}
                style={{ ["--d" as string]: 3 + (i % 3) }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.07]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/0" />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    {p.logo ? (
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink/70 p-2 ring-1 ring-white/15 backdrop-blur-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.logo}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="rounded-full bg-ink/70 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
                      {countLabel(p.items.length, locale)}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    {p.client && (
                      <div
                        className="font-latin text-sm font-bold text-[color:var(--c)]"
                        dir="ltr"
                      >
                        {p.client}
                      </div>
                    )}
                    <h3 className="mt-1.5 text-2xl font-bold leading-snug text-white md:text-[1.7rem]">
                      {t(p.title, locale)}
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {cats.map((c) => (
                        <span
                          key={c.key}
                          className={`c-${c.color} rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[color:var(--c)] ring-1 ring-white/10 backdrop-blur-md`}
                        >
                          {t(c.label, locale)}
                        </span>
                      ))}
                      <span className="ms-auto translate-y-1 text-sm font-bold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {ar ? "افتح المشروع" : "Open project"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/** /work/<slug>: everything we made for one project. */
export function ProjectDetail({
  project: p,
  next,
  story,
  workHref,
  nextLabel,
  locale,
}: {
  project: Project;
  next?: Project;
  story?: CaseStudy;
  workHref: string;
  nextLabel: L;
  locale: Locale;
}) {
  const ar = locale === "ar";
  const cats = categoriesOf(p);
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(
    () =>
      filter === "all" ? p.items : p.items.filter((i) => i.category === filter),
    [p.items, filter],
  );
  const move = useCallback(
    (d: number) =>
      setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)),
    [list.length],
  );
  const close = useCallback(() => setOpen(null), []);
  const chapters = story
    ? [story.challenge, story.idea, story.execution, story.result].filter(
        (c) => c && t(c.body, locale),
      )
    : [];
  const single = p.items.length === 1;

  return (
    <section className={`relative pb-10 c-${p.color || "orchid"}`}>
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <Link
            href={workHref}
            className="reveal inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-lilac/70 ring-1 ring-white/15 transition hover:text-white hover:ring-[color:var(--c)]/60"
            style={{ ["--d" as string]: 0 }}
          >
            {ar ? "كل المشاريع" : "All projects"}
          </Link>

          <header className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <div
                className="reveal flex items-center gap-4"
                style={{ ["--d" as string]: 1 }}
              >
                {p.logo && (
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white/5 p-3 ring-1 ring-white/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={p.client}
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                )}
                <div>
                  {p.client && (
                    <div
                      className="font-latin text-lg font-bold text-[color:var(--c)]"
                      dir="ltr"
                    >
                      {p.client}
                    </div>
                  )}
                  {story && (
                    <div className="text-sm text-lilac/60">
                      {t(story.industry, locale)}
                    </div>
                  )}
                </div>
              </div>
              <h1
                className="h-section reveal mt-6"
                style={{ ["--d" as string]: 2 }}
              >
                {t(p.title, locale)}
              </h1>
              {t(p.summary, locale) && (
                <p
                  className="lead reveal mt-5"
                  style={{ ["--d" as string]: 3 }}
                >
                  {t(p.summary, locale)}
                </p>
              )}
            </div>
            <div
              className="reveal flex flex-wrap gap-2 md:justify-end"
              style={{ ["--d" as string]: 3 }}
            >
              {cats.map((c) => (
                <span
                  key={c.key}
                  className={`c-${c.color} rounded-full px-4 py-2 text-sm font-bold text-[color:var(--c)] ring-1 ring-[color:var(--c)]/40`}
                >
                  {t(c.label, locale)}
                </span>
              ))}
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-white/80 ring-1 ring-white/10">
                {countLabel(p.items.length, locale)}
              </span>
            </div>
          </header>

          {cats.length > 1 && (
            <div
              className="reveal mt-12 flex flex-wrap gap-2"
              style={{ ["--d" as string]: 4 }}
              role="tablist"
            >
              {[FILTERS[0], ...cats].map((f) => {
                const on = f.key === filter;
                const count =
                  f.key === "all"
                    ? p.items.length
                    : p.items.filter((i) => i.category === f.key).length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(f.key)}
                    className={`c-${f.color} flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ring-1 transition ${on ? "bg-[color:var(--c)] text-ink ring-transparent" : "text-white/75 ring-white/15 hover:text-white hover:ring-[color:var(--c)]/60"}`}
                  >
                    {t(f.label, locale)}
                    <span
                      className={`font-latin text-xs ${on ? "text-ink/60" : "text-white/35"}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Reveal>

        <div
          key={filter}
          className={
            single
              ? "mx-auto mt-12 max-w-md"
              : "gallery-grid mt-10 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
          }
        >
          {list.map((it, i) => {
            const cat = CAT_LABEL[it.category];
            return (
              <button
                key={it.image + i}
                type="button"
                onClick={() => setOpen(i)}
                className={`gallery-tile group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.25rem] bg-ink-2 text-start ring-1 ring-white/10 transition duration-500 hover:-translate-y-1 hover:ring-[color:var(--c)]/60 md:mb-4 c-${cat?.color ?? "orchid"}`}
                style={{ ["--i" as string]: i % PAGE }}
                aria-label={t(it.title, locale)}
              >
                {it.video ? (
                  <AutoVideo
                    item={it}
                    className="block aspect-[9/16] w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="block h-auto w-full transition duration-[1200ms] ease-out group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-sm font-bold leading-snug text-white">
                    {t(it.title, locale)}
                  </div>
                  {cat && (
                    <div className="mt-0.5 text-xs font-semibold text-[color:var(--c)]">
                      {t(cat.label, locale)}
                    </div>
                  )}
                </div>
                {it.video && (
                  <span className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs font-bold text-green ring-1 ring-white/15 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />{" "}
                    REEL
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {chapters.length > 0 && (
          <Reveal className="mt-24" threshold={0.1}>
            <span className="eyebrow reveal" style={{ ["--d" as string]: 0 }}>
              {ar ? "قصة المشروع" : "The story"}
            </span>
            {story && (
              <h2
                className="reveal mt-5 max-w-3xl text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-tight"
                style={{ ["--d" as string]: 1 }}
              >
                {t(story.headline, locale)}
              </h2>
            )}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {chapters.map((c, i) => (
                <div
                  key={i}
                  className="reveal rounded-[1.5rem] bg-white/[.03] p-6 ring-1 ring-white/10 md:p-7"
                  style={{ ["--d" as string]: 2 + i }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--c)] font-latin text-sm font-bold text-ink">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {t(c.title, locale)}
                    </h3>
                  </div>
                  <p className="mt-4 leading-relaxed text-lilac/75">
                    {t(c.body, locale)}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {next && next.slug !== p.slug && (
          <Reveal>
            <Link
              href={projectHref(locale, next.slug)}
              className={`reveal group relative mt-24 block overflow-hidden rounded-[2rem] ring-1 ring-white/10 transition hover:ring-[color:var(--c)]/70 c-${next.color || "orchid"}`}
            >
              {(next.cover || next.items[0]?.image) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={next.cover || next.items[0]?.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-[1400ms] ease-out group-hover:scale-105 group-hover:opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-ink/30 via-ink/70 to-ink rtl:bg-gradient-to-r" />
              <div className="relative flex min-h-56 flex-col justify-center gap-2 p-8 md:min-h-72 md:p-12">
                <span className="text-sm font-bold text-[color:var(--c)]">
                  {t(nextLabel, locale)}
                </span>
                {next.client && (
                  <span
                    className="font-latin text-lg font-bold text-white/80"
                    dir="ltr"
                  >
                    {next.client}
                  </span>
                )}
                <span className="text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold leading-tight text-white">
                  {t(next.title, locale)}
                </span>
              </div>
            </Link>
          </Reveal>
        )}
      </div>

      {open !== null && (
        <Lightbox
          items={list}
          client={p.client}
          index={open}
          locale={locale}
          onClose={close}
          onMove={move}
        />
      )}
    </section>
  );
}
