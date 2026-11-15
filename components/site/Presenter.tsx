"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { Logo, Mark } from "@/components/brand/Logo";
import type { CaseStudy, Content, Locale, Presentation, SectionKey } from "@/lib/types";
import { SECTION_LABELS, t } from "@/lib/types";
import { RenderSection } from "./RenderSection";
import { SlideContext } from "./shown";

type Slide = { id: string; label: string; key?: SectionKey };

function Cover({ deck, locale, active }: { deck: Presentation; locale: Locale; active: boolean }) {
  const date = new Intl.DateTimeFormat(locale === "ar" ? "ar-IQ" : "en-GB", { month: "long", year: "numeric" }).format(new Date());
  return (
    <section className={`grain relative overflow-hidden px-6 ${active ? "is-shown" : ""}`}>
      <div className="aurora" aria-hidden>
        <span className="a1" /><span className="a2" /><span className="a3" /><span className="a4" /><span className="a5" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="pill-outline reveal">{locale === "ar" ? "عرض خاص لـ" : "Prepared for"}</span>
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10" style={{ ["--d" as string]: 1 }} dir="ltr">
          <Logo className="h-14 w-auto text-lilac md:h-24" />
          <span className="font-latin text-4xl font-light text-orchid md:text-7xl">×</span>
          {deck.clientLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={deck.clientLogo} alt={deck.client} className="h-14 w-auto md:h-24" />
          ) : (
            <span className="font-latin text-4xl font-extrabold md:text-7xl">{deck.client}</span>
          )}
        </div>
        <p className="lead reveal mt-10 max-w-2xl" style={{ ["--d" as string]: 3 }}>{t(deck.note, locale)}</p>
        <p className="reveal mt-4 text-sm text-lilac/50" style={{ ["--d" as string]: 4 }}>{date}</p>
        <p className="reveal mt-16 flex items-center gap-2 text-sm text-lilac/60" style={{ ["--d" as string]: 6 }}>
          <kbd className="rounded-md border border-[var(--line)] px-2 py-0.5 font-latin">{locale === "ar" ? "←" : "→"}</kbd>
          {locale === "ar" ? "للبدء" : "to begin"}
        </p>
      </div>
    </section>
  );
}

export function Presenter({
  content,
  keys,
  locale,
  deck,
  cases,
  basePath,
}: {
  content: Content;
  keys: SectionKey[];
  locale: Locale;
  deck?: Presentation;
  cases?: CaseStudy[];
  basePath: string;
}) {
  const rtl = locale === "ar";
  const items = cases ?? content.cases.items;
  const slides: Slide[] = useMemo(
    () => [
      ...(deck ? [{ id: "cover", label: locale === "ar" ? "الغلاف" : "Cover" }] : []),
      ...keys
        .filter((k) => !(k === "cases" && !items.length) && !(k === "beforeAfter" && !items.some((c) => c.metrics.length)))
        .map((k) => ({ id: k, key: k, label: t(SECTION_LABELS[k], locale) })),
    ],
    [deck, keys, items, locale],
  );
  const [idx, setIdx] = useState(0);
  const [idle, setIdle] = useState(false);
  const [full, setFull] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lock = useRef(0);
  const wheelAcc = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, n));
      setIdx(next);
      history.replaceState(null, "", `#${slides[next].id}`);
    },
    [slides],
  );
  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  // deep link via hash (also catches in-section anchors like #cases)
  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const i = slides.findIndex((s) => s.id === h);
      if (i >= 0) setIdx(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    slideRefs.current[idx]?.scrollTo({ top: 0 });
  }, [idx]);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const fwd = rtl ? "ArrowLeft" : "ArrowRight";
      const back = rtl ? "ArrowRight" : "ArrowLeft";
      if ([fwd, "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if ([back, "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key.toLowerCase() === "f") toggleFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, rtl, slides.length, toggleFull]);

  // wheel: scroll inside a tall slide first, then move to the next one
  const onWheel = (e: React.WheelEvent) => {
    const el = slideRefs.current[idx];
    if (!el) return;
    const atTop = el.scrollTop <= 2;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
      wheelAcc.current = 0;
      return;
    }
    if (Date.now() - lock.current < 900) return;
    wheelAcc.current += e.deltaY;
    if (Math.abs(wheelAcc.current) > 60) {
      lock.current = Date.now();
      if (wheelAcc.current > 0) next();
      else prev();
      wheelAcc.current = 0;
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const forward = rtl ? dx > 0 : dx < 0;
      if (forward) next();
      else prev();
    }
  };

  // auto-hide controls
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(tm);
      tm = setTimeout(() => setIdle(true), 2600);
    };
    wake();
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      clearTimeout(tm);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  const other: Locale = locale === "ar" ? "en" : "ar";
  const exitHref = `/${locale}`;

  return (
    <div className="deck" onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          ref={(n) => {
            slideRefs.current[i] = n;
          }}
          className={`slide ${i === idx ? "is-active" : ""} ${i < idx ? "is-past" : ""}`}
          aria-hidden={i !== idx}
          inert={i !== idx}
        >
          <SlideContext.Provider value={{ inDeck: true, active: i === idx }}>
            {s.key ? <RenderSection k={s.key} content={content} locale={locale} cases={items} /> : deck && <Cover deck={deck} locale={locale} active={i === idx} />}
          </SlideContext.Provider>
        </div>
      ))}

      {/* progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/5">
        <div className="h-full bg-gradient-to-r from-cyan via-orchid to-green transition-all duration-700 ease-out" style={{ width: `${((idx + 1) / slides.length) * 100}%`, marginInlineStart: 0 }} />
      </div>

      {/* top bar */}
      <div className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-5 transition-opacity duration-500 ${idle ? "opacity-0" : "opacity-100"}`}>
        <Mark className="h-7 w-auto text-orchid" />
        <div className="flex items-center gap-2">
          <Link href={`/${other}${basePath}#${slides[idx].id}`} className="glass rounded-full px-4 py-2 text-sm font-semibold text-lilac hover:text-white">
            {other === "en" ? "EN" : "عربي"}
          </Link>
          <Link href={exitHref} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-lilac hover:text-white">
            <Icon name="close" className="h-4 w-4" />
            {locale === "ar" ? "خروج" : "Exit"}
          </Link>
        </div>
      </div>

      {/* side dots */}
      <nav className={`fixed end-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 transition-opacity duration-500 md:flex ${idle ? "opacity-30" : "opacity-100"}`} aria-label="Slides">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => go(i)} className="group relative flex items-center justify-end" aria-label={s.label} aria-current={i === idx}>
            <span className="pointer-events-none absolute end-6 whitespace-nowrap rounded-full bg-ink-2 px-3 py-1 text-xs text-lilac opacity-0 transition group-hover:opacity-100">{s.label}</span>
            <span className={`block rounded-full transition-all duration-500 ${i === idx ? "h-6 w-2 bg-orchid" : "h-2 w-2 bg-lilac/30 group-hover:bg-lilac"}`} />
          </button>
        ))}
      </nav>

      {/* bottom controls */}
      <div className={`fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-500 ${idle ? "pointer-events-none translate-y-4 opacity-0" : ""}`}>
        <div className="glass flex items-center gap-1 rounded-full p-1.5">
          <button onClick={prev} disabled={idx === 0} className="grid h-11 w-11 place-items-center rounded-full text-lilac transition hover:bg-white/10 disabled:opacity-30" aria-label="Previous">
            <Icon name={rtl ? "chevR" : "chevL"} />
          </button>
          <div className="min-w-40 px-3 text-center">
            <div className="font-latin text-xs text-lilac/50" dir="ltr">
              {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
            <div className="text-sm font-semibold">{slides[idx].label}</div>
          </div>
          <button onClick={next} disabled={idx === slides.length - 1} className="grid h-11 w-11 place-items-center rounded-full bg-orchid text-ink transition hover:bg-lilac disabled:opacity-30" aria-label="Next">
            <Icon name={rtl ? "chevL" : "chevR"} />
          </button>
          <span className="mx-1 h-6 w-px bg-white/10" />
          <button onClick={toggleFull} className="grid h-11 w-11 place-items-center rounded-full text-lilac transition hover:bg-white/10" aria-label="Fullscreen" title="F">
            <Icon name="expand" className={`h-5 w-5 ${full ? "text-orchid" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
