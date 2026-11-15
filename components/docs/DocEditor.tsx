"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { convertQuote, deleteDoc, duplicateDoc, saveDoc } from "@/app/admin/docs-actions";
import { confirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageInput, inputCls } from "@/components/admin/SchemaForm";
import { Icon } from "@/components/brand/Icon";
import { DOC_NAME, DOC_ROUTE, emptyItem, invoiceStatus, money, totals, type Company, type Doc, type Invoice, type LineItem, type Party, type Plan, type Quote } from "@/lib/docs";
import { tip } from "@/lib/tip";
import { partyTitle } from "./common";
import { InvoiceDoc } from "./InvoiceDoc";
import { PAGE_W } from "./Paged";
import { PlanDoc } from "./PlanDoc";
import { QuoteDoc } from "./QuoteDoc";
import { downloadPdf } from "./pdf";

type Set<T> = (patch: Partial<T>) => void;

export function DocEditor({ initial, company }: { initial: Doc; company: Company }) {
  const [doc, setDoc] = useState<Doc>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, start] = useTransition();
  const [exporting, setExporting] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dirty = JSON.stringify(doc) !== saved;
  const name = DOC_NAME[doc.type];
  const set = useCallback((patch: Partial<Doc>) => setDoc((d) => ({ ...d, ...patch }) as Doc), []);

  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 3200);
  };

  const save = useCallback(() => {
    start(async () => {
      const res = await saveDoc(doc);
      if (res.ok) {
        setSaved(JSON.stringify(doc));
        flash(true, "تم الحفظ");
        router.refresh();
      } else flash(false, res.error ?? "صار خطأ");
    });
  }, [doc, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, save]);

  const exportPdf = async () => {
    const pages = [...(sheet.current?.querySelectorAll<HTMLElement>(":scope > .doc-page") ?? [])];
    if (!pages.length) return;
    setExporting(true);
    try {
      await downloadPdf(pages, `${doc.number} - ${partyTitle(doc.client) || doc.title || name.one}`);
    } catch (e) {
      console.error(e);
      flash(false, "ما گدرنا نسوي الـ PDF، جرّب مرة ثانية");
    } finally {
      setExporting(false);
    }
  };

  const remove = async () => {
    const ok = await confirmDialog({ title: `حذف ${name.one} ${doc.number}؟`, message: "ينحذف نهائياً وما يرجع.", confirmLabel: "حذف", danger: true });
    if (!ok) return;
    await deleteDoc(doc.id);
    setSaved(JSON.stringify(doc));
    router.push(`/admin/${DOC_ROUTE[doc.type]}`);
  };

  const guardDirty = async () => !dirty || (await confirmDialog({ title: "عندك تعديلات ما محفوظة", message: "احفظها أول، وإلا راح تضيع.", confirmLabel: "كمّل بدون حفظ" }));

  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="sticky top-0 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-ink/85 px-4 py-4 backdrop-blur md:-mx-10 md:px-10">
        <Link href={`/admin/${DOC_ROUTE[doc.type]}`} {...tip("رجوع", `يرجعك لقائمة ${name.many}.`, "bottom")} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-lilac hover:border-orchid" aria-label="رجوع">
          <Icon name="chevR" className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-orchid">{name.one} · <span className="font-latin">{doc.number}</span></div>
          <h1 className="truncate text-xl font-bold">{doc.title || partyTitle(doc.client) || "بدون عنوان"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {doc.type === "quote" && (
            <form action={convertQuote.bind(null, doc.id)} onSubmit={async (e) => { if (!(await guardDirty())) e.preventDefault(); }}>
              <button {...tip("تحويل لفاتورة", "يسوي فاتورة جديدة بنفس العميل والبنود والأسعار، ويعلّم العرض «مقبول». احفظ تعديلاتك أول.", "bottom")} className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-lilac hover:border-orchid hover:text-white">
                <Icon name="receipt" className="h-4 w-4" /> تحويل لفاتورة
              </button>
            </form>
          )}
          <form action={duplicateDoc.bind(null, doc.id)}>
            <button {...tip("نسخة", `يسوي نسخة جديدة من هذا الـ${name.one} برقم جديد. النسخة تنعمل من آخر نسخة محفوظة.`, "bottom")} className="rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-lilac hover:border-orchid hover:text-white">نسخة</button>
          </form>
          <button onClick={remove} {...tip("حذف", "يحذف المستند نهائياً بعد ما تأكد.", "bottom")} className="grid h-10 w-10 place-items-center rounded-full text-lilac/60 hover:bg-orchid/20 hover:text-orchid" aria-label="حذف">
            <Icon name="close" className="h-4 w-4" />
          </button>
          <button onClick={exportPdf} disabled={exporting} {...tip("تحميل PDF", "ينزّل الملف PDF بالتصميم اللي تشوفه بالمعاينة، جاهز ترسله للعميل.", "bottom")} className="btn btn-ghost py-2.5! disabled:opacity-50">
            {exporting ? "جاري التجهيز..." : "تحميل PDF"}
            <span className="arrow"><Icon name="chevD" className="h-4 w-4" /></span>
          </button>
          <span {...tip(dirty ? "حفظ" : "كلشي محفوظ", dirty ? "يحفظ التعديلات. اختصار: ⌘S أو Ctrl+S." : "ما كو تعديلات جديدة.", "bottom")}>
            <button onClick={save} disabled={!dirty || pending} className="btn btn-primary py-2.5! disabled:opacity-40 disabled:shadow-none">
              {pending ? "جاري الحفظ..." : dirty ? "حفظ" : "محفوظ"}
              <span className="arrow"><Icon name="check" className="h-4 w-4" strokeWidth={2.5} /></span>
            </button>
          </span>
        </div>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          {doc.type === "quote" && <QuoteForm doc={doc} set={set as Set<Quote>} />}
          {doc.type === "invoice" && <InvoiceForm doc={doc} set={set as Set<Invoice>} />}
          {doc.type === "plan" && <PlanForm doc={doc} set={set as Set<Plan>} />}
        </div>
        <Preview sheet={sheet}>
          {doc.type === "quote" && <QuoteDoc doc={doc} company={company} />}
          {doc.type === "invoice" && <InvoiceDoc doc={doc} company={company} />}
          {doc.type === "plan" && <PlanDoc doc={doc} company={company} />}
        </Preview>
      </div>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl ${toast.ok ? "bg-green text-ink" : "bg-orchid text-ink"}`} role="status" style={{ animation: "storyIn .5s cubic-bezier(.16,1,.3,1)" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ---------- Live A4 preview ---------- */

const noop = () => () => {};

function Preview({ sheet, children }: { sheet: React.RefObject<HTMLDivElement | null>; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [height, setHeight] = useState(0);
  // pages are measured and laid out in the browser only, so skip them in the server HTML
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  useLayoutEffect(() => {
    const o = outer.current;
    const s = sheet.current;
    if (!o || !s) return;
    const ro = new ResizeObserver(() => {
      const k = Math.min(1, o.clientWidth / PAGE_W);
      setScale(k);
      setHeight(s.offsetHeight * k);
    });
    ro.observe(o);
    ro.observe(s);
    return () => ro.disconnect();
  }, [sheet]);
  return (
    <div className="xl:sticky xl:top-28">
      <div className="mb-2 flex items-center justify-between text-xs text-lilac/50">
        <span>معاينة مباشرة · A4</span>
        <span>هذا نفس الشكل اللي يطلع بالـ PDF</span>
      </div>
      <div className="max-h-[calc(100dvh-9.5rem)] overflow-y-auto overflow-x-hidden rounded-3xl bg-black/30 p-3" data-lenis-prevent>
        <div ref={outer} className="relative" style={{ height }}>
          <div ref={sheet} className="doc-sheet absolute top-0 flex flex-col gap-6" style={{ left: 0, width: PAGE_W, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
            {mounted && children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Form building blocks ---------- */

function Card({ title, help, children }: { title: string; help?: string; children: ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
        {title}
        {help && (
          <span {...tip(title, help)} className="grid h-4 w-4 cursor-help place-items-center rounded-full border border-lilac/25 font-latin text-[9px] font-bold text-lilac/50">?</span>
        )}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function F({ label, help, children, className = "" }: { label: string; help?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`} {...(help ? tip(label, help) : {})}>
      <span className="mb-1.5 block text-xs font-semibold text-lilac/70">{label}</span>
      {children}
    </label>
  );
}

const Text = ({ value, onChange, ltr, placeholder }: { value: string; onChange: (v: string) => void; ltr?: boolean; placeholder?: string }) => (
  <input className={`${inputCls} ${ltr ? "font-latin" : ""}`} dir={ltr ? "ltr" : undefined} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
);
const Area = ({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
  <textarea className={`${inputCls} leading-7`} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
);
const Num = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <input type="number" min={0} className={`${inputCls} font-latin`} dir="ltr" value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
);
const DateIn = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <input type="date" className={`${inputCls} font-latin [color-scheme:dark]`} dir="ltr" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
);
function Choice<V extends string>({ value, onChange, options }: { value: V; onChange: (v: V) => void; options: [V, string][] }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--line)] bg-ink/60 p-1">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={`flex-1 rounded-lg px-3 py-1.5 text-sm transition ${value === v ? "bg-orchid font-bold text-ink" : "text-lilac/70 hover:text-white"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

/** Editable list of rows: add, remove, move. */
function Rows<T>({ value, onChange, make, addLabel, render }: { value: T[]; onChange: (v: T[]) => void; make: () => T; addLabel: string; render: (row: T, set: (p: Partial<T>) => void, i: number) => ReactNode }) {
  const at = (i: number, p: Partial<T>) => onChange(value.map((r, j) => (j === i ? { ...r, ...p } : r)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const [r] = next.splice(i, 1);
    next.splice(i + d, 0, r);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="relative rounded-2xl border border-[var(--line)] bg-ink/40 p-3 pt-9">
          <div className="absolute inset-x-3 top-2 flex items-center gap-1">
            <span className="font-latin text-[11px] font-bold text-orchid">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1" />
            <button type="button" disabled={!i} onClick={() => move(i, -1)} {...tip("لفوق", "ينقل هذا السطر خطوة لفوق.")} className="grid h-6 w-6 place-items-center rounded-md text-lilac/50 hover:bg-white/10 hover:text-white disabled:opacity-20" aria-label="لفوق"><Icon name="chevD" className="h-3.5 w-3.5 rotate-180" /></button>
            <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} {...tip("لجوة", "ينقل هذا السطر خطوة لجوة.")} className="grid h-6 w-6 place-items-center rounded-md text-lilac/50 hover:bg-white/10 hover:text-white disabled:opacity-20" aria-label="لجوة"><Icon name="chevD" className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} {...tip("حذف السطر", "يشيل هذا السطر.")} className="grid h-6 w-6 place-items-center rounded-md text-lilac/50 hover:bg-orchid/20 hover:text-orchid" aria-label="حذف"><Icon name="close" className="h-3.5 w-3.5" /></button>
          </div>
          {render(row, (p) => at(i, p), i)}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, make()])} className="w-full rounded-2xl border border-dashed border-[var(--line)] py-2.5 text-sm text-lilac/70 hover:border-orchid hover:text-white">
        + {addLabel}
      </button>
    </div>
  );
}

/* ---------- Shared sections ---------- */

function Basics({ doc, set, children }: { doc: Doc; set: Set<Doc>; children?: ReactNode }) {
  return (
    <Card title="الأساسيات" help="رقم المستند يتولّد تلقائياً وتگدر تغيّره. اللغة تغيّر كل كتابات الملف (عربي من اليمين، إنكليزي من اليسار).">
      <div className="grid gap-4 md:grid-cols-2">
        <F label="العنوان" className="md:col-span-2"><Text value={doc.title} onChange={(title) => set({ title })} placeholder={doc.type === "plan" ? "مثلاً: خطة إطلاق الفرع الجديد" : "مثلاً: إدارة حسابات السوشيال ميديا - 3 أشهر"} /></F>
        <F label="الرقم"><Text ltr value={doc.number} onChange={(number) => set({ number })} /></F>
        <F label="التاريخ"><DateIn value={doc.date} onChange={(date) => set({ date })} /></F>
        {children}
        <F label="لغة الملف"><Choice value={doc.lang} onChange={(lang) => set({ lang })} options={[["ar", "عربي"], ["en", "English"]]} /></F>
        <F label="العملة"><Choice value={doc.currency} onChange={(currency) => set({ currency })} options={[["IQD", "دينار"], ["USD", "دولار"]]} /></F>
      </div>
    </Card>
  );
}

function ClientCard({ value, onChange, title = "العميل" }: { value: Party; onChange: (p: Party) => void; title?: string }) {
  const s = (p: Partial<Party>) => onChange({ ...value, ...p });
  return (
    <Card title={title} help="اسم الشركة يطلع كبير بالملف، والباقي تحته. الخانات الفارغة ما تطلع.">
      <div className="grid gap-4 md:grid-cols-2">
        <F label="اسم الشركة / العلامة"><Text value={value.company} onChange={(company) => s({ company })} /></F>
        <F label="اسم الشخص"><Text value={value.name} onChange={(name) => s({ name })} /></F>
        <F label="الهاتف"><Text ltr value={value.phone} onChange={(phone) => s({ phone })} /></F>
        <F label="الإيميل"><Text ltr value={value.email} onChange={(email) => s({ email })} /></F>
        <F label="العنوان" className="md:col-span-2"><Text value={value.address} onChange={(address) => s({ address })} /></F>
      </div>
    </Card>
  );
}

function ItemsCard({ doc, set }: { doc: Quote | Invoice; set: Set<Quote | Invoice> }) {
  const t = totals(doc);
  const m = (n: number) => money(n, doc.currency);
  return (
    <>
      <Card title="البنود" help="كل خدمة بسطر: العنوان، وصف قصير (اختياري)، الكمية وسعر الوحدة. المبلغ يتحسب تلقائياً.">
        <Rows<LineItem>
          value={doc.items}
          onChange={(items) => set({ items })}
          make={emptyItem}
          addLabel="إضافة بند"
          render={(it, s) => (
            <div className="grid gap-3 md:grid-cols-[1fr_90px_150px]">
              <F label="البند"><Text value={it.title} onChange={(title) => s({ title })} placeholder="مثلاً: تصوير منتجات" /></F>
              <F label="الكمية"><Num value={it.qty} onChange={(qty) => s({ qty })} /></F>
              <F label="سعر الوحدة"><Num value={it.price} onChange={(price) => s({ price })} /></F>
              <F label="الوصف" className="md:col-span-3"><Area rows={2} value={it.description} onChange={(description) => s({ description })} placeholder="شنو يشمل البند (اختياري)" /></F>
            </div>
          )}
        />
      </Card>
      <Card title="الحساب" help="الخصم يا مبلغ ثابت يا نسبة. الضريبة نسبة من المبلغ بعد الخصم. خليهن صفر إذا ما تحتاجهن.">
        <div className="grid gap-4 md:grid-cols-3">
          <F label="الخصم"><Num value={doc.discount} onChange={(discount) => set({ discount })} /></F>
          <F label="نوع الخصم"><Choice value={doc.discountType} onChange={(discountType) => set({ discountType })} options={[["amount", "مبلغ"], ["percent", "%"]]} /></F>
          <F label="الضريبة %"><Num value={doc.tax} onChange={(tax) => set({ tax })} /></F>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm">
          <span className="text-lilac/60">المجموع <b className="font-latin text-white">{m(t.subtotal)}</b>{t.discount > 0 && <> · خصم <b className="font-latin text-white">{m(t.discount)}</b></>}{t.tax > 0 && <> · ضريبة <b className="font-latin text-white">{m(t.tax)}</b></>}</span>
          <span className="font-bold">الإجمالي <span className="font-latin text-yellow">{m(t.total)}</span></span>
        </div>
      </Card>
    </>
  );
}

/* ---------- Per type ---------- */

function QuoteForm({ doc, set }: { doc: Quote; set: Set<Quote> }) {
  return (
    <>
      <Basics doc={doc} set={set as Set<Doc>}>
        <F label="صالح لغاية"><DateIn value={doc.validUntil} onChange={(validUntil) => set({ validUntil })} /></F>
        <F label="الحالة" help="للمتابعة بالقائمة فقط، ما تطلع بالـ PDF.">
          <Choice value={doc.status} onChange={(status) => set({ status })} options={[["draft", "مسودة"], ["sent", "مُرسل"], ["accepted", "مقبول"], ["rejected", "مرفوض"]]} />
        </F>
      </Basics>
      <ClientCard value={doc.client} onChange={(client) => set({ client })} title="مقدّم إلى" />
      <Card title="مقدمة" help="فقرة قصيرة تطلع تحت العنوان، مثلاً شكر على الاجتماع أو ملخص اللي راح نسويه. اختيارية.">
        <Area value={doc.intro} onChange={(intro) => set({ intro })} placeholder="يسعدنا نقدّم لكم هذا العرض..." />
      </Card>
      <ItemsCard doc={doc} set={set as Set<Quote | Invoice>} />
      <Card title="الشروط والملاحظات" help="كل شرط بسطر. الشروط تنحفظ وتنتقل تلقائياً لأي عرض جديد تسويه.">
        <F label="الشروط والأحكام"><Area rows={5} value={doc.terms} onChange={(terms) => set({ terms })} /></F>
        <F label="ملاحظات"><Area rows={3} value={doc.notes} onChange={(notes) => set({ notes })} /></F>
      </Card>
    </>
  );
}

function InvoiceForm({ doc, set }: { doc: Invoice; set: Set<Invoice> }) {
  const st = invoiceStatus(doc);
  const label = { paid: "مدفوعة", partial: "مدفوعة جزئياً", unpaid: "غير مدفوعة" }[st];
  return (
    <>
      <Basics doc={doc} set={set as Set<Doc>}>
        <F label="تاريخ الاستحقاق"><DateIn value={doc.dueDate} onChange={(dueDate) => set({ dueDate })} /></F>
        <F label="مرجع العرض" help="رقم عرض السعر اللي طلعت منه الفاتورة. اختياري."><Text ltr value={doc.quote} onChange={(quote) => set({ quote })} placeholder="Q-2026-001" /></F>
      </Basics>
      <ClientCard value={doc.client} onChange={(client) => set({ client })} title="الفاتورة إلى" />
      <ItemsCard doc={doc} set={set as Set<Quote | Invoice>} />
      <Card title="الدفع" help="اكتب شگد دفع العميل لحد الآن. حالة الفاتورة (مدفوعة / جزئياً / غير مدفوعة) تتحدد تلقائياً وتطلع ختم على الملف.">
        <div className="grid items-end gap-4 md:grid-cols-2">
          <F label="المبلغ المدفوع"><Num value={doc.paid} onChange={(paid) => set({ paid })} /></F>
          <div className="rounded-xl bg-white/5 px-4 py-2.5 text-sm">الحالة: <b className={st === "paid" ? "text-green" : st === "partial" ? "text-yellow" : "text-orchid"}>{label}</b></div>
        </div>
        <F label="طريقة الدفع" help="كل طريقة بسطر. تنحفظ وتنتقل تلقائياً للفواتير الجديدة."><Area rows={3} value={doc.payment} onChange={(payment) => set({ payment })} /></F>
        <F label="ملاحظات"><Area rows={2} value={doc.notes} onChange={(notes) => set({ notes })} /></F>
      </Card>
    </>
  );
}

function PlanForm({ doc, set }: { doc: Plan; set: Set<Plan> }) {
  const list = "كل نقطة بسطر.";
  const total = doc.channels.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  return (
    <>
      <Basics doc={doc} set={set as Set<Doc>}>
        <F label="النوع" help="يغيّر العنوان على الغلاف: خطة تسويقية أو استراتيجية تسويقية.">
          <Choice value={doc.kind} onChange={(kind) => set({ kind })} options={[["plan", "خطة تسويقية"], ["strategy", "استراتيجية"]]} />
        </F>
        <F label="الفترة"><Text value={doc.period} onChange={(period) => set({ period })} placeholder="مثلاً: كانون الثاني - آذار 2027" /></F>
      </Basics>
      <ClientCard value={doc.client} onChange={(client) => set({ client })} />
      <Card title="شعار العميل" help="يطلع على الغلاف. الأفضل PNG بخلفية شفافة. اختياري.">
        <ImageInput value={doc.clientLogo} onChange={(clientLogo) => set({ clientLogo })} />
      </Card>
      <p className="px-1 text-xs text-lilac/50">أي قسم تخليه فارغ ما يطلع بالملف، والأرقام تترتب تلقائياً.</p>
      <Card title="01 · الملخص التنفيذي"><Area rows={5} value={doc.summary} onChange={(summary) => set({ summary })} placeholder="الوضع الحالي، شنو نريد نوصل له، وشلون..." /></Card>
      <Card title="02 · الأهداف" help="كل هدف بعنوان ورقم مستهدف، مثلاً «زيادة المبيعات» و«+30%».">
        <Rows value={doc.goals} onChange={(goals) => set({ goals })} make={() => ({ title: "", target: "" })} addLabel="إضافة هدف" render={(g, s) => (
          <div className="grid gap-3 md:grid-cols-[1fr_160px]">
            <F label="الهدف"><Text value={g.title} onChange={(title) => s({ title })} /></F>
            <F label="المستهدف"><Text value={g.target} onChange={(target) => s({ target })} placeholder="+30%" /></F>
          </div>
        )} />
      </Card>
      <Card title="03 · تحليل SWOT" help={list}>
        <div className="grid gap-4 md:grid-cols-2">
          {([["s", "نقاط القوة"], ["w", "نقاط الضعف"], ["o", "الفرص"], ["t", "التهديدات"]] as const).map(([k, l]) => (
            <F key={k} label={l}><Area rows={4} value={doc.swot[k]} onChange={(v) => set({ swot: { ...doc.swot, [k]: v } })} /></F>
          ))}
        </div>
      </Card>
      <Card title="04 · الجمهور المستهدف" help="كل شريحة باسم ووصف قصير (العمر، الاهتمامات، وين نلگاهم).">
        <Rows value={doc.audience} onChange={(audience) => set({ audience })} make={() => ({ name: "", body: "" })} addLabel="إضافة شريحة" render={(a, s) => (
          <div className="grid gap-3">
            <F label="الشريحة"><Text value={a.name} onChange={(name) => s({ name })} placeholder="مثلاً: العوائل الشابة" /></F>
            <F label="الوصف"><Area rows={2} value={a.body} onChange={(body) => s({ body })} /></F>
          </div>
        )} />
      </Card>
      <Card title="05 · الفكرة الكبيرة" help="جملة وحدة قوية تلخص الحملة. تطلع بخط كبير على شريط غامق."><Area rows={2} value={doc.bigIdea} onChange={(bigIdea) => set({ bigIdea })} /></Card>
      <Card title="06 · محاور المحتوى">
        <Rows value={doc.pillars} onChange={(pillars) => set({ pillars })} make={() => ({ title: "", body: "" })} addLabel="إضافة محور" render={(p, s) => (
          <div className="grid gap-3">
            <F label="المحور"><Text value={p.title} onChange={(title) => s({ title })} /></F>
            <F label="الوصف"><Area rows={2} value={p.body} onChange={(body) => s({ body })} /></F>
          </div>
        )} />
      </Card>
      <Card title="07 · القنوات والميزانية" help="كل قناة بدورها وميزانيتها ومؤشرها. الملف يرسم شريط يوضح توزيع الميزانية.">
        <Rows value={doc.channels} onChange={(channels) => set({ channels })} make={() => ({ name: "", role: "", budget: 0, kpi: "" })} addLabel="إضافة قناة" render={(c, s) => (
          <div className="grid gap-3 md:grid-cols-2">
            <F label="القناة"><Text value={c.name} onChange={(name) => s({ name })} placeholder="Instagram" /></F>
            <F label="الميزانية"><Num value={c.budget} onChange={(budget) => s({ budget })} /></F>
            <F label="الدور"><Text value={c.role} onChange={(role) => s({ role })} placeholder="الوعي بالعلامة" /></F>
            <F label="المؤشر"><Text value={c.kpi} onChange={(kpi) => s({ kpi })} placeholder="الوصول، التفاعل" /></F>
          </div>
        )} />
        {total > 0 && <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">إجمالي الميزانية <b className="font-latin text-yellow">{money(total, doc.currency)}</b></div>}
      </Card>
      <Card title="08 · الجدول الزمني" help={`كل مرحلة باسمها وفترتها. المهام: ${list}`}>
        <Rows value={doc.phases} onChange={(phases) => set({ phases })} make={() => ({ name: "", period: "", tasks: "" })} addLabel="إضافة مرحلة" render={(p, s) => (
          <div className="grid gap-3 md:grid-cols-2">
            <F label="المرحلة"><Text value={p.name} onChange={(name) => s({ name })} placeholder="التشويق" /></F>
            <F label="الفترة"><Text value={p.period} onChange={(period) => s({ period })} placeholder="الأسبوع 1-2" /></F>
            <F label="المهام" className="md:col-span-2"><Area rows={3} value={p.tasks} onChange={(tasks) => s({ tasks })} /></F>
          </div>
        )} />
      </Card>
      <Card title="09 · مؤشرات الأداء">
        <Rows value={doc.kpis} onChange={(kpis) => set({ kpis })} make={() => ({ label: "", target: "" })} addLabel="إضافة مؤشر" render={(k, s) => (
          <div className="grid gap-3 md:grid-cols-[1fr_160px]">
            <F label="المؤشر"><Text value={k.label} onChange={(label) => s({ label })} placeholder="متابعين جدد" /></F>
            <F label="المستهدف"><Text value={k.target} onChange={(target) => s({ target })} placeholder="10K" /></F>
          </div>
        )} />
      </Card>
      <Card title="10 · الخطوات القادمة" help={list}><Area rows={4} value={doc.nextSteps} onChange={(nextSteps) => set({ nextSteps })} /></Card>
    </>
  );
}
