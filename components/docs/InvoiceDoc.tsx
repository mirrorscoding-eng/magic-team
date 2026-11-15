"use client";
import { Logo, Mark } from "@/components/brand/Logo";
import { T, fmtDate, invoiceStatus, lines, money, totals, type Company, type Invoice } from "@/lib/docs";
import { BRAND, DISPLAY, LATIN, Ltr, contactBits, partyLines, partyTitle, rootFont } from "./common";
import { PAGE_W, Paged, type Block, type FrameProps } from "./Paged";

const PAD = 52;
const AREA = { width: PAGE_W - PAD * 2, height: 960 };
const COLS = "30px 1fr 54px 116px 126px";
const MUTED = "#7a5a80";
const LINE = "#efdff1";
const STAMP = { paid: BRAND.green, partial: BRAND.yellow, unpaid: BRAND.orchid };

/** Invoice: the formal one. White paper, Magic ink table, a status stamp and a dark balance-due box. */
export function InvoiceDoc({ doc, company }: { doc: Invoice; company: Company }) {
  const t = T[doc.lang];
  const m = (n: number) => money(n, doc.currency, doc.lang);
  const tot = totals(doc);
  const paid = Math.min(Number(doc.paid) || 0, tot.total);
  const status = invoiceStatus(doc);
  const items = doc.items.filter((i) => i.title || i.price);
  const payment = lines(doc.payment);

  const blocks: Block[] = [
    {
      key: "head",
      node: (
        <div style={{ paddingBottom: 24 }}>
          <div className="flex items-start justify-between gap-6">
            <div>
              <span style={{ color: BRAND.ink }}><Logo className="h-10 w-auto" /></span>
              <div className="mt-3 space-y-0.5 text-[11.5px]" style={{ color: MUTED }}>
                {[company.address[doc.lang], company.phone, company.email].filter(Boolean).map((l) => (
                  <div key={l}><Ltr>{l}</Ltr></div>
                ))}
              </div>
            </div>
            <div className="text-end">
              {doc.lang === "ar" && <span className="rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: BRAND.orchid, color: BRAND.ink }}>{t.invoice}</span>}
              <div className="mt-1 whitespace-nowrap text-[64px] leading-[1]" style={{ ...DISPLAY, color: BRAND.ink }}>INVOICE</div>
              <span className="mt-3 inline-block rounded-lg px-3 py-1 text-[12px] font-extrabold uppercase tracking-wider" style={{ background: STAMP[status], color: BRAND.ink, transform: "rotate(-4deg)", border: `2px solid ${BRAND.ink}` }}>
                {t.status[status]}
              </span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-2.5">
            {[
              [t.number, doc.number],
              [t.date, fmtDate(doc.date, doc.lang)],
              [t.dueDate, fmtDate(doc.dueDate, doc.lang)],
              [t.ref, doc.quote || "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl px-4 py-3" style={{ background: "#fbf1fc" }}>
                <div className="text-[10.5px]" style={{ color: MUTED }}>{k}</div>
                <div className="mt-0.5 text-[13.5px] font-bold" style={{ ...LATIN, color: BRAND.ink }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border px-5 py-4" style={{ borderColor: LINE, borderInlineStartWidth: 5, borderInlineStartColor: BRAND.orchid }}>
            <div className="text-[11px] font-bold" style={{ color: "#b23fc4" }}>{t.billTo}</div>
            <div className="mt-0.5 text-[18px] font-bold">{partyTitle(doc.client) || "—"}</div>
            <div className="mt-0.5 flex flex-wrap gap-x-4 text-[12px]" style={{ color: MUTED }}>
              {partyLines(doc.client).map((l) => (
                <Ltr key={l} style={{ whiteSpace: "nowrap" }}>{l}</Ltr>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    ...(items.length ? [{ key: "items-head", keep: true, node: <ItemsHead t={t} /> }] : []),
    ...items.map((it, i) => ({
      key: `item-${i}`,
      group: "items",
      node: (
        <div className="grid items-start gap-3 border-b px-4 py-3" style={{ gridTemplateColumns: COLS, borderColor: LINE, background: i % 2 ? "#fdf8fd" : "#fff" }}>
          <span className="text-[12px] font-bold" style={{ ...LATIN, color: "#b9a0bd" }}>{i + 1}</span>
          <div className="min-w-0">
            <div className="text-[14px] font-bold leading-snug">{it.title}</div>
            {it.description && <div className="mt-0.5 whitespace-pre-line text-[11.5px] leading-[1.7]" style={{ color: MUTED }}>{it.description}</div>}
          </div>
          <div className="text-center text-[13px]" style={LATIN}>{it.qty}</div>
          <div className="text-[13px]" style={{ ...LATIN, color: MUTED }}>{m(it.price)}</div>
          <div className="text-end text-[13.5px] font-bold" style={LATIN}>{m(it.qty * it.price)}</div>
        </div>
      ),
    })),
    {
      key: "totals",
      node: (
        <div className="flex justify-end" style={{ paddingTop: 18, paddingBottom: 24 }}>
          <div className="w-[320px]">
            <div className="space-y-2 px-4 pb-3 text-[13px]">
              <Row k={t.subtotal} v={m(tot.subtotal)} />
              {tot.discount > 0 && <Row k={`${t.discount}${doc.discountType === "percent" ? ` (${doc.discount}%)` : ""}`} v={`- ${m(tot.discount)}`} />}
              {tot.tax > 0 && <Row k={`${t.tax} (${doc.tax}%)`} v={m(tot.tax)} />}
              <div className="border-t pt-2" style={{ borderColor: LINE }}><Row k={t.total} v={m(tot.total)} bold /></div>
              {paid > 0 && <Row k={t.paid} v={`- ${m(paid)}`} />}
            </div>
            <div className="flex items-center justify-between rounded-2xl px-5 py-4" style={{ background: BRAND.ink }}>
              <span className="text-[13px] font-bold" style={{ color: BRAND.lilac }}>{t.balance}</span>
              <span className="text-[25px] font-extrabold" style={{ ...LATIN, color: BRAND.yellow }}>{m(tot.total - paid)}</span>
            </div>
          </div>
        </div>
      ),
    },
    ...(payment.length || doc.notes
      ? [
          {
            key: "pay",
            node: (
              <div className="grid grid-cols-2 gap-3" style={{ paddingBottom: 24 }}>
                {payment.length > 0 && (
                  <div className="rounded-2xl px-5 py-4" style={{ background: "#e8f7fd", gridColumn: doc.notes ? undefined : "span 2" }}>
                    <div className="mb-1.5 text-[12px] font-bold">{t.payment}</div>
                    <ul className="space-y-1 text-[12px] leading-[1.7]" style={{ color: "#3b4a55" }}>
                      {payment.map((l, i) => (
                        <li key={i} className="flex gap-2"><span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BRAND.ink }} />{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {doc.notes && (
                  <div className="rounded-2xl px-5 py-4" style={{ background: "#fbfde6", gridColumn: payment.length ? undefined : "span 2" }}>
                    <div className="mb-1.5 text-[12px] font-bold">{t.notes}</div>
                    <p className="whitespace-pre-line text-[12px] leading-[1.7]" style={{ color: "#4d4a33" }}>{doc.notes}</p>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "thanks",
      node: (
        <div className="flex items-center justify-center gap-3 pt-2 text-[15px] font-bold" style={{ color: "#b23fc4" }}>
          <span style={{ color: BRAND.orchid }}><Mark className="h-6 w-auto" /></span>
          {t.thanks}
        </div>
      ),
    },
  ];

  const Frame = ({ children, page, pages }: FrameProps) => (
    <div className="absolute inset-0" style={{ background: "#fff", color: BRAND.ink }}>
      <div className="absolute inset-x-0 top-0 h-[9px]" style={{ background: `linear-gradient(90deg, ${BRAND.orchid}, ${BRAND.lilac} 50%, ${BRAND.cyan})` }} />
      <div className="absolute" style={{ top: PAD, left: PAD, width: AREA.width, height: AREA.height }}>{children}</div>
      <div className="absolute inset-x-0 bottom-0 flex h-[62px] items-center justify-between text-[10.5px]" style={{ background: BRAND.ink, color: BRAND.lilac, paddingInline: PAD }}>
        <div className="flex gap-4 opacity-80">
          {contactBits(company, doc.lang).slice(0, 4).map((b) => (
            <Ltr key={b}>{b}</Ltr>
          ))}
        </div>
        <Ltr style={{ color: BRAND.orchid, fontWeight: 700 }}>
          {doc.number} · {page}/{pages}
        </Ltr>
      </div>
    </div>
  );

  return <Paged blocks={blocks} heads={{ items: <ItemsHead t={t} /> }} area={AREA} Frame={Frame} dir={doc.lang === "ar" ? "rtl" : "ltr"} rootStyle={rootFont(doc.lang)} version={JSON.stringify(doc) + JSON.stringify(company)} />;
}

function ItemsHead({ t }: { t: (typeof T)["ar" | "en"] }) {
  return (
    <div className="grid gap-3 rounded-xl px-4 py-2.5 text-[11.5px] font-bold" style={{ gridTemplateColumns: COLS, background: BRAND.ink, color: BRAND.lilac }}>
      <span>#</span>
      <span>{t.item}</span>
      <span className="text-center">{t.qty}</span>
      <span>{t.price}</span>
      <span className="text-end">{t.amount}</span>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""}`} style={{ color: bold ? BRAND.ink : MUTED }}>
      <span>{k}</span>
      <span style={{ ...LATIN, color: BRAND.ink }} className="font-semibold">{v}</span>
    </div>
  );
}
