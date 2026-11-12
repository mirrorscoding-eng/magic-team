"use client";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pageHref } from "@/lib/pages";
import type { Hero as HeroT, Locale } from "@/lib/types";
import { t } from "@/lib/types";
import { SlideContext, useShown } from "./shown";

/** Slot layout for the stacked post cards (physical positions, container is LTR). */
const SLOTS = [
  { x: 20, y: 0, r: -4, s: 1, z: 30, depth: 26 }, // front
  { x: 44, y: 9, r: 7, s: 0.94, z: 20, depth: 16 }, // behind, right
  { x: 0, y: 20, r: -11, s: 0.92, z: 10, depth: 8 }, // behind, left
];
const HIDDEN = { x: 22, y: 14, r: 0, s: 0.85, z: 0, depth: 0 };

function PostStack({ cards, shown }: { cards: HeroT["cards"]; shown: boolean }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [hover, setHover] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // keep order valid if the dashboard changes the number of cards
  const valid = order.length === cards.length ? order : cards.map((_, i) => i);
  const next = () => setOrder((o) => (o.length > 1 ? [...o.slice(1), o[0]] : o));

  // "swipe to find out": the stack shuffles by itself while nobody is hovering
  useEffect(() => {
    if (!shown || hover || cards.length < 2) return;
    const id = setInterval(next, 4200);
    return () => clearInterval(id);
  }, [shown, hover, cards.length]);

  const onMove = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    box.current!.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    box.current!.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  };

  return (
    <div
      ref={box}
      dir="ltr"
      className="relative mx-auto aspect-[1/0.92] w-full max-w-[38rem] select-none"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        box.current?.style.setProperty("--px", "0");
        box.current?.style.setProperty("--py", "0");
      }}
      onPointerMove={onMove}
    >
      {cards.map((c, i) => {
        const slot = valid.indexOf(i);
        const p = SLOTS[slot] ?? HIDDEN;
        const fan = hover ? (slot === 0 ? 0 : slot === 1 ? 4 : -5) : 0;
        const enter = shown ? "" : "translate(0, 90px) rotate(0deg) scale(.9)";
        return (
          <button
            key={i}
            type="button"
            onClick={next}
            aria-label={c.alt}
            className="absolute top-0 w-[54%] cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_50px_90px_-25px_rgba(0,0,0,.75)] outline-none focus-visible:ring-2 focus-visible:ring-orchid"
            style={{
              left: `${p.x + (hover ? (slot === 1 ? 4 : slot === 2 ? -4 : 0) : 0)}%`,
              top: `${p.y}%`,
              zIndex: p.z,
              opacity: shown && SLOTS[slot] ? 1 : 0,
              transform:
                enter ||
                `translate(calc(var(--px, 0) * ${p.depth}px), calc(var(--py, 0) * ${p.depth}px)) rotate(${p.r + fan}deg) scale(${p.s})`,
              transition: `transform 1s cubic-bezier(.16,1,.3,1) ${shown ? 0 : 0}s, left .9s cubic-bezier(.16,1,.3,1), top .9s cubic-bezier(.16,1,.3,1), opacity .8s ease ${shown ? 0.25 + (2 - Math.min(slot, 2)) * 0.12 : 0}s`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={c.alt} className="block aspect-[4/5] w-full object-cover" draggable={false} loading={slot === 0 ? "eager" : "lazy"} />
          </button>
        );
      })}
    </div>
  );
}

export function Hero({ data, locale }: { data: HeroT; locale: Locale }) {
  const [ref, seen] = useShown<HTMLElement>(0.05);
  const { inDeck } = useContext(SlideContext);
  // On the page the hero is above the fold: reveal it with CSS on first paint (no wait for JS).
  const shown = inDeck ? seen : true;
  const ar = locale === "ar";
  const cards = data.cards ?? [];
  return (
    <section ref={ref} id="hero" className={`grain relative flex min-h-[100dvh] items-center overflow-hidden px-5 pb-20 pt-32 md:px-10 ${inDeck ? (shown ? "is-shown" : "") : "hero-css"}`}>
      <div className="aurora" aria-hidden>
        <span className="a1" /><span className="a2" /><span className="a3" /><span className="a4" /><span className="a5" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_20%,rgba(32,0,36,.75)_90%)]" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
        <div>
          {data.pills?.length > 0 && (
            <div className="reveal mb-7 flex flex-wrap items-center gap-2" style={{ ["--d" as string]: 0 }}>
              {data.pills.map((p, i) => {
                const label = t(p.label, locale);
                const round = label.length <= 3;
                return (
                  <span key={i} className={`pill c-${p.color} font-latin text-sm! md:text-base! ${round ? "h-11 w-11 justify-center px-0!" : "px-5! py-2!"}`}>
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          <h1 className={`font-bold tracking-tight ${ar ? "text-[clamp(3rem,7.6vw,7.4rem)] leading-[1.08]" : "text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[1.02]"}`}>
            <span className={`reveal block bg-clip-text pb-[0.06em] text-transparent ${ar ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-lilac via-orchid to-orchid`} style={{ ["--d" as string]: 1 }}>
              {t(data.title, locale)}
            </span>
            <span className={`reveal block bg-clip-text pb-[0.08em] text-transparent ${ar ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-lilac to-[#f6a8fb]`} style={{ ["--d" as string]: 2 }}>
              {t(data.highlight, locale)}
            </span>
          </h1>

          {t(data.tagline, locale) && (
            <p className="reveal mt-6 font-display text-[clamp(1.5rem,2.7vw,2.5rem)] uppercase leading-none text-lilac" dir="ltr" style={{ ["--d" as string]: 3, textAlign: ar ? "right" : "left" }}>
              {t(data.tagline, locale)}
            </p>
          )}

          <p className="lead reveal mt-7 max-w-xl text-[1.15rem]!" style={{ ["--d" as string]: 4 }}>
            {t(data.subtitle, locale)}
          </p>

          <div className="reveal mt-10 flex flex-wrap gap-3" style={{ ["--d" as string]: 5 }}>
            <Link href={pageHref(locale, "work")} className="btn btn-primary px-7! py-4! text-lg!">
              {t(data.ctaPrimary, locale)}
            </Link>
            <Link href={pageHref(locale, "contact")} className="btn btn-ghost px-7! py-4! text-lg! text-white!">
              {t(data.ctaSecondary, locale)}
            </Link>
          </div>
        </div>

        {cards.length > 0 && (
          <div className={`relative px-2 pb-10 sm:px-8 lg:px-0 ${inDeck ? "" : "stack-in"}`}>
            <PostStack cards={cards} shown={shown} />
          </div>
        )}
      </div>
    </section>
  );
}
