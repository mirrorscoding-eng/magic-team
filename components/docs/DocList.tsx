import Link from "next/link";
import { convertQuote, createDoc, duplicateDoc } from "@/app/admin/docs-actions";
import { Icon } from "@/components/brand/Icon";
import { requireAdmin } from "@/lib/auth";
import { DOC_NAME, DOC_ROUTE, docAmount, fmtDate, invoiceStatus, money, totals, type Doc, type DocType } from "@/lib/docs";
import { getDocs } from "@/lib/store";
import { tip } from "@/lib/tip";
import { DeleteDoc } from "./DeleteDoc";

const INTRO: Record<DocType, string> = {
  quote: "سوّي عرض سعر بتصميم ماجك، عدّل البنود والأسعار وشوف الملف مباشرة، وبعدين نزّله PDF وارسله للعميل.",
  invoice: "فواتير بتصميم رسمي مع ختم الحالة (مدفوعة / جزئياً / غير مدفوعة). تگدر تحوّل أي عرض سعر لفاتورة بضغطة.",
  plan: "خطط واستراتيجيات تسويقية بشكل مجلة: غلاف، أهداف، SWOT، جمهور، قنوات وميزانية، جدول زمني ومؤشرات.",
};

function badge(d: Doc) {
  if (d.type === "quote") {
    const s = { draft: ["مسودة", "c-lilac"], sent: ["مُرسل", "c-cyan"], accepted: ["مقبول", "c-green"], rejected: ["مرفوض", "c-orchid"] }[d.status];
    return s;
  }
  if (d.type === "invoice") return { paid: ["مدفوعة", "c-green"], partial: ["جزئياً", "c-yellow"], unpaid: ["غير مدفوعة", "c-orchid"] }[invoiceStatus(d)];
  return [d.kind === "strategy" ? "استراتيجية" : "خطة", "c-cyan"];
}

export async function DocList({ type }: { type: DocType }) {
  await requireAdmin();
  const docs = await getDocs(type);
  const name = DOC_NAME[type];
  const route = DOC_ROUTE[type];

  const sums =
    type === "invoice"
      ? (() => {
          const by = (cur: string) => docs.filter((d) => d.currency === cur && d.type === "invoice");
          return (["IQD", "USD"] as const)
            .map((cur) => {
              const list = by(cur) as Extract<Doc, { type: "invoice" }>[];
              const due = list.reduce((s, d) => s + Math.max(0, totals(d).total - (Number(d.paid) || 0)), 0);
              return list.length ? { cur, due } : null;
            })
            .filter(Boolean) as { cur: "IQD" | "USD"; due: number }[];
        })()
      : [];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm text-orchid">أدوات ماجك</p>
          <h1 className="mt-1 text-3xl font-bold">{name.many}</h1>
          <p className="mt-2 text-sm leading-7 text-lilac/60">{INTRO[type]}</p>
        </div>
        <form action={createDoc.bind(null, type)}>
          <button {...tip(name.new, "يفتح مستند جديد برقم جديد. الشروط وطريقة الدفع تنقل من آخر مستند من نفس النوع.", "bottom")} className="btn btn-primary py-2.5!">
            {name.new} <span className="arrow"><Icon name="spark" className="h-4 w-4" /></span>
          </button>
        </form>
      </header>

      {sums.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {sums.map((s) => (
            <div key={s.cur} className="c-yellow rounded-3xl px-5 py-4 text-ink" style={{ background: "var(--c)" }} {...tip("المبالغ غير المستلمة", "مجموع الباقي على كل الفواتير اللي ما انسدّت كاملة، بهذي العملة.")}>
              <div className="text-xs font-semibold">غير مستلم ({s.cur === "IQD" ? "دينار" : "دولار"})</div>
              <div className="font-latin text-2xl font-extrabold">{money(s.due, s.cur)}</div>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-8 space-y-3">
        {docs.map((d) => {
          const [label, color] = badge(d);
          const amount = docAmount(d);
          const client = d.client.company || d.client.name;
          return (
            <li key={d.id} className="card flex flex-wrap items-center gap-4 p-4 md:p-5">
              <Link href={`/admin/${route}/${d.id}`} {...tip("فتح", "يفتح المستند للتعديل والتحميل PDF.")} className="flex min-w-0 flex-1 items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-orchid">
                  <Icon name={type === "invoice" ? "receipt" : type === "quote" ? "tag" : "chart"} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-latin text-xs font-bold text-lilac/60">{d.number}</span>
                    <span className={`pill ${color} text-[10px]!`}>{label}</span>
                  </div>
                  <div className="mt-1 truncate font-bold">{client || "بدون عميل"} {d.title && <span className="font-normal text-lilac/60">· {d.title}</span>}</div>
                  <div className="mt-0.5 text-xs text-lilac/45">{fmtDate(d.date)}</div>
                </div>
                {amount > 0 && <span className="font-latin text-lg font-bold">{money(amount, d.currency)}</span>}
              </Link>
              <div className="flex items-center gap-1.5">
                {d.type === "quote" && (
                  <form action={convertQuote.bind(null, d.id)}>
                    <button {...tip("تحويل لفاتورة", "يسوي فاتورة بنفس العميل والبنود ويعلّم العرض «مقبول».")} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-lilac/70 hover:border-orchid hover:text-white" aria-label="تحويل لفاتورة">
                      <Icon name="receipt" className="h-4 w-4" />
                    </button>
                  </form>
                )}
                <form action={duplicateDoc.bind(null, d.id)}>
                  <button {...tip("نسخة", "يسوي نسخة جديدة برقم جديد ويفتحها.")} className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-lilac/70 hover:border-orchid hover:text-white">نسخة</button>
                </form>
                <DeleteDoc id={d.id} label={`${name.one} ${d.number}`} />
              </div>
            </li>
          );
        })}
        {!docs.length && (
          <li className="card p-10 text-center">
            <p className="text-lilac/60">ما كو {name.many} بعد.</p>
            <p className="mt-1 text-sm text-lilac/40">اضغط «{name.new}» فوق حتى تبدي.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
