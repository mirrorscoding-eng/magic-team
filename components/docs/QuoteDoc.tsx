"use client";
import { Logo, Mark } from "@/components/brand/Logo";
import { T, fmtDate, lines, money, totals, type Company, type Quote } from "@/lib/docs";
import { BRAND, LATIN, Ltr, contactBits, partyLines, partyTitle, rootFont } from "./common";
import { PAGE_W, Paged, type Block, type FrameProps } from "./Paged";

const PAD = 56;
const AREA = { width: PAGE_W - PAD * 2, height: 967 };
const COLS = "34px 1fr 56px 112px 124px";

/** Quote: the pitch document. Dark Magic ink, glowing orchid light, glass cards and a yellow total. */
export function QuoteDoc({ doc, company }: { doc: Quote; company: Company }) {
  const t = T[doc.lang];
  const m = (n: number) => money(n, doc.currency, doc.lang);
  const tot = totals(doc);
  const items = doc.items.filter((i) => i.title || i.price);
  const terms = lines(doc.terms);
  const glass = { background: "rgba(250,195,253,0.05)", border: "1px solid rgba(250,195,253,0.14)" };

  const blocks: Block[] = [
    {
      key: "head",
      node: (
        <div style={{ paddingBottom: 26 }}>
          <div className="flex items-center justify-between">
            <span style={{ color: BRAND.lilac }}><Logo className="h-9 w-auto" /></span>
            <span className="rounded-full px-4 py-1.5 text-[13px] font-bold" style={{ background: BRAND.yellow, color: BRAND.ink }}>
              {t.quote} {doc.lang === "ar" && <span style={LATIN} className="ms-1 opacity-60">· QUOTATION</span>}
            </span>
          </div>
          <h1 className="mt-12 text-[40px] font-bold leading-[1.2]" style={{ color: "#fff" }}>
            {doc.title || t.quote}
          </h1>
          <div className="mt-6 flex gap-3">
            {[
              [t.number, doc.number],
              [t.date, fmtDate(doc.date, doc.lang)],
              [t.validUntil, fmtDate(doc.validUntil, doc.lang)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl px-4 py-2.5" style={glass}>
                <div className="text-[11px]" style={{ color: "rgba(250,195,253,0.55)" }}>{k}</div>
                <div className="text-[14px] font-bold" style={LATIN}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-3xl p-5" style={{ background: "linear-gradient(150deg, rgba(235,112,250,0.22), rgba(235,112,250,0.04))", border: "1px solid rgba(235,112,250,0.35)" }}>
              <div className="text-[11px] font-semibold" style={{ color: BRAND.orchid }}>{t.preparedFor}</div>
              <div className="mt-1 text-[19px] font-bold">{partyTitle(doc.client) || "—"}</div>
              {partyLines(doc.client).map((l) => (
                <div key={l} className="text-[12.5px]" style={{ color: "rgba(250,195,253,0.75)" }}><Ltr>{l}</Ltr></div>
              ))}
            </div>
            <div className="rounded-3xl p-5" style={glass}>
              <div className="text-[11px] font-semibold" style={{ color: BRAND.cyan }}>{t.from}</div>
              <div className="mt-1 text-[19px] font-bold" style={LATIN}>{company.name}</div>
              {[company.phone, company.email, company.address[doc.lang]].filter(Boolean).map((l) => (
                <div key={l} className="text-[12.5px]" style={{ color: "rgba(250,195,253,0.75)" }}><Ltr>{l}</Ltr></div>
              ))}
            </div>
          </div>
          {doc.intro && <p className="mt-6 whitespace-pre-line text-[14px] leading-[1.9]" style={{ color: "rgba(255,255,255,0.85)" }}>{doc.intro}</p>}
        </div>
      ),
    },
    ...(items.length ? [{ key: "items-head", keep: true, node: <ItemsHead t={t} /> }] : []),
    ...items.map((it, i) => ({
      key: `item-${i}`,
      group: "items",
      node: (
        <div style={{ paddingBottom: 8 }}>
          <div className="grid items-center gap-3 rounded-[18px] px-4 py-3.5" style={{ gridTemplateColumns: COLS, ...glass }}>
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full text-[12px] font-bold" style={{ ...LATIN, background: BRAND.orchid, color: BRAND.ink }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="text-[15px] font-bold leading-snug">{it.title}</div>
              {it.description && <div className="mt-0.5 whitespace-pre-line text-[12px] leading-[1.7]" style={{ color: "rgba(250,195,253,0.65)" }}>{it.description}</div>}
            </div>
            <div className="text-center text-[13px]" style={LATIN}>{it.qty}</div>
            <div className="text-[13px]" style={{ ...LATIN, color: "rgba(250,195,253,0.8)" }}>{m(it.price)}</div>
            <div className="text-end text-[14px] font-bold" style={LATIN}>{m(it.qty * it.price)}</div>
          </div>
        </div>
      ),
    })),
    {
      key: "totals",
      node: (
        <div className="flex justify-end" style={{ paddingTop: 10, paddingBottom: 26 }}>
          <div className="w-[310px] space-y-2">
            {tot.discount > 0 || tot.tax > 0 ? (
              <div className="space-y-1.5 rounded-2xl px-5 py-3.5 text-[13px]" style={glass}>
                <Row k={t.subtotal} v={m(tot.subtotal)} />
                {tot.discount > 0 && <Row k={`${t.discount}${doc.discountType === "percent" ? ` (${doc.discount}%)` : ""}`} v={`- ${m(tot.discount)}`} />}
                {tot.tax > 0 && <Row k={`${t.tax} (${doc.tax}%)`} v={m(tot.tax)} />}
              </div>
            ) : null}
            <div className="flex items-center justify-between rounded-2xl px-5 py-4" style={{ background: BRAND.yellow, color: BRAND.ink }}>
              <span className="text-[14px] font-bold">{t.total}</span>
              <span className="text-[24px] font-extrabold" style={LATIN}>{m(tot.total)}</span>
            </div>
          </div>
        </div>
      ),
    },
    ...(doc.notes
      ? [{ key: "notes", node: <Section title={t.notes} color={BRAND.cyan}><p className="whitespace-pre-line text-[13px] leading-[1.9]" style={{ color: "rgba(255,255,255,0.8)" }}>{doc.notes}</p></Section> }]
      : []),
    ...(terms.length
      ? [
          {
            key: "terms",
            node: (
              <Section title={t.terms} color={BRAND.green}>
                <ul className="space-y-1.5">
                  {terms.map((l, i) => (
                    <li key={i} className="flex gap-2.5 text-[12.5px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.8)" }}>
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BRAND.orchid }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </Section>
            ),
          },
        ]
      : []),
    {
      key: "sign",
      node: (
        <div className="grid grid-cols-[1fr_200px] gap-4" style={{ paddingTop: 6 }}>
          <div className="rounded-3xl p-5" style={glass}>
            <div className="text-[12px] font-bold" style={{ color: BRAND.lilac }}>{t.acceptance}</div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-[11px]" style={{ color: "rgba(250,195,253,0.55)" }}>
              {[t.name, t.signature, t.date].map((k) => (
                <div key={k} className="border-t pt-1.5" style={{ borderColor: "rgba(250,195,253,0.3)" }}>{k}</div>
              ))}
            </div>
          </div>
          <div className="relative grid place-items-center overflow-hidden rounded-3xl" style={{ background: "radial-gradient(circle at 30% 20%, #8e2de2, #3a0a42 70%)" }}>
            <span style={{ color: BRAND.lilac }}><Mark className="h-14 w-auto" /></span>
          </div>
        </div>
      ),
    },
  ];

  const Frame = ({ children, page, pages }: FrameProps) => (
    <div className="absolute inset-0" style={{ background: BRAND.ink, color: "#fff" }}>
      <div className="absolute inset-0" style={{ background: page === 1 ? "radial-gradient(520px 340px at 85% -4%, rgba(235,112,250,0.45), transparent 70%), radial-gradient(420px 300px at 0% 18%, rgba(70,40,220,0.35), transparent 70%)" : "radial-gradient(420px 260px at 90% 0%, rgba(235,112,250,0.25), transparent 70%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[220px]" style={{ background: "radial-gradient(500px 200px at 10% 110%, rgba(142,45,226,0.35), transparent 70%)" }} />
      <div className="absolute" style={{ top: PAD, left: PAD, width: AREA.width, height: AREA.height }}>{children}</div>
      <Footer company={company} lang={doc.lang} page={page} pages={pages} number={doc.number} />
    </div>
  );

  return <Paged blocks={blocks} heads={{ items: <ItemsHead t={t} /> }} area={AREA} Frame={Frame} dir={doc.lang === "ar" ? "rtl" : "ltr"} rootStyle={rootFont(doc.lang)} version={JSON.stringify(doc) + JSON.stringify(company)} />;
}

function ItemsHead({ t }: { t: (typeof T)["ar" | "en"] }) {
  return (
    <div className="grid gap-3 px-4 pb-2.5 text-[11px] font-semibold" style={{ gridTemplateColumns: COLS, color: "rgba(250,195,253,0.5)" }}>
      <span>#</span>
      <span>{t.item}</span>
      <span className="text-center">{t.qty}</span>
      <span>{t.price}</span>
      <span className="text-end">{t.amount}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between" style={{ color: "rgba(250,195,253,0.8)" }}>
      <span>{k}</span>
      <span style={LATIN} className="font-semibold text-white">{v}</span>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 22 }}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <h3 className="text-[15px] font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Footer({ company, lang, page, pages, number }: { company: Company; lang: "ar" | "en"; page: number; pages: number; number: string }) {
  return (
    <div className="absolute flex items-center justify-between border-t pt-3 text-[10.5px]" style={{ left: PAD, right: PAD, bottom: 34, borderColor: "rgba(250,195,253,0.14)", color: "rgba(250,195,253,0.55)" }}>
      <div className="flex gap-3">
        {contactBits(company, lang).slice(0, 4).map((b) => (
          <Ltr key={b}>{b}</Ltr>
        ))}
      </div>
      <Ltr>
        {number} · {page}/{pages}
      </Ltr>
    </div>
  );
}
