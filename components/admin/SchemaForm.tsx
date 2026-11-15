"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { confirmDialog } from "@/components/admin/ConfirmDialog";
import { tip } from "@/lib/tip";
import { BRAND_COLORS, blank, type Field } from "@/lib/schema";
import type { L } from "@/lib/types";
import { VIDEO_LABEL, canAmbient, parseVideo, posterOf } from "@/lib/video";

export type Options = {
  sections: { value: string; label: string }[];
  cases: { value: string; label: string }[];
  projects: { value: string; label: string }[];
};

type Obj = Record<string, unknown>;

export const inputCls =
  "w-full rounded-xl border border-[var(--line)] bg-ink/60 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-lilac/30 focus:border-orchid focus:bg-ink";

const SAVE_NOTE = "التعديل ما يطلع على الموقع إلا بعد ما تضغط «حفظ ونشر» فوق.";

/** Plain-language "how do I use this" for each kind of field, shown on hover. */
const TYPE_HELP: Record<Field["type"], string> = {
  l: "اكتب النص بالعربي بالخانة اللي عليها «ع»، وبالإنكليزي بالخانة اللي عليها «EN». الموقع يعرض اللغة حسب الزائر.",
  text: "اكتب القيمة مباشرة داخل الخانة.",
  number: "اكتب رقم، أو استخدم الأسهم الصغيرة داخل الخانة حتى تزيد أو تنقص.",
  range: "اسحب الدائرة يمين أو يسار. الرقم جنبها يوضح القيمة الحالية.",
  bool: "اضغط على المفتاح حتى تشغّله أو تطفيه: الأخضر = شغّال، الرمادي = طافي.",
  image: "اضغط «رفع صورة» واختار صورة من جهازك، أو اسحب الصورة وافلتها على المربع، أو الصق رابط صورة بالخانة.",
  video: "اضغط «رفع فيديو» واختار ملف من جهازك، أو الصق رابط يوتيوب / فيميو / تيك توك / انستغرام بالخانة.",
  select: "اضغط على الخانة واختار من القائمة.",
  color: "اضغط على الدائرة باللون اللي تريده. اللون المختار يطلع حوله إطار أبيض.",
  icon: "اضغط على الأيقونة المناسبة. الأيقونة المختارة تتلون بالوردي.",
  multi: "اضغط على أي خيار عليه + حتى تضيفه. الترتيب يكون حسب ما تضيف، واضغط × على أي خيار حتى تشيله.",
  group: "مجموعة خانات مرتبطة ببعض، عدّل اللي تحتاجه منها.",
  list: "اضغط على اسم أي عنصر حتى تفتحه وتعدله. غيّر الترتيب بالسحب من ⋮⋮ أو بالأسهم، وزر «+ إضافة» بالأسفل يضيف عنصر جديد.",
  lList: "كل خيار مكتوب بلغتين. «+ إضافة خيار» يضيف واحد جديد، وزر × يحذفه.",
};

const fieldTip = (f: Field) => tip(f.label, `${f.help ?? TYPE_HELP[f.type]} ${SAVE_NOTE}`);

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-lilac/70">
      <span>{children}</span>
      <HelpDot />
    </div>
  );
}

/** Small "?" that tells people hovering is worthwhile. */
function HelpDot() {
  return (
    <span aria-hidden className="grid h-4 w-4 shrink-0 cursor-help place-items-center rounded-full border border-lilac/25 font-latin text-[9px] font-bold text-lilac/50">
      ?
    </span>
  );
}

function LInput({ value, onChange, multiline }: { value: L; onChange: (v: L) => void; multiline?: boolean }) {
  const v = value ?? { ar: "", en: "" };
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <div className="relative">
        <span className="pointer-events-none absolute end-3 top-2.5 text-[10px] font-bold text-orchid/70">ع</span>
        <Tag {...tip("النص بالعربي", "هذا اللي يشوفه الزائر لما يكون الموقع بالعربي.")} className={`${inputCls} pe-8`} rows={3} value={v.ar} onChange={(e) => onChange({ ...v, ar: e.target.value })} dir="rtl" />
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute end-3 top-2.5 text-[10px] font-bold text-cyan/70" dir="ltr">EN</span>
        <Tag {...tip("النص بالإنكليزي", "هذا اللي يشوفه الزائر لما يكون الموقع بالإنكليزي.")} className={`${inputCls} pe-10 font-latin`} rows={3} value={v.en} onChange={(e) => onChange({ ...v, en: e.target.value })} dir="ltr" />
      </div>
    </div>
  );
}

/** Streams the raw file to /api/upload (no multipart) so large videos work, with progress. */
function uploadFile(f: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Content-Type", f.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let j: { url?: string; error?: string } = {};
      try {
        j = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && j.url) resolve(j.url);
      else reject(new Error(j.error || "فشل الرفع"));
    };
    xhr.onerror = () => reject(new Error("انقطع الاتصال أثناء الرفع"));
    xhr.send(f);
  });
}

function useUpload(onChange: (v: string) => void) {
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const upload = async (f: File) => {
    setPct(0);
    setErr("");
    try {
      onChange(await uploadFile(f, setPct));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setPct(null);
    }
  };
  return { busy: pct !== null, pct, err, upload };
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { busy, err, upload } = useUpload(onChange);
  const file = useRef<HTMLInputElement>(null);
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--line)] bg-ink/40 p-2.5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) upload(f);
      }}
    >
      <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#2c0532_0_25%,#200024_0_50%)] bg-[length:14px_14px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" className="max-h-full max-w-full object-contain" /> : <Icon name="camera" className="h-6 w-6 text-lilac/30" />}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input className={`${inputCls} py-2! font-latin text-xs!`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="رابط الصورة أو ارفع ملف" dir="ltr" {...tip("رابط الصورة", "إذا الصورة موجودة على الإنترنت الصق رابطها هنا. إذا رفعت صورة، رابطها يطلع هنا تلقائياً.")} />
        <div className="flex items-center gap-2">
          <button type="button" {...tip("رفع صورة", "يفتح ملفات جهازك حتى تختار صورة (JPG أو PNG أو SVG). تگدر هم تسحب الصورة وتفلتها على المربع.")} onClick={() => file.current?.click()} disabled={busy} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 disabled:opacity-50">
            {busy ? "جاري الرفع..." : "رفع صورة"}
          </button>
          {value && (
            <button type="button" {...tip("إزالة", "يشيل الملف من هذي الخانة فقط، وما ينحذف من الموقع إلا بعد «حفظ ونشر».")} onClick={() => onChange("")} className="rounded-lg px-2 py-1.5 text-xs text-lilac/60 hover:text-orchid">
              إزالة
            </button>
          )}
          {err && <span className="text-xs text-orchid">{err}</span>}
        </div>
        <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
    </div>
  );
}

/** A video is either an uploaded file or a pasted YouTube / Vimeo / TikTok / Instagram link. */
function VideoInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { busy, pct, err, upload } = useUpload(onChange);
  const file = useRef<HTMLInputElement>(null);
  const v = parseVideo(value);
  const thumb = posterOf(value, "");
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--line)] bg-ink/40 p-2.5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) upload(f);
      }}
    >
      <div className="relative grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-2">
        {v?.kind === "file" ? (
          <video src={v.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
        ) : thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name="present" className="h-6 w-6 text-lilac/30" />
        )}
        {v && <span className="absolute bottom-1 start-1 rounded bg-ink/80 px-1.5 py-0.5 font-latin text-[9px] font-bold text-green">{VIDEO_LABEL[v.kind]}</span>}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          className={`${inputCls} py-2! font-latin text-xs!`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=…  أو  tiktok / instagram / vimeo  أو ارفع ملف"
          dir="ltr"
          {...tip("رابط الفيديو", "انسخ رابط الفيديو من يوتيوب أو فيميو أو تيك توك أو انستغرام والصقه هنا. إذا رفعت ملف، رابطه يطلع هنا تلقائياً.")}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" {...tip("رفع فيديو", "يفتح ملفات جهازك حتى تختار فيديو (mp4 أو mov أو webm). الفيديوهات الكبيرة تاخذ وقت، انتظر لحد ما يكمل الشريط الأخضر.")} onClick={() => file.current?.click()} disabled={busy} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 disabled:opacity-50">
            {busy ? `جاري الرفع ${pct ?? 0}%` : "رفع فيديو (mp4 / mov / webm)"}
          </button>
          {value && (
            <button type="button" {...tip("إزالة", "يشيل الملف من هذي الخانة فقط، وما ينحذف من الموقع إلا بعد «حفظ ونشر».")} onClick={() => onChange("")} className="rounded-lg px-2 py-1.5 text-xs text-lilac/60 hover:text-orchid">
              إزالة
            </button>
          )}
          {value && !v && <span className="text-xs text-yellow">الرابط مو مدعوم — استخدم يوتيوب، فيميو، تيك توك، انستغرام، أو ملف فيديو</span>}
          {v && v.kind !== "file" && !canAmbient(v) && <span className="text-xs text-lilac/50">{VIDEO_LABEL[v.kind]} ما يشتغل تلقائياً: تطلع صورة الغلاف وينفتح بالضغط</span>}
          {err && <span className="text-xs text-orchid">{err}</span>}
        </div>
        {busy && (
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-green transition-all" style={{ width: `${pct ?? 0}%` }} />
          </div>
        )}
        <input ref={file} type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
    </div>
  );
}

function MultiInput({ value, onChange, options }: { value: string[]; onChange: (v: string[]) => void; options: { value: string; label: string }[] }) {
  const v = value ?? [];
  const toggle = (k: string) => onChange(v.includes(k) ? v.filter((x) => x !== k) : [...v, k]);
  return (
    <div className="flex flex-wrap gap-2">
      {v.map((k, i) => {
        const o = options.find((x) => x.value === k);
        return (
          <span key={k} className="flex items-center gap-1 rounded-full bg-orchid py-1 ps-3 pe-1 text-xs font-bold text-ink">
            <span className="opacity-60">{i + 1}.</span> {o?.label ?? k}
            <button type="button" {...tip("إزالة", `يشيل «${o?.label ?? k}» من الاختيارات.`)} onClick={() => toggle(k)} className="grid h-5 w-5 place-items-center rounded-full hover:bg-ink/15" aria-label="إزالة">
              <Icon name="close" className="h-3 w-3" strokeWidth={3} />
            </button>
          </span>
        );
      })}
      {options
        .filter((o) => !v.includes(o.value))
        .map((o) => (
          <button key={o.value} type="button" {...tip(`إضافة «${o.label}»`, "يضيفه آخر القائمة المختارة.")} onClick={() => toggle(o.value)} className="rounded-full border border-dashed border-[var(--line)] px-3 py-1 text-xs text-lilac/70 hover:border-orchid hover:text-white">
            + {o.label}
          </button>
        ))}
    </div>
  );
}

function itemTitle(item: Obj, key?: string) {
  if (!key) return "";
  const v = item?.[key];
  if (typeof v === "string") return v;
  if (v && typeof v === "object") return (v as L).ar || (v as L).en || "";
  return "";
}

function ListInput({ field, value, onChange, options }: { field: Extract<Field, { type: "list" }>; value: Obj[]; onChange: (v: Obj[]) => void; options: Options }) {
  const list = value ?? [];
  const [open, setOpen] = useState<number | null>(list.length <= 3 ? -1 : null);
  const [drag, setDrag] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  const isOpen = (i: number) => open === -1 || open === i;
  const full = field.max !== undefined && list.length >= field.max;
  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => setDrag(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (drag !== null && drag !== i) move(drag, i);
            setDrag(null);
          }}
          className={`rounded-2xl border bg-white/[.02] transition ${drag === i ? "border-orchid opacity-50" : "border-[var(--line)]"}`}
        >
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="cursor-grab select-none px-1 text-lilac/40" {...tip("سحب لإعادة الترتيب", "اضغط هنا وخلّي الماوس مضغوط، واسحب العنصر فوق أو جوّه وافلته بمكانه الجديد.")}>⋮⋮</span>
            <button type="button" {...tip(isOpen(i) ? "إغلاق العنصر" : "فتح العنصر", isOpen(i) ? "يطوي الخانات حتى تصير القائمة أرتب." : "يفتح خانات هذا العنصر حتى تعدّلها.")} onClick={() => setOpen(isOpen(i) ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-start">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 font-latin text-[11px] font-bold">{i + 1}</span>
              <span className="truncate text-sm font-semibold">{itemTitle(item, field.titleKey) || "عنصر جديد"}</span>
              <Icon name="chevL" className={`ms-auto h-4 w-4 text-lilac/50 transition ${isOpen(i) ? "-rotate-90" : ""}`} />
            </button>
            <div className="flex items-center">
              <button type="button" {...tip("تحريك لفوق", "ينقل العنصر خطوة وحدة لفوق. الترتيب هنا هو نفس ترتيبه بالموقع.")} onClick={() => move(i, i - 1)} className="rounded-lg p-1.5 text-lilac/60 hover:bg-white/10 hover:text-white disabled:opacity-20" disabled={i === 0}>
                <Icon name="chevR" className="h-4 w-4 -rotate-90" />
              </button>
              <button type="button" {...tip("تحريك لجوّه", "ينقل العنصر خطوة وحدة لجوّه. الترتيب هنا هو نفس ترتيبه بالموقع.")} onClick={() => move(i, i + 1)} className="rounded-lg p-1.5 text-lilac/60 hover:bg-white/10 hover:text-white disabled:opacity-20" disabled={i === list.length - 1}>
                <Icon name="chevR" className="h-4 w-4 rotate-90" />
              </button>
              <button type="button" {...tip("نسخ العنصر", full ? "وصلت للحد الأعلى، احذف عنصر حتى تگدر تنسخ." : "يسوي نسخة طبق الأصل تحته، حتى تعدّل عليها بدل ما تبدي من الصفر.")} disabled={full} onClick={() => onChange([...list.slice(0, i + 1), structuredClone(item), ...list.slice(i + 1)])} className="rounded-lg p-1.5 text-lilac/60 hover:bg-white/10 hover:text-white disabled:opacity-20">
                <Icon name="grid" className="h-4 w-4" />
              </button>
              <button
                type="button"
                {...tip("حذف العنصر", "يسألك أول قبل ما يحذف. الحذف ما يتثبت بالموقع إلا بعد «حفظ ونشر».")}
                onClick={async () => {
                  const name = itemTitle(item, field.titleKey);
                  const ok = await confirmDialog({
                    title: name ? `حذف «${name}»؟` : "حذف هذا العنصر؟",
                    message: "راح ينشال من القائمة. التغيير ما يتثبت بالموقع إلا بعد «حفظ ونشر».",
                  });
                  if (ok) onChange(list.filter((_, j) => j !== i));
                }}
                className="rounded-lg p-1.5 text-lilac/60 hover:bg-orchid/20 hover:text-orchid"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          </div>
          {isOpen(i) && (
            <div className="border-t border-[var(--line)] p-4">
              <Fields fields={field.item} value={item} onChange={(v) => onChange(list.map((x, j) => (j === i ? v : x)))} options={options} />
            </div>
          )}
        </div>
      ))}
      {full ? (
        <p {...tip("وصلت للحد الأعلى", "هذي القائمة بيها عدد محدود حتى يبقى الموقع مرتب.")} className="rounded-2xl border border-dashed border-[var(--line)] py-3 text-center text-sm text-lilac/50">وصلت للحد الأعلى ({field.max}) — احذف وحدة حتى تضيف غيرها</p>
      ) : (
        <button
          type="button"
          {...tip(field.addLabel ?? "إضافة", "يضيف عنصر جديد فارغ آخر القائمة ويفتحه حتى تعبّيه.")}
          onClick={() => {
            onChange([...list, blank(field.item)]);
            setOpen(list.length);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--line)] py-3 text-sm font-semibold text-lilac/70 transition hover:border-orchid hover:text-white"
        >
          + {field.addLabel ?? "إضافة"}
        </button>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange, options }: { field: Field; value: unknown; onChange: (v: unknown) => void; options: Options }) {
  switch (field.type) {
    case "l":
      return <LInput value={value as L} onChange={onChange} multiline={field.multiline} />;
    case "text":
      return <input className={`${inputCls} ${field.ltr ? "font-latin" : ""}`} dir={field.ltr ? "ltr" : undefined} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "number":
      return <input type="number" step={field.step ?? 1} className={`${inputCls} font-latin`} dir="ltr" value={Number.isFinite(value as number) ? (value as number) : 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
    case "range": {
      const v = Number.isFinite(value as number) ? (value as number) : Math.round((field.min + field.max) / 2);
      return (
        <div className="rounded-xl border border-[var(--line)] bg-white/[.03] px-4 py-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              value={v}
              onChange={(e) => onChange(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer accent-[var(--orchid)]"
            />
            <span className="font-latin w-14 text-end text-sm font-semibold tabular-nums text-white" dir="ltr">
              {v}
              {field.unit ?? ""}
            </span>
          </div>
          {field.ends && (
            <div className="mt-1 flex justify-between pe-[4.5rem] text-xs text-lilac/50">
              <span>{field.ends[0]}</span>
              <span>{field.ends[1]}</span>
            </div>
          )}
        </div>
      );
    }
    case "bool":
      return (
        <button type="button" role="switch" aria-checked={!!value} {...tip(value ? "شغّال حالياً" : "طافي حالياً", value ? "اضغط حتى تطفيه." : "اضغط حتى تشغّله.")} onClick={() => onChange(!value)} className={`relative h-7 w-12 rounded-full transition ${value ? "bg-green" : "bg-white/15"}`}>
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "start-6 bg-ink!" : "start-1"}`} />
        </button>
      );
    case "image":
      return <ImageInput value={(value as string) ?? ""} onChange={onChange} />;
    case "video":
      return <VideoInput value={(value as string) ?? ""} onChange={onChange} />;
    case "select": {
      const opts = options[field.source] ?? [];
      const v = (value as string) ?? "";
      return (
        <select className={`${inputCls} font-latin`} value={v} onChange={(e) => onChange(e.target.value)}>
          <option value="">{field.empty ?? "—"}</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          {v && !opts.some((o) => o.value === v) && <option value={v}>{v} (محذوف)</option>}
        </select>
      );
    }
    case "color":
      return (
        <div className="flex flex-wrap gap-2">
          {BRAND_COLORS.map((c) => (
            <button key={c.value} type="button" {...tip(`اللون ${c.label}`, value === c.value ? "هذا اللون المختار حالياً." : "اضغط حتى تختار هذا اللون.")} onClick={() => onChange(c.value)} className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-ink transition ${value === c.value ? "ring-2 ring-white scale-110" : "hover:scale-105"}`} style={{ background: c.hex }} aria-label={c.label} />
          ))}
        </div>
      );
    case "icon":
      return (
        <div className="flex flex-wrap gap-1.5">
          {field.icons.map((ic) => (
            <button key={ic} type="button" {...tip(value === ic ? "الأيقونة المختارة" : "اختيار هذي الأيقونة", "الأيقونة تطلع جنب العنوان بالموقع.")} onClick={() => onChange(ic)} className={`grid h-10 w-10 place-items-center rounded-xl border transition ${value === ic ? "border-orchid bg-orchid text-ink" : "border-[var(--line)] text-lilac/70 hover:text-white"}`} aria-label={ic}>
              <Icon name={ic} />
            </button>
          ))}
        </div>
      );
    case "multi":
      return <MultiInput value={value as string[]} onChange={onChange} options={options[field.source]} />;
    case "group":
      return (
        <div className="rounded-2xl border border-[var(--line)] bg-white/[.02] p-4">
          <Fields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} options={options} />
        </div>
      );
    case "list":
      return <ListInput field={field} value={value as Obj[]} onChange={onChange} options={options} />;
    case "lList": {
      const list = (value as L[]) ?? [];
      return (
        <div className="space-y-2">
          {list.map((v, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <LInput value={v} onChange={(nv) => onChange(list.map((x, j) => (j === i ? nv : x)))} />
              </div>
              <button type="button" {...tip("حذف الخيار", "يشيل هذا الخيار من القائمة.")} onClick={() => onChange(list.filter((_, j) => j !== i))} className="mt-1.5 rounded-lg p-2 text-lilac/60 hover:bg-orchid/20 hover:text-orchid" aria-label="حذف">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" {...tip("إضافة خيار", "يضيف خانة جديدة للخيار بالعربي والإنكليزي.")} onClick={() => onChange([...list, { ar: "", en: "" }])} className="rounded-xl border border-dashed border-[var(--line)] px-4 py-2 text-sm text-lilac/70 hover:border-orchid hover:text-white">
            + إضافة خيار
          </button>
        </div>
      );
    }
  }
}

export function Fields({ fields, value, onChange, options }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; options: Options }) {
  const wide = (f: Field) => ["l", "list", "group", "lList", "image", "video", "multi", "icon"].includes(f.type);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={wide(f) ? "md:col-span-2" : ""} {...(f.type === "group" || f.type === "list" ? {} : fieldTip(f))}>
          {f.type === "group" || f.type === "list" ? (
            <div className="mb-2 flex w-fit items-center gap-2 text-sm font-bold text-white" {...fieldTip(f)}>
              <span className="h-4 w-1 rounded-full bg-orchid" />
              {f.label}
              <HelpDot />
            </div>
          ) : (
            <Label>{f.label}</Label>
          )}
          <FieldInput field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} options={options} />
        </div>
      ))}
    </div>
  );
}
