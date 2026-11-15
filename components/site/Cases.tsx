"use client";
import { useState } from "react";
import { Icon } from "@/components/brand/Icon";
import type { CaseStudy, Cases as CasesT, Locale } from "@/lib/types";
import { t } from "@/lib/types";
import { uplift } from "@/lib/format";
import { SectionHead } from "./SectionHead";
import { Reveal } from "./shown";
import { StoryViewer } from "./StoryViewer";
import { CaseBackdrop, CaseLogo } from "./CaseArt";

export function Cases({ data, items, locale }: { data: CasesT; items: CaseStudy[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="cases" className="relative py-28 md:py-36">
      <Reveal className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} locale={locale} />
          {/* story rings, like social stories */}
          <div className="reveal flex max-w-full gap-4 overflow-x-auto pb-1" style={{ ["--d" as string]: 3 }}>
            {items.map((c, i) => (
              <button key={c.id} onClick={() => setOpen(i)} className="group flex flex-col items-center gap-2" aria-label={c.client}>
                <span className="story-ring block">
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border-[3px] border-ink bg-ink-2 md:h-[4.5rem] md:w-[4.5rem]">
                    <CaseLogo c={c} className="h-[62%] w-[62%]" />
                  </span>
                </span>
                <span className="max-w-20 truncate font-latin text-[11px] text-lilac/70 group-hover:text-white">{c.client}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((c, i) => {
            const hero = c.metrics[0];
            return (
              <button
                key={c.id}
                onClick={() => setOpen(i)}
                className={`reveal group relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] text-start c-${c.color} ${i === 0 && items.length % 2 === 1 ? "md:col-span-2" : ""}`}
                style={{ ["--d" as string]: 4 + i }}
              >
                <div className={`relative ${i === 0 && items.length % 2 === 1 ? "aspect-[21/9]" : "aspect-[16/11]"} overflow-hidden`}>
                  {c.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.cover} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105" loading="lazy" />
                  ) : (
                    <CaseBackdrop c={c} className="transition duration-[1.2s] ease-out group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <span className="flex items-center gap-2 rounded-full bg-ink/60 px-3 py-1.5 backdrop-blur">
                      <CaseLogo c={c} className="h-5 w-auto max-w-28" />
                    </span>
                    <span className="pill">{t(c.industry, locale)}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <div>
                      <h3 className="text-2xl font-bold leading-snug md:text-3xl">{t(c.headline, locale)}</h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--c)]">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--c)] text-ink transition group-hover:scale-110">
                          <Icon name="play" className="h-3.5 w-3.5" strokeWidth={0} />
                        </span>
                        {locale === "ar" ? "شاهد القصة" : "Watch the story"}
                      </span>
                    </div>
                    {hero && (
                      <div className="shrink-0 text-end">
                        <div className="font-latin text-4xl font-extrabold text-[color:var(--c)] md:text-5xl" dir="ltr">{uplift(hero)}</div>
                        <div className="text-xs text-lilac/70">{t(hero.label, locale)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>
      {open !== null && <StoryViewer cases={items} start={open} locale={locale} onClose={() => setOpen(null)} />}
    </section>
  );
}
