"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { pageHref, projectHref } from "@/lib/pages";
import type { Hero as HeroT, Locale, Project } from "@/lib/types";
import { canAmbient, parseVideo, posterOf } from "@/lib/video";
import { t } from "@/lib/types";
import { SlideContext, useShown } from "./shown";
import { AmbientVideo, VideoPlayer } from "./Video";

/** Slot layout for the stacked post cards (physical positions, container is LTR). */
const SLOTS = [
  { x: 20, y: 0, r: -4, s: 1, z: 30, depth: 26 }, // front
  { x: 44, y: 9, r: 7, s: 0.94, z: 20, depth: 16 }, // behind, right
  { x: 0, y: 20, r: -11, s: 0.92, z: 10, depth: 8 }, // behind, left
];
const HIDDEN = { x: 22, y: 14, r: 0, s: 0.85, z: 0, depth: 0 };

type CardProject = Pick<Project, "slug" | "client" | "color" | "cover">;

function PostStack({ cards, projects, locale, shown }: { cards: HeroT["cards"]; projects: CardProject[]; locale: Locale; shown: boolean }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [hover, setHover] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);

  // keep order valid if the dashboard changes the number of cards
  const valid = order.length === cards.length ? order : cards.map((_, i) => i);
  const next = () => setOrder((o) => (o.length > 1 ? [...o.slice(1), o[0]] : o));

  // "swipe to find out": the stack shuffles by itself while nobody is hovering
  useEffect(() => {
    if (!shown || hover || playing !== null || cards.length < 2) return;
    const id = setInterval(next, 4200);
    return () => clearInterval(id);
  }, [shown, hover, playing, cards.length]);

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
        const proj = projects.find((x) => x.slug === c.project);
        const image = c.image || posterOf(c.video, "") || proj?.cover || "";
        const front = slot === 0;
        return (
          <div
            key={i}
            className="absolute top-0 w-[54%]"
            style={{
              left: `${p.x + (hover ? (slot === 1 ? 4 : slot === 2 ? -4 : 0) : 0)}%`,
              top: `${p.y}%`,
              zIndex: p.z,
              opacity: shown && SLOTS[slot] ? 1 : 0,
              pointerEvents: SLOTS[slot] ? undefined : "none",
              transform:
                enter ||
                `translate(calc(var(--px, 0) * ${p.depth}px), calc(var(--py, 0) * ${p.depth}px)) rotate(${p.r + fan}deg) scale(${p.s})`,
              transition: `transform 1s cubic-bezier(.16,1,.3,1), left .9s cubic-bezier(.16,1,.3,1), top .9s cubic-bezier(.16,1,.3,1), opacity .8s ease ${shown ? 0.25 + (2 - Math.min(slot, 2)) * 0.12 : 0}s`,
            }}
          >
            <button
              type="button"
              onClick={() => {
                // TikTok / Instagram can't play silently in the card: the front one opens a player instead
                const v = parseVideo(c.video);
                if (front && v && !canAmbient(v)) setPlaying(i);
                else next();
              }}
              aria-label={c.alt}
              className="relative block w-full cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_50px_90px_-25px_rgba(0,0,0,.75)] outline-none focus-visible:ring-2 focus-visible:ring-orchid"
            >
              {c.video ? (
                <AmbientVideo video={c.video} image={image} alt={c.alt} eager={front} className="aspect-[4/5] w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={c.alt} className="block aspect-[4/5] w-full object-cover" draggable={false} loading={front ? "eager" : "lazy"} />
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
            </button>
            {proj && (
              <Link
                href={projectHref(locale, proj.slug)}
                tabIndex={front ? 0 : -1}
                className={`c-${proj.color || "orchid"} absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-ink/65 py-1.5 pe-3.5 ps-2.5 font-latin text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-[color:var(--c)] hover:text-ink`}
              >
                <span className="h-2 w-2 rounded-full bg-[color:var(--c)]" />
                {proj.client}
                {c.video && <span className="text-[10px] tracking-wider text-green">● REEL</span>}
              </Link>
            )}
          </div>
        );
      })}
      {playing !== null && cards[playing]?.video && (
        <VideoModal video={cards[playing].video!} image={cards[playing].image} title={cards[playing].alt} onClose={() => setPlaying(null)} />
      )}
    </div>
  );
}

function VideoModal({ video, image, title, onClose }: { video: string; image: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose} data-lenis-prevent className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/90 p-6 pt-20 backdrop-blur-xl">
      <button type="button" onClick={onClose} aria-label="Close" className="absolute end-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-orchid hover:text-ink">
        ×
      </button>
      <div className="flex h-full w-full items-center justify-center">
        <VideoPlayer video={video} image={image} title={title} />
      </div>
    </div>,
    document.body,
  );
}

export function Hero({ data, projects = [], locale }: { data: HeroT; projects?: CardProject[]; locale: Locale }) {
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
            <PostStack cards={cards} projects={projects} locale={locale} shown={shown} />
          </div>
        )}
      </div>
    </section>
  );
}
