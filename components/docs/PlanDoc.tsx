"use client";
import type { ReactNode } from "react";
import { Logo, Mark } from "@/components/brand/Logo";
import { T, fmtDate, lines, money, type Company, type Plan } from "@/lib/docs";
import { BRAND, DISPLAY, LATIN, Ltr, SOFT, contactBits, partyTitle, rootFont } from "./common";
import { PAGE_H, PAGE_W, Paged, type Block, type FrameProps } from "./Paged";

const PAD = 56;
const TOP = 108;
const AREA = { width: PAGE_W - PAD * 2, height: PAGE_H - TOP - 92 };
const PAPER = "#fff7ff";
const MUTED = "#6f5375";
const BAR = [BRAND.orchid, BRAND.cyan, BRAND.yellow, BRAND.green, BRAND.lilac, "#8e2de2", "#5b6cff"];

const chunk = <X,>(a: X[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

/** Marketing plan: an editorial deck. Dark cover, light lilac pages with big numbered chapters, dark back cover. */
export function PlanDoc({ doc, company }: { doc: Plan; company: Company }) {
  const t = T[doc.lang];
  const m = (n: number) => money(n, doc.currency, doc.lang);
  const kindLabel = doc.kind === "strategy" ? t.strategy : t.plan;
  const client = partyTitle(doc.client);

  const goals = doc.goals.filter((g) => g.title || g.target);
  const swot = { s: lines(doc.swot.s), w: lines(doc.swot.w), o: lines(doc.swot.o), t: lines(doc.swot.t) };
  const hasSwot = Object.values(swot).some((l) => l.length);
  const audience = doc.audience.filter((a) => a.name || a.body);
  const pillars = doc.pillars.filter((p) => p.title || p.body);
  const channels = doc.channels.filter((c) => c.name || c.budget);
  const budget = channels.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  const phases = doc.phases.filter((p) => p.name || p.tasks);
  const kpis = doc.kpis.filter((k) => k.label || k.target);
  const steps = lines(doc.nextSteps);

  let n = 0;
  const blocks: Block[] = [];
  const section = (key: string, title: string, accent: string, body: Block[]) => {
    n += 1;
    blocks.push({ key: `h-${key}`, keep: true, node: <Heading n={n} title={title} accent={accent} /> }, ...body);
    blocks[blocks.length - 1] = { ...blocks[blocks.length - 1], node: <div style={{ paddingBottom: 18 }}>{blocks[blocks.length - 1].node}</div> };
  };

  if (doc.summary.trim())
    section("summary", t.summary, BRAND.orchid, [
      { key: "summary", node: <p className="whitespace-pre-line rounded-3xl bg-white px-7 py-6 text-[14.5px] leading-[2]" style={{ boxShadow: "0 10px 30px -18px rgba(32,0,36,.35)" }}>{doc.summary}</p> },
    ]);

  if (goals.length)
    section(
      "goals",
      t.goals,
      BRAND.cyan,
      chunk(goals, 2).map((row, r) => ({
        key: `goals-${r}`,
        node: (
          <div className="grid grid-cols-2 gap-3" style={{ paddingBottom: 12 }}>
            {row.map((g, i) => (
              <div key={i} className="flex min-h-[112px] flex-col justify-between rounded-3xl px-6 py-5" style={{ background: SOFT[(r * 2 + i) % 4] }}>
                <div className="text-[15px] font-bold leading-snug">{g.title}</div>
                {g.target && <div className="mt-2 text-[34px] leading-none" style={DISPLAY}>{g.target}</div>}
              </div>
            ))}
          </div>
        ),
      })),
    );

  if (hasSwot) {
    const q = [
      ["S", t.swotS, swot.s, BRAND.green],
      ["W", t.swotW, swot.w, BRAND.lilac],
      ["O", t.swotO, swot.o, BRAND.cyan],
      ["T", t.swotT, swot.t, BRAND.yellow],
    ] as const;
    section(
      "swot",
      t.swot,
      BRAND.green,
      chunk([...q], 2).map((row, r) => ({
        key: `swot-${r}`,
        node: (
          <div className="grid grid-cols-2 gap-3" style={{ paddingBottom: 12 }}>
            {row.map(([letter, label, list, color]) => (
              <div key={letter} className="relative min-h-[150px] overflow-hidden rounded-3xl px-6 py-5" style={{ background: color }}>
                <span className="absolute -bottom-6 text-[130px] leading-none opacity-[0.12]" style={{ ...DISPLAY, insetInlineEnd: 14 }}>{letter}</span>
                <div className="relative text-[15px] font-bold">{label}</div>
                <ul className="relative mt-2 space-y-1 text-[12.5px] leading-[1.7]">
                  {list.map((l, i) => (
                    <li key={i} className="flex gap-2"><span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BRAND.ink }} />{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ),
      })),
    );
  }

  if (audience.length)
    section(
      "audience",
      t.audience,
      BRAND.yellow,
      chunk(audience, 2).map((row, r) => ({
        key: `aud-${r}`,
        node: (
          <div className="grid grid-cols-2 gap-3" style={{ paddingBottom: 12 }}>
            {row.map((a, i) => (
              <div key={i} className="flex gap-4 rounded-3xl bg-white px-5 py-5" style={{ boxShadow: "0 10px 30px -18px rgba(32,0,36,.35)" }}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[20px] font-bold" style={{ ...LATIN, background: BRAND.ink, color: SOFT[(r * 2 + i) % 4] }}>{String(r * 2 + i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-bold">{a.name}</div>
                  <p className="mt-1 whitespace-pre-line text-[12.5px] leading-[1.8]" style={{ color: MUTED }}>{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      })),
    );

  if (doc.bigIdea.trim())
    section("idea", t.bigIdea, BRAND.orchid, [
      {
        key: "idea",
        node: (
          <div className="relative overflow-hidden rounded-[32px] px-10 py-10" style={{ background: `radial-gradient(400px 220px at 90% 0%, rgba(235,112,250,.55), transparent 70%), ${BRAND.ink}` }}>
            <span className="absolute -top-6 text-[150px] leading-none" style={{ ...DISPLAY, color: BRAND.orchid, insetInlineEnd: 28, opacity: 0.35 }}>”</span>
            <p className="relative whitespace-pre-line text-[26px] font-bold leading-[1.6]" style={{ color: "#fff" }}>{doc.bigIdea}</p>
          </div>
        ),
      },
    ]);

  if (pillars.length)
    section(
      "pillars",
      t.pillars,
      BRAND.cyan,
      chunk(pillars, 3).map((row, r) => ({
        key: `pil-${r}`,
        node: (
          <div className="grid grid-cols-3 gap-3" style={{ paddingBottom: 12 }}>
            {row.map((p, i) => (
              <div key={i} className="rounded-3xl border bg-white px-5 py-5" style={{ borderColor: "#f1dcf4" }}>
                <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ ...LATIN, background: SOFT[(r * 3 + i) % 4] }}>{String(r * 3 + i + 1).padStart(2, "0")}</span>
                <div className="mt-3 text-[15px] font-bold leading-snug">{p.title}</div>
                <p className="mt-1 whitespace-pre-line text-[12px] leading-[1.8]" style={{ color: MUTED }}>{p.body}</p>
              </div>
            ))}
          </div>
        ),
      })),
    );

  if (channels.length) {
    const head = <ChannelHead t={t} />;
    section("channels", t.channels, BRAND.yellow, [
      { key: "ch-head", keep: true, node: head },
      ...channels.map((c, i) => ({
        key: `ch-${i}`,
        group: "channels",
        node: (
          <div className="grid items-center gap-3 border-b px-4 py-3 text-[13px]" style={{ gridTemplateColumns: CH_COLS, borderColor: "#f1dcf4" }}>
            <span className="flex items-center gap-2.5 font-bold"><span className="h-3 w-3 shrink-0 rounded-full" style={{ background: BAR[i % BAR.length] }} />{c.name}</span>
            <span style={{ color: MUTED }}>{c.role}</span>
            <span style={{ color: MUTED }}>{c.kpi}</span>
            <span className="text-end font-bold" style={LATIN}>{c.budget ? m(c.budget) : "—"}</span>
          </div>
        ),
      })),
      ...(budget > 0
        ? [
            {
              key: "ch-bar",
              node: (
                <div className="mt-4 rounded-3xl px-6 py-5" style={{ background: BRAND.ink, color: "#fff" }}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-bold" style={{ color: BRAND.lilac }}>{t.totalBudget}</span>
                    <span className="text-[26px] font-extrabold" style={{ ...LATIN, color: BRAND.yellow }}>{m(budget)}</span>
                  </div>
                  <div className="mt-4 flex h-4 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.1)" }}>
                    {channels.map((c, i) => (c.budget ? <span key={i} style={{ width: `${(c.budget / budget) * 100}%`, background: BAR[i % BAR.length] }} /> : null))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px]" style={{ color: "rgba(250,195,253,.8)" }}>
                    {channels.map((c, i) =>
                      c.budget ? (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ background: BAR[i % BAR.length] }} />
                          {c.name} <Ltr style={{ fontWeight: 700, color: "#fff" }}>{Math.round((c.budget / budget) * 100)}%</Ltr>
                        </span>
                      ) : null,
                    )}
                  </div>
                </div>
              ),
            },
          ]
        : []),
    ]);
  }

  if (phases.length)
    section(
      "phases",
      t.phases,
      BRAND.green,
      phases.map((p, i) => ({
        key: `ph-${i}`,
        node: (
          <div className="relative grid grid-cols-[56px_1fr] gap-4">
            <div className="relative flex justify-center">
              {i < phases.length - 1 && <span className="absolute top-12 bottom-0 w-[2px]" style={{ background: "#ecc8f1" }} />}
              <span className="relative grid h-12 w-12 place-items-center rounded-full text-[17px]" style={{ ...DISPLAY, background: SOFT[i % 4], border: `3px solid ${PAPER}` }}>{i + 1}</span>
            </div>
            <div style={{ paddingBottom: 18 }}>
              <div className="flex flex-wrap items-center gap-2.5 pt-2.5">
                <span className="text-[17px] font-bold">{p.name}</span>
                {p.period && <span className="rounded-full px-3 py-0.5 text-[11px] font-bold" style={{ background: BRAND.ink, color: BRAND.lilac }}>{p.period}</span>}
              </div>
              {lines(p.tasks).length > 0 && (
                <ul className="mt-2 space-y-1 text-[12.5px] leading-[1.7]" style={{ color: MUTED }}>
                  {lines(p.tasks).map((l, j) => (
                    <li key={j} className="flex gap-2"><span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BRAND.orchid }} />{l}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ),
      })),
    );

  if (kpis.length)
    section(
      "kpis",
      t.kpis,
      BRAND.orchid,
      chunk(kpis, 3).map((row, r) => ({
        key: `kpi-${r}`,
        node: (
          <div className="grid grid-cols-3 gap-3" style={{ paddingBottom: 12 }}>
            {row.map((k, i) => (
              <div key={i} className="rounded-3xl px-5 py-5 text-center" style={{ background: BRAND.ink, color: "#fff" }}>
                <div className="text-[38px] leading-none" style={{ ...DISPLAY, color: SOFT[(r * 3 + i) % 4] }}>{k.target || "—"}</div>
                <div className="mt-2 text-[12.5px]" style={{ color: BRAND.lilac }}>{k.label}</div>
              </div>
            ))}
          </div>
        ),
      })),
    );

  if (steps.length)
    section("next", t.nextSteps, BRAND.cyan, [
      {
        key: "next",
        node: (
          <ul className="space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-[13.5px] font-semibold" style={{ boxShadow: "0 8px 24px -18px rgba(32,0,36,.35)" }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{ ...LATIN, background: BRAND.green }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        ),
      },
    ]);

  const Frame = ({ children, page, pages }: FrameProps) => (
    <div className="absolute inset-0" style={{ background: PAPER, color: BRAND.ink }}>
      <div className="absolute -top-40 h-80 w-80 rounded-full" style={{ insetInlineEnd: -120, background: "radial-gradient(circle, rgba(235,112,250,.18), transparent 70%)" }} />
      <div className="absolute flex items-center justify-between border-b pb-4" style={{ top: 40, left: PAD, right: PAD, borderColor: "#f1dcf4" }}>
        <span style={{ color: BRAND.ink }}><Logo className="h-7 w-auto" /></span>
        <span className="text-[11.5px] font-semibold" style={{ color: MUTED }}>{[client, kindLabel].filter(Boolean).join(" · ")}</span>
      </div>
      <div className="absolute" style={{ top: TOP, left: PAD, width: AREA.width, height: AREA.height }}>{children}</div>
      <div className="absolute flex items-center justify-between text-[10.5px]" style={{ left: PAD, right: PAD, bottom: 34, color: MUTED }}>
        <div className="flex gap-3">
          {contactBits(company, doc.lang).slice(0, 3).map((b) => (
            <Ltr key={b}>{b}</Ltr>
          ))}
        </div>
        <span className="grid h-8 min-w-8 place-items-center rounded-full px-2 text-[11px] font-bold" style={{ ...LATIN, background: BRAND.ink, color: BRAND.orchid }}>{page}/{pages}</span>
      </div>
    </div>
  );

  const Cover = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: BRAND.ink, color: "#fff" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(620px 460px at 100% 0%, rgba(235,112,250,.6), transparent 65%), radial-gradient(520px 420px at 0% 45%, rgba(91,60,255,.45), transparent 65%), radial-gradient(600px 300px at 60% 110%, rgba(250,195,253,.35), transparent 70%)" }} />
      <span className="absolute" style={{ color: "rgba(250,195,253,.07)", bottom: -60, insetInlineEnd: -80 }}><Mark className="h-[520px] w-auto" /></span>
      <div className="absolute inset-0 flex flex-col" style={{ padding: 64 }}>
        <div className="flex items-center justify-between">
          <span style={{ color: BRAND.lilac }}><Logo className="h-10 w-auto" /></span>
          <span className="text-[12px] font-bold" style={{ ...LATIN, color: BRAND.lilac }}>{doc.number}</span>
        </div>
        <div className="mt-auto">
          {doc.clientLogo && (
            <div className="mb-8 inline-grid h-24 min-w-24 place-items-center rounded-3xl bg-white px-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.clientLogo} alt="" className="max-h-16 max-w-44 object-contain" />
            </div>
          )}
          <div>
            <span className="rounded-full px-4 py-1.5 text-[14px] font-bold" style={{ background: BRAND.yellow, color: BRAND.ink }}>{kindLabel}</span>
          </div>
          <h1 className="mt-6 text-[64px] font-bold leading-[1.15]">{client || kindLabel}</h1>
          {doc.title && <p className="mt-4 max-w-[560px] text-[24px] leading-[1.5]" style={{ color: BRAND.lilac }}>{doc.title}</p>}
        </div>
        <div className="mt-16 grid grid-cols-3 gap-3">
          {[
            [t.period, doc.period || "—"],
            [t.date, fmtDate(doc.date, doc.lang)],
            [t.from, t.preparedBy],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl px-4 py-3" style={{ background: "rgba(250,195,253,.07)", border: "1px solid rgba(250,195,253,.16)" }}>
              <div className="text-[11px]" style={{ color: "rgba(250,195,253,.55)" }}>{k}</div>
              <div className="text-[14px] font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Back = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: BRAND.ink, color: "#fff" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(560px 420px at 50% 40%, rgba(235,112,250,.45), transparent 70%), radial-gradient(500px 300px at 0% 100%, rgba(91,60,255,.4), transparent 70%)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: 64 }}>
        <span style={{ color: BRAND.lilac }}><Mark className="h-20 w-auto" /></span>
        <h2 className="mt-8 text-[56px] font-bold leading-[1.2]" style={{ color: BRAND.lilac }}>{t.letsGo}</h2>
        <p className="mt-3 text-[16px]" style={{ color: "rgba(250,195,253,.7)" }}>{t.thanks}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {contactBits(company, doc.lang).map((b, i) => (
            <span key={b} className="rounded-full px-4 py-2 text-[13px] font-bold" style={{ background: SOFT[i % 4], color: BRAND.ink }}><Ltr style={{ whiteSpace: "nowrap" }}>{b}</Ltr></span>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-10 flex justify-center" style={{ color: "rgba(250,195,253,.5)" }}><Logo className="h-7 w-auto" /></div>
    </div>
  );

  return (
    <Paged
      blocks={blocks}
      heads={{ channels: <ChannelHead t={t} /> }}
      area={AREA}
      Frame={Frame}
      before={[Cover]}
      after={[Back]}
      dir={doc.lang === "ar" ? "rtl" : "ltr"}
      rootStyle={rootFont(doc.lang)}
      version={JSON.stringify(doc) + JSON.stringify(company)}
    />
  );
}

const CH_COLS = "1.1fr 1.2fr 1fr 130px";
function ChannelHead({ t }: { t: (typeof T)["ar" | "en"] }) {
  return (
    <div className="grid gap-3 rounded-xl px-4 py-2.5 text-[11.5px] font-bold" style={{ gridTemplateColumns: CH_COLS, background: BRAND.ink, color: BRAND.lilac }}>
      <span>{t.channel}</span>
      <span>{t.role}</span>
      <span>{t.kpi}</span>
      <span className="text-end">{t.budget}</span>
    </div>
  );
}

function Heading({ n, title, accent }: { n: number; title: string; accent: string }): ReactNode {
  return (
    <div className="flex items-end gap-4" style={{ paddingTop: n > 1 ? 14 : 0, paddingBottom: 16 }}>
      <span className="text-[58px] leading-[0.85]" style={{ ...DISPLAY, color: BRAND.orchid }}>{String(n).padStart(2, "0")}</span>
      <div className="flex-1 pb-1">
        <h2 className="text-[26px] font-bold leading-tight">{title}</h2>
        <span className="mt-2 block h-[5px] w-16 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}
