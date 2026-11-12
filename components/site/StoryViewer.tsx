"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/brand/Icon";
import type { CaseStudy, Locale } from "@/lib/types";
import { t } from "@/lib/types";
import { fmtMetric, uplift } from "@/lib/format";

type Frame = { kind: "cover" | "chapter" | "metrics"; key?: "challenge" | "idea" | "execution" | "result" };
const FRAMES: Frame[] = [
  { kind: "cover" },
  { kind: "chapter", key: "challenge" },
  { kind: "chapter", key: "idea" },
  { kind: "chapter", key: "execution" },
  { kind: "chapter", key: "result" },
  { kind: "metrics" },
];
const CH_COLOR = { challenge: "cyan", idea: "yellow", execution: "orchid", result: "green" } as const;

export function StoryViewer({ cases, start, locale, onClose }: { cases: CaseStudy[]; start: number; locale: Locale; onClose: () => void }) {
  const [ci, setCi] = useState(start);
  const [fi, setFi] = useState(0);
  const [paused, setPaused] = useState(false);
  const down = useRef(0);
  const c = cases[ci];
  const rtl = locale === "ar";

  const next = useCallback(() => {
    if (fi < FRAMES.length - 1) setFi(fi + 1);
    else if (ci < cases.length - 1) {
      setCi(ci + 1);
      setFi(0);
    } else onClose();
  }, [fi, ci, cases.length, onClose]);
  const prev = useCallback(() => {
    if (fi > 0) setFi(fi - 1);
    else if (ci > 0) {
      setCi(ci - 1);
      setFi(0);
    }
  }, [fi, ci]);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") (rtl ? prev : next)();
      else if (e.key === "ArrowLeft") (rtl ? next : prev)();
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [next, prev, onClose, rtl]);

  const frame = FRAMES[fi];
  const chapter = frame.key ? c[frame.key] : null;
  const bg = chapter?.image || c.cover;

  const onPointerDown = () => {
    down.current = Date.now();
    setPaused(true);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setPaused(false);
    if (Date.now() - down.current > 280) return; // long press = pause only
    const r = e.currentTarget.getBoundingClientRect();
    const leftHalf = e.clientX - r.left < r.width * 0.35;
    const isBack = rtl ? !leftHalf && e.clientX - r.left > r.width * 0.65 : leftHalf;
    (isBack ? prev : next)();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 backdrop-blur-xl" dir={rtl ? "rtl" : "ltr"} role="dialog" aria-modal aria-label={c.client}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bg} alt="" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-3xl" />
      <button onClick={onClose} className="absolute end-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
        <Icon name="close" />
      </button>
      {ci > 0 && (
        <button onClick={() => { setCi(ci - 1); setFi(0); }} className="absolute start-6 z-20 hidden h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:grid" aria-label="Previous story">
          <Icon name={rtl ? "chevR" : "chevL"} />
        </button>
      )}
      {ci < cases.length - 1 && (
        <button onClick={() => { setCi(ci + 1); setFi(0); }} className="absolute end-6 z-20 hidden h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:grid" aria-label="Next story">
          <Icon name={rtl ? "chevL" : "chevR"} />
        </button>
      )}

      <div
        className={`relative h-[100dvh] w-full overflow-hidden bg-ink select-none md:h-[min(88vh,860px)] md:w-auto md:aspect-[9/16] md:rounded-[2rem] md:shadow-[0_40px_120px_-20px_rgba(235,112,250,.45)] ${paused ? "story-paused" : ""}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => setPaused(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={bg + fi} src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ animation: "kenburns 8s ease-out both" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/95" />

        <div className="absolute inset-x-0 top-0 z-10 p-4">
          <div className="flex gap-1.5" dir={rtl ? "rtl" : "ltr"}>
            {FRAMES.map((_, i) => (
              <div key={`${ci}-${i}`} className={`story-progress ${i < fi ? "done" : ""} ${i === fi ? "active" : ""}`}>
                <i onAnimationEnd={i === fi ? next : undefined} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-ink ring-2 ring-orchid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt="" className="h-[55%] w-[55%] object-cover object-left" />
            </div>
            <div className="leading-tight">
              <div className="font-latin text-sm font-bold">{c.client}</div>
              <div className="text-xs text-lilac/70">{t(c.industry, locale)} · {t(c.duration, locale)}</div>
            </div>
            {paused && <Icon name="pause" className="ms-auto h-4 w-4 text-white/80" />}
          </div>
        </div>

        <div key={`${ci}-${fi}`} className="absolute inset-x-0 bottom-0 z-10 p-7 pb-10" style={{ animation: "storyIn .7s cubic-bezier(.16,1,.3,1) both" }}>
          {frame.kind === "cover" && (
            <>
              <span className={`pill c-${c.color}`}>{locale === "ar" ? "قصة نجاح" : "Success story"}</span>
              <h3 className="mt-4 text-4xl font-bold leading-tight">{t(c.headline, locale)}</h3>
              <p className="mt-4 flex items-center gap-2 text-sm text-lilac/80">
                <Icon name={rtl ? "chevL" : "chevR"} className="h-4 w-4" /> {locale === "ar" ? "اضغط للمتابعة" : "Tap to continue"}
              </p>
            </>
          )}
          {frame.kind === "chapter" && chapter && frame.key && (
            <>
              <div className="flex items-center gap-2">
                <span className={`pill c-${CH_COLOR[frame.key]}`}>{String(fi).padStart(2, "0")}</span>
                <span className={`pill c-${CH_COLOR[frame.key]}`}>{t(chapter.title, locale)}</span>
              </div>
              <p className="mt-5 text-2xl font-semibold leading-relaxed md:text-[1.6rem]">{t(chapter.body, locale)}</p>
            </>
          )}
          {frame.kind === "metrics" && (
            <>
              <span className="pill c-green">{locale === "ar" ? "بالأرقام" : "By the numbers"}</span>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {c.metrics.map((m, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-ink/60 p-4 backdrop-blur" style={{ animation: `storyIn .7s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.12}s both` }}>
                    <div className="text-xs text-lilac/70">{t(m.label, locale)}</div>
                    <div className="mt-2 font-latin text-2xl font-extrabold text-white" dir="ltr">{fmtMetric(m, m.after)}</div>
                    <div className="mt-1 flex items-center justify-between gap-2 font-latin text-xs" dir="ltr">
                      <span className="text-lilac/50 line-through">{fmtMetric(m, m.before)}</span>
                      <span className="rounded-full bg-green px-2 py-0.5 font-bold text-ink">{uplift(m)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
