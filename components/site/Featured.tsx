"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { featuredHref, pageHref } from "@/lib/pages";
import type { BrandColor, Featured as FeaturedT, Locale, Stat, TeamMember } from "@/lib/types";
import { t } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { useShown } from "./shown";

const split = (s: string) => s.split(/[،,]/).map((x) => x.trim()).filter(Boolean);
const two = (n: number) => String(n).padStart(2, "0");

/** Cycles 0..count-1 while `run` is true; a manual pick pauses auto-play for a while. */
function useCycle(count: number, run: boolean, ms: number) {
  const [i, setI] = useState(0);
  const touched = useRef(0);
  useEffect(() => {
    if (!run || count < 2) return;
    const id = setInterval(() => {
      if (Date.now() - touched.current > 10000) setI((n) => (n + 1) % count);
    }, ms);
    return () => clearInterval(id);
  }, [run, count, ms]);
  const pick = (n: number) => {
    touched.current = Date.now();
    setI(n);
  };
  return [Math.min(i, Math.max(count - 1, 0)), pick, touched] as const;
}

function Chips({ text, locale }: { text: FeaturedT["trade"]["fits"]; locale: Locale }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {split(t(text, locale)).map((x) => (
        <span key={x} className="rounded-full border border-[color:var(--c)]/30 bg-[color:var(--c)]/[.07] px-3 py-1 text-xs font-semibold text-[color:var(--c)]">
          {x}
        </span>
      ))}
    </div>
  );
}

function Stats({ stats, locale }: { stats: Stat[]; locale: Locale }) {
  if (!stats.length) return null;
  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] rtl:divide-x-reverse">
      {stats.map((s, i) => (
        <div key={i} className="px-3 py-4 sm:px-4">
          <div className="text-[clamp(1.3rem,2.6vw,1.9rem)] font-bold leading-none text-[color:var(--c)]">{t(s.value, locale)}</div>
          <div className="mt-2 text-[11px] leading-5 text-lilac/60 sm:text-xs">{t(s.label, locale)}</div>
        </div>
      ))}
    </div>
  );
}

function Intro({ data, locale }: { data: { audience: FeaturedT["trade"]["audience"]; title: FeaturedT["trade"]["title"]; body: FeaturedT["trade"]["body"]; fits: FeaturedT["trade"]["fits"] }; locale: Locale }) {
  return (
    <>
      <span className="pill">{t(data.audience, locale)}</span>
      <h3 className="mt-5 text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-[1.2] text-white text-balance">{t(data.title, locale)}</h3>
      <p className="mt-4 text-[15px] leading-8 text-lilac/70">{t(data.body, locale)}</p>
      <div className="mt-6">
        <div className="mb-2.5 text-xs font-semibold text-lilac/50">{locale === "ar" ? "مناسبة لـ" : "Built for"}</div>
        <Chips text={data.fits} locale={locale} />
      </div>
    </>
  );
}

function Cta({ label, locale, className = "" }: { label: string; locale: Locale; className?: string }) {
  return (
    <Link href={pageHref(locale, "contact")} className={`btn btn-primary mt-8 self-start ${className}`}>
      {label}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Shared photo gallery: a crossfading stage, story bars and thumbnails */
/* ------------------------------------------------------------------ */

const TRADE_MS = 5000;
const PLACE_MS = 4500;

/** Stacked photos; the active one fades in and slowly settles (Ken Burns). */
function Stage({ images, active, className = "", children }: { images: (string | undefined)[]; active: number; className?: string; children?: ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-[#1d0122] ${className}`}>
      {images.map((src, i) =>
        src ? (
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1)" : "scale(1.1)",
              transitionProperty: "opacity, transform",
              transitionDuration: i === active ? "0.9s, 7s" : "0.9s, 0.9s",
              transitionTimingFunction: "ease, cubic-bezier(.2,.7,.2,1)",
            }}
          />
        ) : null,
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#14001a] via-[#14001a]/40 to-[#14001a]/50" />
      {children}
    </div>
  );
}

function Bars({ count, active, ms, onPick, labels }: { count: number; active: number; ms: number; onPick: (i: number) => void; labels: string[] }) {
  return (
    <div className="flex gap-1.5" style={{ ["--story-dur" as string]: `${ms}ms` }}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i === active ? `on-${active}` : i}
          type="button"
          onClick={() => onPick(i)}
          aria-label={labels[i]}
          className={`story-progress h-[3px]! cursor-pointer ${i < active ? "done" : i === active ? "active" : ""}`}
        >
          <i />
        </button>
      ))}
    </div>
  );
}

type Thumb = { image?: string; label: string; color: BrandColor; badge: ReactNode; caption?: string };

function Thumbs({ items, active, onPick }: { items: Thumb[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="grid gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((x, i) => {
        const on = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={on}
            aria-label={x.label}
            className={`group relative aspect-square overflow-hidden rounded-xl ring-2 transition duration-300 sm:rounded-2xl c-${x.color} ${on ? "-translate-y-1 ring-[color:var(--c)] shadow-[0_12px_30px_-12px_var(--c)]" : "opacity-50 ring-transparent hover:opacity-100"}`}
          >
            {x.image ? (
              <img src={x.image} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            ) : (
              <span className="absolute inset-0 bg-[color:var(--c)]/25" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <span className={`absolute start-1.5 top-1.5 grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none sm:text-[11px] ${on ? "bg-[color:var(--c)] text-ink" : "bg-ink/70 text-white"}`}>
              {x.badge}
            </span>
            {x.caption && (
              <span className="absolute inset-x-1.5 bottom-1.5 hidden truncate text-start text-[11px] font-bold text-white sm:block">{x.caption}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Live({ children, color = "bg-green" }: { children: ReactNode; color?: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md ring-1 ring-white/10">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
      </span>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Trade marketing: the shopper's journey through the store, in photos */
/* ------------------------------------------------------------------ */

function TradePanel({ data, locale, cta, shown }: { data: FeaturedT["trade"]; locale: Locale; cta: string; shown: boolean }) {
  const zones = data.zones;
  const [active, pick] = useCycle(zones.length, shown, TRADE_MS);
  const z = zones[active];
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 c-yellow">
      <div className="flex flex-col">
        <Intro data={data} locale={locale} />
        <div className="mt-8"><Stats stats={data.stats} locale={locale} /></div>
        <Cta label={cta} locale={locale} className="max-lg:hidden!" />
      </div>

      <div className="relative">
        <div className="absolute -inset-6 rounded-[3rem] bg-yellow/10 blur-3xl" aria-hidden />
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[#14001a] shadow-2xl">
          <Stage images={zones.map((x) => x.image)} active={active} className="aspect-[4/5] sm:aspect-[4/3]">
            <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
              <Bars count={zones.length} active={active} ms={TRADE_MS} onPick={pick} labels={zones.map((x) => t(x.title, locale))} />
              <div className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-full bg-ink/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
                  <Icon name="cart" className="h-3.5 w-3.5 text-yellow" />
                  {t(data.mapTitle, locale)}
                </span>
                <span className="ms-auto rounded-full bg-ink/60 px-2.5 py-1 font-latin text-[11px] font-bold text-white backdrop-blur-md ring-1 ring-white/10">
                  <span dir="ltr">{two(active + 1)} / {two(zones.length)}</span>
                </span>
              </div>
            </div>

            {z && (
              <div key={active} className={`absolute inset-x-0 bottom-0 p-5 sm:p-7 c-${z.color}`} style={{ animation: "storyIn .6s var(--ease-out) both" }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-ink shadow-lg sm:h-12 sm:w-12" style={{ background: "var(--c)" }}>
                    <Icon name={z.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <h4 className="text-xl font-bold leading-tight text-white sm:text-2xl">{t(z.title, locale)}</h4>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">{t(z.body, locale)}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {split(t(z.tags, locale)).map((x) => (
                    <span key={x} className="rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--c)] ring-1 ring-[color:var(--c)]/40 backdrop-blur-md">{x}</span>
                  ))}
                </div>
              </div>
            )}
          </Stage>

          <div className="p-3 sm:p-4">
            <Thumbs
              items={zones.map((x, i) => ({ image: x.image, label: t(x.title, locale), color: x.color, badge: <span className="font-latin">{i + 1}</span> }))}
              active={active}
              onPick={pick}
            />
          </div>
        </div>
        <Cta label={cta} locale={locale} className="lg:hidden!" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Embedded team: HQ + branches, each with a photo of the team on-site */
/* ------------------------------------------------------------------ */

function Avatars({ people, size = "h-7 w-7" }: { people: TeamMember[]; size?: string }) {
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse" dir="ltr">
      {people.map((m, i) => (
        <img key={i} src={m.photo} alt="" className={`${size} rounded-full object-cover ring-2 ring-[#14001a]`} />
      ))}
    </div>
  );
}

function Places({ data, members, locale, shown }: { data: FeaturedT["embedded"]; members: TeamMember[]; locale: Locale; shown: boolean }) {
  const branches = data.branches.slice(0, 6);

  // hand out team photos: three at HQ, then each branch gets its head-count
  const slice = (from: number, n: number) => (members.length ? Array.from({ length: n }, (_, k) => members[(from + k) % members.length]) : []);
  const hqCount = Math.min(3, members.length);
  const counts = branches.map((b) => Math.max(0, Math.min(6, Number(b.people) || 0)));
  const starts = counts.map((_, i) => hqCount + counts.slice(0, i).reduce((a, b) => a + b, 0));

  const places = [
    { name: data.hq, task: data.hqTask, image: data.hqImage, people: slice(0, hqCount), hq: true },
    ...branches.map((b, i) => ({ name: b.name, task: b.task, image: b.image, people: slice(starts[i], counts[i]), hq: false })),
  ];
  const [active, pick] = useCycle(places.length, shown, PLACE_MS);
  const p = places[active];
  const total = places.reduce((n, x) => n + x.people.length, 0);
  const ar = locale === "ar";

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[3rem] bg-cyan/10 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[#14001a] shadow-2xl">
        <Stage images={places.map((x) => x.image)} active={active} className="aspect-[4/5] sm:aspect-[4/3]">
          <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
            <Bars count={places.length} active={active} ms={PLACE_MS} onPick={pick} labels={places.map((x) => t(x.name, locale))} />
            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full bg-ink/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
                <Icon name="building" className="h-3.5 w-3.5 text-cyan" />
                {ar ? "شبكة شركتكم" : "Your company network"}
              </span>
              <span className="ms-auto">
                <Live><span className="font-latin">{total}</span> {ar ? "من ماجك بالدوام" : "Magic people on-site"}</Live>
              </span>
            </div>
          </div>

          {p && (
            <div key={active} className="absolute inset-x-0 bottom-0 p-5 sm:p-7" style={{ animation: "storyIn .6s var(--ease-out) both" }}>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${p.hq ? "bg-orchid text-ink" : "bg-cyan text-ink"}`}>
                <Icon name={p.hq ? "building" : "pin"} className="h-3.5 w-3.5" />
                {p.hq ? (ar ? "المقر الرئيسي" : "Head office") : ar ? "فرع" : "Branch"}
              </span>
              <h4 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">{t(p.name, locale)}</h4>
              <p className="mt-2 max-w-lg text-sm leading-7 text-white/80">{t(p.task, locale)}</p>
              {p.people.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <Avatars people={p.people} size="h-9 w-9" />
                  <span className="text-xs text-white/70">
                    <b className="font-latin text-white">{p.people.length}</b> {ar ? "من فريق ماجك يداومون هنا" : "from Magic work here"}
                  </span>
                </div>
              )}
            </div>
          )}
        </Stage>

        <div className="p-3 sm:p-4">
          <Thumbs
            items={places.map((x) => ({
              image: x.image,
              label: t(x.name, locale),
              caption: t(x.name, locale),
              color: (x.hq ? "orchid" : "cyan") as BrandColor,
              badge: (
                <span className="flex items-center gap-0.5">
                  <Icon name={x.hq ? "building" : "users"} className="h-2.5 w-2.5" />
                  <span className="font-latin">{x.people.length}</span>
                </span>
              ),
            }))}
            active={active}
            onPick={pick}
          />
        </div>
      </div>
    </div>
  );
}

function EmbeddedPanel({ data, members, locale, cta, shown }: { data: FeaturedT["embedded"]; members: TeamMember[]; locale: Locale; cta: string; shown: boolean }) {
  return (
    <div className="c-cyan">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="flex flex-col">
          <Intro data={data} locale={locale} />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.steps.map((s, i) => (
              <li key={i} className="relative rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <span className="font-latin text-xs font-bold text-cyan">{two(i + 1)}</span>
                <div className="mt-1 font-bold text-white">{t(s.title, locale)}</div>
                <p className="mt-1 text-xs leading-6 text-lilac/60">{t(s.body, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
        <Places data={data} members={members} locale={locale} shown={shown} />
      </div>

      {/* remote agency vs Magic in-house */}
      {data.compare.length > 0 && (
        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-[var(--line)]">
          <div className="grid grid-cols-[1fr_1fr_1.15fr] text-xs font-bold sm:text-sm">
            <div className="p-3 sm:p-4" />
            <div className="flex items-center gap-2 p-3 text-lilac/50 sm:p-4"><Icon name="close" className="h-4 w-4" />{t(data.compareRemote, locale)}</div>
            <div className="flex items-center gap-2 bg-orchid p-3 text-ink sm:p-4"><Icon name="check" className="h-4 w-4" strokeWidth={2.6} />{t(data.compareInside, locale)}</div>
          </div>
          {data.compare.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1.15fr] border-t border-white/10 text-xs sm:text-sm">
              <div className="p-3 font-bold text-white sm:p-4">{t(r.label, locale)}</div>
              <div className="p-3 text-lilac/45 line-through decoration-white/20 sm:p-4">{t(r.remote, locale)}</div>
              <div className="bg-orchid/[.12] p-3 font-bold text-white sm:p-4">{t(r.inside, locale)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="flex-1"><Stats stats={data.stats} locale={locale} /></div>
        <Cta label={cta} locale={locale} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Kind = "trade" | "embedded";

function cards(data: FeaturedT) {
  return [
    { key: "trade" as Kind, label: data.trade.tab, audience: data.trade.audience, image: data.trade.image, focus: "50% 60%", icon: "cart", color: "yellow" as BrandColor },
    { key: "embedded" as Kind, label: data.embedded.tab, audience: data.embedded.audience, image: data.embedded.image, focus: "50% 45%", icon: "users", color: "cyan" as BrandColor },
  ];
}

/** The two signature services as big photo cards; each opens its own page. */
export function Featured({ data, locale }: { data: FeaturedT; locale: Locale }) {
  const [ref, shown] = useShown<HTMLElement>(0.1);
  return (
    <section ref={ref} id="featured" className={`relative overflow-x-clip py-28 md:py-36 ${shown ? "is-shown" : ""}`}>
      <div className="aurora opacity-30" aria-hidden><span className="a2" /><span className="a5" /></div>
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHead eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} locale={locale} />

        <div className="reveal mt-12 grid gap-3 sm:grid-cols-2" style={{ ["--d" as string]: 3 }}>
          {cards(data).map((x, i) => (
            <Link
              key={x.key}
              href={featuredHref(locale, x.key)}
              className={`group relative isolate flex min-h-[12rem] items-end gap-4 overflow-hidden rounded-[1.5rem] p-4 text-start ring-2 ring-white/10 transition duration-500 hover:-translate-y-1 hover:ring-[color:var(--c)] hover:shadow-[0_30px_70px_-30px_var(--c)] sm:min-h-[16rem] sm:p-6 c-${x.color}`}
            >
              {x.image && (
                <img src={x.image} alt="" draggable={false} style={{ objectPosition: x.focus }} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
              )}
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/65 to-ink/5" />
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--c)] text-ink transition duration-500 group-hover:rotate-[-8deg] sm:h-14 sm:w-14">
                <Icon name={x.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-latin text-xs font-bold text-[color:var(--c)]">{two(i + 1)}</span>
                <span className="block text-lg font-bold leading-tight text-white sm:text-2xl">{t(x.label, locale)}</span>
                <span className="mt-1 block text-xs leading-5 text-white/65">{t(x.audience, locale)}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-white backdrop-blur-md transition duration-500 group-hover:border-transparent group-hover:bg-[color:var(--c)] group-hover:text-ink">
                <Icon name="arrow" className="flip-rtl h-4 w-4" />
              </span>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-[inline-start] scale-x-0 transition duration-500 group-hover:scale-x-100" style={{ background: "var(--c)" }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A signature service's own page: photo banner, the full explanation, then a link to the other service. */
export function FeaturedDetail({ kind, data, members, locale }: { kind: Kind; data: FeaturedT; members: TeamMember[]; locale: Locale }) {
  const [ref, shown] = useShown<HTMLElement>(0.05);
  const all = cards(data);
  const me = all.find((x) => x.key === kind)!;
  const other = all.find((x) => x.key !== kind)!;
  const cta = t(data.cta, locale);
  const ar = locale === "ar";
  return (
    <section ref={ref} className={`relative overflow-x-clip pb-24 pt-4 md:pb-32 ${shown ? "is-shown" : ""}`}>
      <div className="aurora opacity-30" aria-hidden><span className="a2" /><span className="a5" /></div>
      <div className="relative mx-auto max-w-6xl px-5">
        <Link href={pageHref(locale, "services")} className="inline-flex items-center gap-2 text-sm font-semibold text-lilac/70 transition hover:text-white">
          <Icon name="arrow" className="h-4 w-4 rotate-180 flip-rtl" />
          {ar ? "كل الخدمات" : "All services"}
        </Link>

        <div className={`reveal relative isolate mt-6 flex min-h-[16rem] items-end overflow-hidden rounded-[2rem] p-6 ring-2 ring-[color:var(--c)] sm:min-h-[22rem] sm:p-10 c-${me.color}`} style={{ ["--d" as string]: 0 }}>
          {me.image && <img src={me.image} alt="" draggable={false} style={{ objectPosition: me.focus }} className="absolute inset-0 -z-10 h-full w-full object-cover" />}
          <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[color:var(--c)] text-ink sm:h-20 sm:w-20 sm:rounded-3xl">
              <Icon name={me.icon} className="h-7 w-7 sm:h-9 sm:w-9" />
            </span>
            <div>
              <span className="eyebrow">{t(data.eyebrow, locale)}</span>
              <h1 className="mt-2 text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.05] text-white">{t(me.label, locale)}</h1>
              <p className="mt-2 text-sm text-white/70 sm:text-base">{t(me.audience, locale)}</p>
            </div>
          </div>
        </div>

        <div className="reveal mt-14 md:mt-20" style={{ ["--d" as string]: 1 }}>
          {kind === "trade" ? (
            <TradePanel data={data.trade} locale={locale} cta={cta} shown={shown} />
          ) : (
            <EmbeddedPanel data={data.embedded} members={members} locale={locale} cta={cta} shown={shown} />
          )}
        </div>

        <Link
          href={featuredHref(locale, other.key)}
          className={`group relative isolate mt-20 flex items-center gap-4 overflow-hidden rounded-[1.5rem] p-5 ring-2 ring-white/10 transition duration-500 hover:ring-[color:var(--c)] sm:p-6 c-${other.color}`}
        >
          {other.image && <img src={other.image} alt="" draggable={false} style={{ objectPosition: other.focus }} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-60" />}
          <span className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/40 to-ink rtl:bg-gradient-to-r" />
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--c)] text-ink">
            <Icon name={other.icon} className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-lilac/60">{ar ? "الخدمة المميزة الثانية" : "The other signature service"}</span>
            <span className="block text-lg font-bold text-white sm:text-2xl">{t(other.label, locale)}</span>
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-white transition duration-500 group-hover:border-transparent group-hover:bg-[color:var(--c)] group-hover:text-ink">
            <Icon name="arrow" className="flip-rtl h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
