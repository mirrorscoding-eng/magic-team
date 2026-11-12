import type { ContentKey } from "./types";

export type Field =
  | { type: "l"; key: string; label: string; multiline?: boolean }
  | { type: "text"; key: string; label: string; ltr?: boolean; placeholder?: string }
  | { type: "number"; key: string; label: string; step?: number }
  | { type: "bool"; key: string; label: string }
  | { type: "image"; key: string; label: string }
  | { type: "color"; key: string; label: string }
  | { type: "icon"; key: string; label: string; icons: string[] }
  | { type: "multi"; key: string; label: string; source: "sections" | "cases" }
  | { type: "group"; key: string; label: string; fields: Field[] }
  | { type: "list"; key: string; label: string; item: Field[]; titleKey?: string; addLabel?: string }
  | { type: "lList"; key: string; label: string };

export type EditorSchema = {
  key: ContentKey;
  title: string;
  description: string;
  anchor?: string;
  fields: Field[];
};

export const BRAND_COLORS = [
  { value: "orchid", hex: "#eb70fa", label: "أوركيد" },
  { value: "lilac", hex: "#fac3fd", label: "ليلكي" },
  { value: "cyan", hex: "#b3e9fc", label: "سماوي" },
  { value: "yellow", hex: "#f5fca9", label: "أصفر" },
  { value: "green", hex: "#9cfc8d", label: "أخضر" },
] as const;

const SERVICE_ICONS = ["compass", "target", "chat", "camera", "spark", "star", "globe", "phone", "bag", "grid", "bolt", "shield", "wand", "present", "cart", "tag", "store", "users", "building", "chart", "receipt", "door"];

const head = (withSubtitle = true): Field[] => [
  { type: "l", key: "eyebrow", label: "العنوان الصغير" },
  { type: "l", key: "title", label: "العنوان الرئيسي" },
  ...(withSubtitle ? [{ type: "l", key: "subtitle", label: "الوصف", multiline: true } as Field] : []),
];

const chapter = (key: string, label: string): Field => ({
  type: "group",
  key,
  label,
  fields: [
    { type: "l", key: "title", label: "عنوان الفصل" },
    { type: "l", key: "body", label: "النص", multiline: true },
    { type: "image", key: "image", label: "صورة الخلفية" },
  ],
});

export const SCHEMAS: EditorSchema[] = [
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "أول شي يشوفه الزائر: الوسوم، العنوان، الأزرار، وبطاقات المنشورات.",
    anchor: "hero",
    fields: [
      { type: "list", key: "pills", label: "الوسوم فوق العنوان", titleKey: "label", addLabel: "إضافة وسم", item: [{ type: "l", key: "label", label: "النص" }, { type: "color", key: "color", label: "اللون" }] },
      { type: "l", key: "title", label: "العنوان (السطر الأول)" },
      { type: "l", key: "highlight", label: "العنوان (السطر الثاني)" },
      { type: "l", key: "tagline", label: "الجملة الإنكليزية العريضة تحت العنوان" },
      { type: "l", key: "subtitle", label: "الوصف", multiline: true },
      { type: "l", key: "ctaPrimary", label: "نص الزر الأساسي (يودي للأعمال)" },
      { type: "l", key: "ctaSecondary", label: "نص الزر الثانوي (يودي للتواصل)" },
      { type: "list", key: "cards", label: "بطاقات المنشورات (أول بطاقة تطلع قدّام)", titleKey: "alt", addLabel: "إضافة بطاقة", item: [{ type: "image", key: "image", label: "صورة المنشور (يفضّل 4:5)" }, { type: "text", key: "alt", label: "وصف الصورة", ltr: true }] },
    ],
  },
  {
    key: "clients",
    title: "علامات وثقت بنا",
    description: "شعارات العملاء اللي تتحرك بالشريط.",
    anchor: "clients",
    fields: [
      ...head(),
      { type: "list", key: "logos", label: "الشعارات", titleKey: "name", addLabel: "إضافة شعار", item: [{ type: "text", key: "name", label: "اسم العلامة", ltr: true }, { type: "image", key: "logo", label: "الشعار (يفضّل SVG أو PNG شفاف)" }] },
    ],
  },
  {
    key: "featured",
    title: "خدمات مميزة",
    description: "التريد ماركتنج + فريق ماجك داخل شركتك. تطلع بالرئيسية وبصفحة الخدمات.",
    anchor: "featured",
    fields: [
      ...head(),
      { type: "l", key: "cta", label: "نص زر التواصل" },
      {
        type: "group",
        key: "trade",
        label: "التريد ماركتنج",
        fields: [
          { type: "l", key: "tab", label: "اسم التبويب" },
          { type: "l", key: "audience", label: "لمنو الخدمة (سطر قصير)" },
          { type: "l", key: "title", label: "العنوان" },
          { type: "l", key: "body", label: "الوصف", multiline: true },
          { type: "l", key: "fits", label: "مناسبة لـ (افصل بفاصلة)" },
          { type: "image", key: "image", label: "صورة التبويب" },
          { type: "l", key: "mapTitle", label: "عنوان معرض الصور" },
          {
            type: "list",
            key: "zones",
            label: "مناطق المحل (كل منطقة صورة بالمعرض، بترتيب رحلة الزبون)",
            titleKey: "title",
            addLabel: "إضافة منطقة",
            item: [
              { type: "l", key: "title", label: "العنوان" },
              { type: "l", key: "body", label: "الوصف", multiline: true },
              { type: "l", key: "tags", label: "شنو نسوي (افصل بفاصلة)" },
              { type: "image", key: "image", label: "الصورة (يفضّل 4:3)" },
              { type: "icon", key: "icon", label: "الأيقونة", icons: SERVICE_ICONS },
              { type: "color", key: "color", label: "اللون" },
            ],
          },
          { type: "list", key: "stats", label: "الأرقام", titleKey: "value", addLabel: "إضافة رقم", item: [{ type: "l", key: "value", label: "الرقم" }, { type: "l", key: "label", label: "الوصف" }] },
        ],
      },
      {
        type: "group",
        key: "embedded",
        label: "فريق ماجك داخل شركتك",
        fields: [
          { type: "l", key: "tab", label: "اسم التبويب" },
          { type: "l", key: "audience", label: "لمنو الخدمة (سطر قصير)" },
          { type: "l", key: "title", label: "العنوان" },
          { type: "l", key: "body", label: "الوصف", multiline: true },
          { type: "l", key: "fits", label: "مناسبة لـ (افصل بفاصلة)" },
          { type: "image", key: "image", label: "صورة التبويب" },
          { type: "l", key: "hq", label: "اسم المقر الرئيسي" },
          { type: "l", key: "hqTask", label: "شنو يسوي الفريق بالمقر" },
          { type: "image", key: "hqImage", label: "صورة المقر" },
          {
            type: "list",
            key: "branches",
            label: "الفروع (صور الفريق تنسحب من قسم فريق ماجك)",
            titleKey: "name",
            addLabel: "إضافة فرع",
            item: [
              { type: "l", key: "name", label: "اسم الفرع" },
              { type: "l", key: "task", label: "شنو يسوي الفريق بالفرع", multiline: true },
              { type: "number", key: "people", label: "عدد موظفي ماجك بالفرع" },
              { type: "image", key: "image", label: "صورة الفرع" },
            ],
          },
          { type: "list", key: "steps", label: "خطوات العمل", titleKey: "title", addLabel: "إضافة خطوة", item: [{ type: "l", key: "title", label: "العنوان" }, { type: "l", key: "body", label: "الوصف", multiline: true }] },
          { type: "l", key: "compareRemote", label: "عنوان عمود المقارنة (الوكالة من بعيد)" },
          { type: "l", key: "compareInside", label: "عنوان عمود المقارنة (فريق ماجك عندك)" },
          { type: "list", key: "compare", label: "المقارنة", titleKey: "label", addLabel: "إضافة صف", item: [{ type: "l", key: "label", label: "النقطة" }, { type: "l", key: "remote", label: "الوكالة من بعيد" }, { type: "l", key: "inside", label: "فريق ماجك عندك" }] },
          { type: "list", key: "stats", label: "الأرقام", titleKey: "value", addLabel: "إضافة رقم", item: [{ type: "l", key: "value", label: "الرقم" }, { type: "l", key: "label", label: "الوصف" }] },
        ],
      },
    ],
  },
  {
    key: "team",
    title: "فريق ماجك",
    description: "قسم \"فريقنا\": النقاط وبطاقات أعضاء الفريق (صورهم تُستخدم أيضاً بخدمة الفريق داخل الشركة).",
    anchor: "team",
    fields: [
      ...head(),
      { type: "list", key: "points", label: "النقاط", titleKey: "title", item: [{ type: "l", key: "title", label: "العنوان" }, { type: "l", key: "body", label: "الوصف", multiline: true }] },
      {
        type: "list",
        key: "members",
        label: "أعضاء الفريق",
        titleKey: "name",
        addLabel: "إضافة عضو",
        item: [
          { type: "l", key: "name", label: "الاسم" },
          { type: "l", key: "role", label: "المنصب" },
          { type: "image", key: "photo", label: "الصورة" },
          { type: "color", key: "color", label: "لون المؤشر" },
        ],
      },
    ],
  },
  {
    key: "cases",
    title: "قصص النجاح",
    description: "كل عميل قصة: التحدي ← الفكرة ← التنفيذ ← النتيجة، مع أرقام قبل وبعد (تُستخدم بقسم العصا السحرية).",
    anchor: "cases",
    fields: [
      ...head(),
      {
        type: "list",
        key: "items",
        label: "القصص",
        titleKey: "client",
        addLabel: "إضافة قصة",
        item: [
          { type: "text", key: "id", label: "المعرّف (إنكليزي بدون فراغات)", ltr: true },
          { type: "text", key: "client", label: "اسم العميل", ltr: true },
          { type: "image", key: "logo", label: "شعار العميل" },
          { type: "l", key: "industry", label: "المجال" },
          { type: "l", key: "duration", label: "مدة العمل" },
          { type: "color", key: "color", label: "لون القصة" },
          { type: "l", key: "headline", label: "عنوان القصة", multiline: true },
          { type: "image", key: "cover", label: "صورة الغلاف" },
          chapter("challenge", "١. التحدي"),
          chapter("idea", "٢. الفكرة"),
          chapter("execution", "٣. التنفيذ"),
          chapter("result", "٤. النتيجة"),
          {
            type: "list",
            key: "metrics",
            label: "الأرقام قبل / بعد",
            titleKey: "label",
            addLabel: "إضافة رقم",
            item: [
              { type: "l", key: "label", label: "اسم المؤشر" },
              { type: "number", key: "before", label: "قبل ماجك", step: 0.1 },
              { type: "number", key: "after", label: "بعد ماجك", step: 0.1 },
              { type: "text", key: "prefix", label: "قبل الرقم (مثل $)", ltr: true },
              { type: "text", key: "suffix", label: "بعد الرقم (مثل % أو x)", ltr: true },
              { type: "number", key: "decimals", label: "عدد المراتب العشرية" },
              { type: "bool", key: "lowerIsBetter", label: "الأقل أفضل (مثل التكلفة)" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "beforeAfter",
    title: "قبل وبعد ماجك",
    description: "نصوص قسم العصا السحرية. الأرقام نفسها تنسحب من قصص النجاح.",
    anchor: "beforeAfter",
    fields: [
      ...head(),
      { type: "l", key: "beforeLabel", label: "تسمية \"قبل\"" },
      { type: "l", key: "afterLabel", label: "تسمية \"بعد\"" },
      { type: "l", key: "button", label: "نص زر العصا" },
      { type: "l", key: "reset", label: "نص زر الإعادة" },
    ],
  },
  {
    key: "manifesto",
    title: "البيان",
    description: "الجملة الكبيرة على الخلفية الوردية.",
    anchor: "manifesto",
    fields: [
      { type: "l", key: "line1", label: "السطر الأول" },
      { type: "l", key: "line2", label: "السطر الثاني" },
      { type: "l", key: "line3", label: "السطر الثالث" },
    ],
  },
  {
    key: "services",
    title: "الخدمات",
    description: "خدمات التسويق وإدارة الحملات.",
    anchor: "services",
    fields: [
      ...head(),
      {
        type: "list",
        key: "items",
        label: "الخدمات",
        titleKey: "title",
        addLabel: "إضافة خدمة",
        item: [
          { type: "image", key: "image", label: "صورة البطاقة (يفضّل 4:3)" },
          { type: "l", key: "title", label: "اسم الخدمة" },
          { type: "l", key: "body", label: "الوصف", multiline: true },
          { type: "l", key: "tags", label: "الوسوم (افصل بفاصلة)" },
          { type: "color", key: "color", label: "لون البطاقة" },
          { type: "icon", key: "icon", label: "الأيقونة", icons: SERVICE_ICONS },
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "التواصل",
    description: "قسم التواصل والنموذج.",
    anchor: "contact",
    fields: [
      ...head(),
      { type: "l", key: "button", label: "نص زر الإرسال" },
      { type: "l", key: "success", label: "رسالة النجاح" },
      { type: "lList", key: "serviceOptions", label: "خيارات \"شنو تحتاج؟\"" },
    ],
  },
  {
    key: "presentations",
    title: "العروض المخصصة",
    description: "سوّي عرض خاص لكل عميل: اختار الأقسام والقصص، وانسخ الرابط.",
    fields: [
      {
        type: "list",
        key: "__root",
        label: "العروض",
        titleKey: "client",
        addLabel: "عرض جديد",
        item: [
          { type: "text", key: "slug", label: "رابط العرض (إنكليزي، مثل: clinic-pitch)", ltr: true },
          { type: "text", key: "client", label: "اسم العميل", ltr: true },
          { type: "image", key: "clientLogo", label: "شعار العميل (اختياري)" },
          { type: "l", key: "note", label: "ملاحظة بالغلاف" },
          { type: "multi", key: "sections", label: "الأقسام بالترتيب", source: "sections" },
          { type: "multi", key: "caseIds", label: "القصص المعروضة (فارغ = الكل)", source: "cases" },
        ],
      },
    ],
  },
  {
    key: "settings",
    title: "الإعدادات العامة",
    description: "معلومات التواصل، السوشيال ميديا، وعنوان الموقع بمحركات البحث.",
    fields: [
      { type: "text", key: "siteName", label: "اسم الموقع", ltr: true },
      { type: "l", key: "seoTitle", label: "عنوان الصفحة (SEO)" },
      { type: "l", key: "seoDescription", label: "وصف الصفحة (SEO)", multiline: true },
      { type: "text", key: "email", label: "البريد الإلكتروني", ltr: true },
      { type: "text", key: "phone", label: "رقم الهاتف", ltr: true },
      { type: "text", key: "whatsapp", label: "رقم الواتساب (أرقام فقط مع رمز الدولة)", ltr: true },
      { type: "l", key: "address", label: "العنوان" },
      { type: "text", key: "instagram", label: "رابط إنستغرام", ltr: true },
      { type: "text", key: "tiktok", label: "رابط تيك توك", ltr: true },
      { type: "text", key: "linkedin", label: "رابط لينكدإن", ltr: true },
      { type: "l", key: "notice", label: "شارة الملاحظة أسفل الموقع (اتركها فارغة لإخفائها)" },
    ],
  },
];

export const getSchema = (key: string) => SCHEMAS.find((s) => s.key === key);

/** Default value for a new item. */
export function blank(fields: Field[]): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const f of fields) {
    switch (f.type) {
      case "l":
        o[f.key] = { ar: "", en: "" };
        break;
      case "number":
        o[f.key] = 0;
        break;
      case "bool":
        o[f.key] = false;
        break;
      case "color":
        o[f.key] = "orchid";
        break;
      case "icon":
        o[f.key] = f.icons[0];
        break;
      case "multi":
      case "list":
      case "lList":
        o[f.key] = [];
        break;
      case "group":
        o[f.key] = blank(f.fields);
        break;
      default:
        o[f.key] = "";
    }
  }
  return o;
}
