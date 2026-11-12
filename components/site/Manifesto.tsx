"use client";
import { Mark } from "@/components/brand/Logo";
import type { Locale, Manifesto as MT } from "@/lib/types";
import { t } from "@/lib/types";
import { useShown } from "./shown";

export function Manifesto({ data, locale }: { data: MT; locale: Locale }) {
  const [ref, shown] = useShown<HTMLElement>(0.3);
  const en = locale === "en";
  return (
    <section ref={ref} id="manifesto" className={`relative overflow-hidden bg-orchid py-28 text-ink md:py-40 ${shown ? "is-shown" : ""}`}>
      <Mark className="pointer-events-none absolute -bottom-[20%] start-[-8%] h-[140%] w-auto text-[#d95fe8] opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 text-center">
        <p className={`${en ? "font-display uppercase tracking-tight" : "font-bold"} text-[clamp(3rem,10vw,9rem)] leading-[0.95]`}>
          {[data.line1, data.line2, data.line3].map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <span className="block transition-transform duration-[1.1s]" style={{ transform: shown ? "none" : "translateY(110%)", transitionDelay: `${i * 0.12}s`, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}>
                {t(l, locale)}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
