"use client";
import { Icon } from "@/components/brand/Icon";
import type { Locale, Services as ST } from "@/lib/types";
import { t } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { Reveal } from "./shown";

export function Services({ data, locale }: { data: ST; locale: Locale }) {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <Reveal className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} locale={locale} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((s, i) => {
            const tags = t(s.tags, locale)
              .split(/[،,]/)
              .map((x) => x.trim())
              .filter(Boolean);
            return (
              <article
                key={i}
                className={`reveal group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-ink-2 ring-1 ring-white/10 transition duration-500 hover:-translate-y-2 hover:ring-[color:var(--c)]/60 hover:shadow-[0_30px_60px_-30px_var(--c)] c-${s.color}`}
                style={{ ["--d" as string]: 3 + i * 0.6 }}
              >
                {/* image */}
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--c)" }}>
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image}
                      alt={t(s.title, locale)}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <Icon name={s.icon} className="absolute inset-0 m-auto h-24 w-24 text-ink opacity-30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
                  <span className="absolute start-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-md ring-1 ring-white/15" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* body */}
                <div className="relative flex flex-1 flex-col px-6 pb-6 pt-4">
                  <span
                    className="absolute end-5 top-0 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-2xl text-ink shadow-lg ring-4 ring-ink-2 transition duration-500 group-hover:rotate-[-10deg] group-hover:scale-110"
                    style={{ background: "var(--c)" }}
                    aria-hidden
                  >
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="pe-16 text-[1.45rem] font-bold leading-tight text-white">{t(s.title, locale)}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{t(s.body, locale)}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[color:var(--c)] ring-1 ring-[color:var(--c)]/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* accent bar */}
                <span className="absolute inset-x-0 bottom-0 h-1 origin-[inline-start] scale-x-0 transition duration-500 group-hover:scale-x-100" style={{ background: "var(--c)" }} />
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
