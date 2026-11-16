"use client";
import type { Locale, Team as TeamT } from "@/lib/types";
import { t } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { useShown } from "./shown";

export function Team({ data, locale }: { data: TeamT; locale: Locale }) {
  const [ref, shown] = useShown<HTMLElement>(0.15);
  const { members } = data;

  return (
    <section ref={ref} id="team" className={`relative overflow-x-clip py-28 md:py-36 ${shown ? "is-shown" : ""}`}>
      <div className={`mx-auto grid max-w-6xl items-center gap-14 px-5 ${members.length ? "lg:grid-cols-[1fr_1.15fr]" : ""}`}>
        <div>
          <SectionHead eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} locale={locale} />
          <ul className="mt-10 space-y-4">
            {data.points.map((pt, i) => (
              <li key={i} className="reveal flex gap-4" style={{ ["--d" as string]: 3 + i }}>
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orchid/15 text-orchid">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 5 5 9-10" /></svg>
                </span>
                <div>
                  <h3 className="font-bold text-white">{t(pt.title, locale)}</h3>
                  <p className="mt-1 text-sm leading-7 text-lilac/65">{t(pt.body, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Member cards */}
        {members.length > 0 && (
        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-orchid/15 blur-3xl" aria-hidden />
          <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
            {members.map((m, i) => (
              <article
                key={i}
                className={`reveal group relative overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:ring-[color:var(--c)]/60 c-${m.color} ${i % 3 === 1 ? "sm:translate-y-6 sm:hover:translate-y-4" : ""}`}
                style={{ ["--d" as string]: 3 + i * 0.5 }}
              >
                <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "color-mix(in oklab, var(--c) 25%, #14001a)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photo}
                    alt={t(m.name, locale)}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
                </div>
                <div className="relative px-4 pb-4 -mt-8">
                  <div className="font-bold leading-tight text-white">{t(m.name, locale)}</div>
                  <div className="mt-1 text-xs font-semibold text-[color:var(--c)]">{t(m.role, locale)}</div>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-[inline-start] scale-x-0 transition duration-500 group-hover:scale-x-100" style={{ background: "var(--c)" }} />
              </article>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
