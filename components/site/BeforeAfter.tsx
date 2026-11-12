"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Icon } from "@/components/brand/Icon";
import type { BeforeAfter as BAT, CaseStudy, Locale } from "@/lib/types";
import { t } from "@/lib/types";
import { fmtMetric, uplift } from "@/lib/format";
import { useShown } from "./shown";

const COLORS = ["#eb70fa", "#fac3fd", "#b3e9fc", "#f5fca9", "#9cfc8d", "#ffffff"];

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; star: boolean };

function useSparkles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const parts = useRef<P[]>([]);
  const raf = useRef(0);
  const running = useRef(false);

  const step = useRef<() => void>(() => {});
  useEffect(() => {
    step.current = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.current = parts.current.filter((p) => p.life < p.max);
    for (const p of parts.current) {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.vx *= 0.985;
      const a = Math.max(0, 1 - p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.star) {
        const s = p.size * (0.6 + a * 0.6);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 ? s * 0.35 : s;
          const ang = (i * Math.PI) / 4 + p.life * 0.05;
          ctx.lineTo(p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.current.length) raf.current = requestAnimationFrame(step.current);
    else running.current = false;
    };
  }, [canvasRef]);

  const emit = useCallback(
    (x: number, y: number, n = 3, power = 1.5) => {
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = Math.random() * power;
        parts.current.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - power * 0.3,
          life: 0,
          max: 40 + Math.random() * 50,
          size: 1.5 + Math.random() * (power > 2 ? 6 : 3.5),
          color: COLORS[(Math.random() * COLORS.length) | 0],
          star: Math.random() > 0.55,
        });
      }
      if (!running.current) {
        running.current = true;
        raf.current = requestAnimationFrame(step.current);
      }
    },
    [],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return emit;
}

export function BeforeAfter({ data, items, locale }: { data: BAT; items: CaseStudy[]; locale: Locale }) {
  const [sectionRef, shown] = useShown<HTMLElement>(0.2);
  const [ci, setCi] = useState(0);
  const [state, setState] = useState<"before" | "casting" | "after">("before");
  const [magic, setMagic] = useState<boolean[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wand = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const emit = useSparkles(canvas);
  const c = items[ci];

  // size canvas to section
  useEffect(() => {
    const el = sectionRef.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      cv.width = el.offsetWidth * dpr;
      cv.height = el.offsetHeight * dpr;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionRef]);

  const reset = useCallback(() => {
    tl.current?.kill();
    setState("before");
    setMagic([]);
    if (wand.current) gsap.set(wand.current, { autoAlpha: 0 });
    c?.metrics.forEach((m, i) => {
      const n = nums.current[i];
      if (n) n.textContent = fmtMetric(m, m.before);
    });
  }, [c]);

  const selectCase = (i: number) => {
    tl.current?.kill();
    if (wand.current) gsap.set(wand.current, { autoAlpha: 0 });
    setState("before");
    setMagic([]);
    setCi(i);
  };

  const cast = () => {
    const el = sectionRef.current;
    const w = wand.current;
    if (!el || !w || !c || state !== "before") return;
    setState("casting");
    const base = el.getBoundingClientRect();
    const center = (node: Element) => {
      const r = node.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
    };
    const start = center(btn.current!);
    const tip = { x: 0, y: 0 };
    const sync = () => {
      const x = Number(gsap.getProperty(w, "x"));
      const y = Number(gsap.getProperty(w, "y"));
      tip.x = x;
      tip.y = y;
      emit(x, y, 2, 1.2);
    };
    const t = gsap.timeline({ onComplete: () => setState("after") });
    tl.current = t;
    t.set(w, { x: start.x, y: start.y, autoAlpha: 0, rotate: -30, scale: 0.6, transformOrigin: "6px 6px" });
    t.to(w, { autoAlpha: 1, scale: 1, y: start.y - 60, rotate: -10, duration: 0.45, ease: "back.out(2)", onUpdate: sync });
    c.metrics.forEach((m, i) => {
      const card = cards.current[i];
      if (!card) return;
      const p = center(card);
      t.to(w, {
        x: p.x,
        y: p.y - 30,
        rotate: i % 2 ? 18 : -18,
        duration: 0.55,
        ease: "power2.inOut",
        onUpdate: sync,
      });
      t.add(() => {
        card.style.setProperty("--fx", "50%");
        card.style.setProperty("--fy", "40%");
        setMagic((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        emit(p.x, p.y - 20, 60, 4);
        const o = { v: m.before };
        gsap.to(o, {
          v: m.after,
          duration: 1.6,
          ease: "expo.out",
          onUpdate: () => {
            const n = nums.current[i];
            if (n) n.textContent = fmtMetric(m, o.v);
          },
        });
      });
      t.to(w, { rotate: i % 2 ? -25 : 25, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" });
    });
    t.to(w, { y: "-=140", autoAlpha: 0, rotate: 40, scale: 0.6, duration: 0.6, ease: "power2.in", onUpdate: sync });
  };

  if (!c) return null;
  const after = state === "after";

  return (
    <section ref={sectionRef} id="beforeAfter" className={`relative overflow-hidden py-28 md:py-36 ${shown ? "is-shown" : ""}`}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000" style={{ opacity: after ? 1 : 0, background: "radial-gradient(60% 50% at 50% 55%, rgba(235,112,250,.22), transparent 70%)" }} aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow reveal">{t(data.eyebrow, locale)}</span>
          <h2 className="h-section reveal mt-5" style={{ ["--d" as string]: 1 }}>
            <span className="relative inline-grid">
              <span className={`col-start-1 row-start-1 transition-all duration-700 ${after ? "translate-y-[-30%] opacity-0 blur-sm" : ""}`}>{t(data.title, locale)}</span>
              <span className={`text-gradient col-start-1 row-start-1 transition-all duration-700 ${after ? "" : "translate-y-[30%] opacity-0 blur-sm"}`}>
                {locale === "ar" ? "الأرقام بعد ماجك" : "The numbers after Magic"}
              </span>
            </span>
          </h2>
          <p className="lead reveal mt-5" style={{ ["--d" as string]: 2 }}>{t(data.subtitle, locale)}</p>
        </div>

        {items.length > 1 && (
          <div className="reveal mt-10 flex flex-wrap justify-center gap-2" style={{ ["--d" as string]: 3 }} role="tablist">
            {items.map((it, i) => (
              <button
                key={it.id}
                role="tab"
                aria-selected={i === ci}
                onClick={() => selectCase(i)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${i === ci ? "border-orchid bg-orchid/15" : "border-[var(--line)] opacity-60 hover:opacity-100"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.logo} alt="" className="h-5 w-auto" />
                <span className="sr-only">{it.client}</span>
              </button>
            ))}
          </div>
        )}

        <div className="reveal mt-10 flex items-center justify-center gap-3 text-sm font-semibold" style={{ ["--d" as string]: 4 }}>
          <span className={`pill transition ${after ? "opacity-40 c-ink text-lilac!" : "c-lilac"}`}>{t(data.beforeLabel, locale)}</span>
          <Icon name="arrow" className="h-4 w-4 text-lilac/50 flip-rtl" />
          <span className={`pill transition ${after ? "c-green" : "opacity-40 c-ink text-lilac!"}`}>{t(data.afterLabel, locale)}</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {c.metrics.map((m, i) => (
            <div
              key={`${c.id}-${i}`}
              ref={(n) => {
                cards.current[i] = n;
              }}
              className={`metric-card reveal p-6 md:p-7 ${magic[i] ? "is-magic" : ""}`}
              style={{ ["--d" as string]: 5 + i * 0.5 }}
            >
              <span className="flash" />
              <div className="text-sm text-lilac/70">{t(m.label, locale)}</div>
              <div className="num mt-4 font-latin text-3xl font-extrabold md:text-5xl" dir="ltr">
                <span
                  ref={(n) => {
                    nums.current[i] = n;
                  }}
                >
                  {fmtMetric(m, m.before)}
                </span>
              </div>
              <div className="uplift mt-4 flex items-center gap-2" dir="ltr">
                <span className="rounded-full bg-green px-2.5 py-1 font-latin text-xs font-extrabold text-ink">{uplift(m)}</span>
                <span className="font-latin text-xs text-lilac/50 line-through">{fmtMetric(m, m.before)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 flex justify-center" style={{ ["--d" as string]: 8 }}>
          {state !== "after" ? (
            <button ref={btn} onClick={cast} disabled={state === "casting"} className="wand-btn btn rounded-full px-8! py-5! text-lg text-white disabled:opacity-70">
              <Icon name="wand" className="h-6 w-6 text-orchid" />
              {t(data.button, locale)}
            </button>
          ) : (
            <button onClick={reset} className="btn btn-ghost">
              {t(data.reset, locale)}
            </button>
          )}
        </div>
      </div>

      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      {/* the wand */}
      <div ref={wand} className="pointer-events-none invisible absolute left-0 top-0 z-10" style={{ marginLeft: -6, marginTop: -6 }} aria-hidden>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "translate(-6px,-6px)", filter: "drop-shadow(0 0 18px rgba(235,112,250,.9))" }}>
          <defs>
            <linearGradient id="wandg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fac3fd" />
              <stop offset="1" stopColor="#3a0a42" />
            </linearGradient>
          </defs>
          <path d="M12 12 L104 104" stroke="url(#wandg)" strokeWidth="9" strokeLinecap="round" />
          <path d="M12 12 L26 26" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
          <path d="M12 -2 L15 9 L26 12 L15 15 L12 26 L9 15 L-2 12 L9 9 Z" fill="#fff" />
        </svg>
      </div>
    </section>
  );
}
