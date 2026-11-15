/**
 * Business documents made in the dashboard: price quotes, invoices and marketing plans.
 * Each one is stored in data/documents.json and exported as a branded A4 PDF.
 * Client-safe: types, defaults and pure helpers only (storage lives in lib/store.ts).
 */

export type DocType = "quote" | "invoice" | "plan";
export const DOC_TYPES: DocType[] = ["quote", "invoice", "plan"];
export type Currency = "IQD" | "USD";
export type DocLang = "ar" | "en";

export type Party = { name: string; company: string; phone: string; email: string; address: string };
export type LineItem = { title: string; description: string; qty: number; price: number };

type Base = {
  id: string;
  number: string;
  title: string;
  date: string; // YYYY-MM-DD
  lang: DocLang;
  currency: Currency;
  client: Party;
  createdAt: string;
  updatedAt: string;
};

export type Priced = {
  items: LineItem[];
  discount: number;
  discountType: "amount" | "percent";
  tax: number; // percent
};

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";
export type Quote = Base &
  Priced & {
    type: "quote";
    validUntil: string;
    status: QuoteStatus;
    intro: string;
    terms: string; // one per line
    notes: string;
  };

export type Invoice = Base &
  Priced & {
    type: "invoice";
    dueDate: string;
    paid: number;
    payment: string; // how to pay, one per line
    notes: string;
    quote: string; // number of the quote it came from
  };

export type Plan = Base & {
  type: "plan";
  kind: "plan" | "strategy";
  clientLogo: string;
  period: string;
  summary: string;
  goals: { title: string; target: string }[];
  swot: { s: string; w: string; o: string; t: string }; // one point per line
  audience: { name: string; body: string }[];
  bigIdea: string;
  pillars: { title: string; body: string }[];
  channels: { name: string; role: string; budget: number; kpi: string }[];
  phases: { name: string; period: string; tasks: string }[];
  kpis: { label: string; target: string }[];
  nextSteps: string;
};

export type Doc = Quote | Invoice | Plan;
export type DocOf<T extends DocType> = Extract<Doc, { type: T }>;

/** Where each type lives in the dashboard. */
export const DOC_ROUTE: Record<DocType, string> = { quote: "quotes", invoice: "invoices", plan: "plans" };
export const DOC_PREFIX: Record<DocType, string> = { quote: "Q", invoice: "INV", plan: "MP" };
export const DOC_NAME: Record<DocType, { one: string; many: string; new: string }> = {
  quote: { one: "عرض سعر", many: "عروض الأسعار", new: "عرض سعر جديد" },
  invoice: { one: "فاتورة", many: "الفواتير", new: "فاتورة جديدة" },
  plan: { one: "خطة تسويقية", many: "الخطط التسويقية", new: "خطة جديدة" },
};

export const emptyParty = (): Party => ({ name: "", company: "", phone: "", email: "", address: "" });
export const emptyItem = (): LineItem => ({ title: "", description: "", qty: 1, price: 0 });

export const today = () => new Date().toISOString().slice(0, 10);
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const QUOTE_TERMS = [
  "تُدفع 50% من قيمة العرض عند الموافقة، و50% عند التسليم.",
  "الأسعار لا تشمل ميزانية الإعلانات الممولة ما لم يُذكر ذلك.",
  "مدة التنفيذ تبدأ من استلام الدفعة الأولى وكل المواد المطلوبة.",
  "كل تصميم يشمل جولتين من التعديلات.",
].join("\n");

const INVOICE_PAYMENT = ["نقداً في مكتب ماجك - بغداد، القادسية", "زين كاش / تحويل مصرفي: تواصل معنا لتفاصيل الحساب"].join("\n");

/** A fresh document. `prev` is the latest one of the same type: its reusable text (terms, payment...) carries over. */
export function newDoc<T extends DocType>(type: T, number: string, prev?: Doc): DocOf<T> {
  const now = new Date().toISOString();
  const date = today();
  const base = {
    id: crypto.randomUUID(),
    number,
    title: "",
    date,
    lang: prev?.lang ?? ("ar" as DocLang),
    currency: prev?.currency ?? ("IQD" as Currency),
    client: emptyParty(),
    createdAt: now,
    updatedAt: now,
  };
  const priced: Priced = { items: [emptyItem()], discount: 0, discountType: "amount", tax: 0 };
  if (type === "quote") {
    const p = prev?.type === "quote" ? prev : undefined;
    return { ...base, ...priced, type, validUntil: addDays(date, 14), status: "draft", intro: p?.intro ?? "", terms: p?.terms ?? QUOTE_TERMS, notes: "" } as DocOf<T>;
  }
  if (type === "invoice") {
    const p = prev?.type === "invoice" ? prev : undefined;
    return { ...base, ...priced, type, dueDate: addDays(date, 7), paid: 0, payment: p?.payment ?? INVOICE_PAYMENT, notes: p?.notes ?? "", quote: "" } as DocOf<T>;
  }
  return {
    ...base,
    type: "plan",
    kind: "plan",
    clientLogo: "",
    period: "",
    summary: "",
    goals: [{ title: "", target: "" }],
    swot: { s: "", w: "", o: "", t: "" },
    audience: [{ name: "", body: "" }],
    bigIdea: "",
    pillars: [{ title: "", body: "" }],
    channels: [{ name: "", role: "", budget: 0, kpi: "" }],
    phases: [{ name: "", period: "", tasks: "" }],
    kpis: [{ label: "", target: "" }],
    nextSteps: "",
  } as DocOf<T>;
}

/** An invoice for an accepted quote: same client, items and pricing. */
export function invoiceFromQuote(q: Quote, number: string, prev?: Doc): Invoice {
  const inv = newDoc("invoice", number, prev);
  return {
    ...inv,
    title: q.title,
    lang: q.lang,
    currency: q.currency,
    client: { ...q.client },
    items: q.items.map((i) => ({ ...i })),
    discount: q.discount,
    discountType: q.discountType,
    tax: q.tax,
    quote: q.number,
  };
}

export function totals(d: Priced) {
  const subtotal = d.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
  const discount = Math.min(subtotal, d.discountType === "percent" ? (subtotal * (Number(d.discount) || 0)) / 100 : Number(d.discount) || 0);
  const tax = ((subtotal - discount) * (Number(d.tax) || 0)) / 100;
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

export function invoiceStatus(inv: Invoice): "paid" | "partial" | "unpaid" {
  const { total } = totals(inv);
  const paid = Number(inv.paid) || 0;
  if (total > 0 && paid >= total) return "paid";
  return paid > 0 ? "partial" : "unpaid";
}

/** Headline money of a doc, for lists. */
export function docAmount(d: Doc) {
  if (d.type === "plan") return d.channels.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  return totals(d).total;
}

export function money(n: number, cur: Currency, lang: DocLang = "ar") {
  if (cur === "USD") return `$${new Intl.NumberFormat("en", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n)}`;
  const v = new Intl.NumberFormat("en").format(Math.round(n));
  return lang === "ar" ? `${v} د.ع` : `IQD ${v}`;
}

export function fmtDate(date: string, lang: DocLang = "ar") {
  if (!date) return "";
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(+d)) return date;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-IQ-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

export const lines = (s: string) => (s ?? "").split("\n").map((l) => l.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean);

/** Labels printed on the PDFs, per document language. */
export const T = {
  ar: {
    quote: "عرض سعر",
    invoice: "فاتورة",
    plan: "خطة تسويقية",
    strategy: "استراتيجية تسويقية",
    number: "الرقم",
    date: "التاريخ",
    validUntil: "صالح لغاية",
    dueDate: "تاريخ الاستحقاق",
    preparedFor: "مقدّم إلى",
    from: "من",
    billTo: "الفاتورة إلى",
    item: "البند",
    qty: "الكمية",
    price: "السعر",
    amount: "المبلغ",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    tax: "الضريبة",
    total: "الإجمالي",
    paid: "المدفوع",
    balance: "المبلغ المستحق",
    terms: "الشروط والأحكام",
    notes: "ملاحظات",
    payment: "طريقة الدفع",
    acceptance: "موافقة العميل",
    signature: "التوقيع",
    name: "الاسم",
    page: "صفحة",
    ref: "مرجع العرض",
    status: { paid: "مدفوعة", partial: "مدفوعة جزئياً", unpaid: "غير مدفوعة" },
    thanks: "شكراً لثقتكم بماجك",
    period: "الفترة",
    preparedBy: "إعداد فريق ماجك",
    summary: "الملخص التنفيذي",
    goals: "الأهداف",
    swot: "تحليل SWOT",
    swotS: "نقاط القوة",
    swotW: "نقاط الضعف",
    swotO: "الفرص",
    swotT: "التهديدات",
    audience: "الجمهور المستهدف",
    bigIdea: "الفكرة الكبيرة",
    pillars: "محاور المحتوى",
    channels: "القنوات والميزانية",
    channel: "القناة",
    role: "الدور",
    kpi: "المؤشر",
    budget: "الميزانية",
    totalBudget: "إجمالي الميزانية",
    phases: "الجدول الزمني",
    kpis: "مؤشرات الأداء",
    nextSteps: "الخطوات القادمة",
    letsGo: "يلا نبدي",
    contact: "تواصل معنا",
  },
  en: {
    quote: "Quotation",
    invoice: "Invoice",
    plan: "Marketing Plan",
    strategy: "Marketing Strategy",
    number: "No.",
    date: "Date",
    validUntil: "Valid until",
    dueDate: "Due date",
    preparedFor: "Prepared for",
    from: "From",
    billTo: "Bill to",
    item: "Item",
    qty: "Qty",
    price: "Price",
    amount: "Amount",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax",
    total: "Total",
    paid: "Paid",
    balance: "Balance due",
    terms: "Terms & conditions",
    notes: "Notes",
    payment: "How to pay",
    acceptance: "Client approval",
    signature: "Signature",
    name: "Name",
    page: "Page",
    ref: "Quote ref.",
    status: { paid: "Paid", partial: "Partially paid", unpaid: "Unpaid" },
    thanks: "Thank you for trusting Magic",
    period: "Period",
    preparedBy: "Prepared by Magic Team",
    summary: "Executive summary",
    goals: "Objectives",
    swot: "SWOT analysis",
    swotS: "Strengths",
    swotW: "Weaknesses",
    swotO: "Opportunities",
    swotT: "Threats",
    audience: "Target audience",
    bigIdea: "The big idea",
    pillars: "Content pillars",
    channels: "Channels & budget",
    channel: "Channel",
    role: "Role",
    kpi: "KPI",
    budget: "Budget",
    totalBudget: "Total budget",
    phases: "Timeline",
    kpis: "Key metrics",
    nextSteps: "Next steps",
    letsGo: "Let's make magic",
    contact: "Get in touch",
  },
} as const;
export type Labels = (typeof T)[DocLang];

/** Agency details printed on every document (from the dashboard settings). */
export type Company = { name: string; phone: string; email: string; address: { ar: string; en: string }; instagram: string; website: string };

export function companyFrom(s: { siteName: string; phone: string; email: string; address: { ar: string; en: string }; instagram: string }): Company {
  return { name: s.siteName || "Magic Team", phone: s.phone, email: s.email, address: s.address, instagram: s.instagram, website: "magicagency.info" };
}
