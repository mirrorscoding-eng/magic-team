"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveSections } from "@/app/admin/actions";
import { Icon } from "@/components/brand/Icon";
import { tip } from "@/lib/tip";
import { SECTION_LABELS, type SectionKey } from "@/lib/types";

type S = { key: SectionKey; visible: boolean };

export function SectionsManager({ initial }: { initial: S[] }) {
  const [list, setList] = useState(initial);
  const [drag, setDrag] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const router = useRouter();
  const dirty = JSON.stringify(list) !== saved;
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const n = [...list];
    const [x] = n.splice(from, 1);
    n.splice(to, 0, x);
    setList(n);
  };
  return (
    <div className="card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">ترتيب أقسام الموقع</h2>
          <p className="text-sm text-lilac/60">اسحب لتغيير الترتيب، واطفي أي قسم حتى يختفي من الموقع ووضع العرض.</p>
        </div>
        <span className="shrink-0" {...tip(dirty ? "حفظ الترتيب" : "الترتيب محفوظ", dirty ? "يطلّع الترتيب الجديد وإظهار/إخفاء الأقسام على الموقع مباشرة." : "غيّر ترتيب أي قسم أو اطفيه وهذا الزر يتفعّل.")}>
        <button
          disabled={!dirty || pending}
          onClick={() =>
            start(async () => {
              await saveSections(list);
              setSaved(JSON.stringify(list));
              router.refresh();
            })
          }
          className="btn btn-primary shrink-0 py-2.5! disabled:opacity-40 disabled:shadow-none"
        >
          {pending ? "جاري الحفظ..." : dirty ? "حفظ الترتيب" : "محفوظ"}
        </button>
        </span>
      </div>
      <ol className="space-y-2">
        {list.map((s, i) => (
          <li
            key={s.key}
            draggable
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (drag !== null) move(drag, i);
              setDrag(null);
            }}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${drag === i ? "border-orchid opacity-50" : "border-[var(--line)]"} ${s.visible ? "bg-white/[.03]" : "opacity-50"}`}
          >
            <span className="cursor-grab select-none text-lilac/40" {...tip("سحب لإعادة الترتيب", "اضغط وخلّي الماوس مضغوط، واسحب القسم لمكانه الجديد. لا تنسى «حفظ الترتيب».")}>⋮⋮</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 font-latin text-xs font-bold">{i + 1}</span>
            <Link href={`/admin/${s.key}`} {...tip(SECTION_LABELS[s.key].ar, "اضغط حتى تروح لصفحة تعديل محتوى هذا القسم.")} className="flex-1 text-sm font-semibold hover:text-orchid">{SECTION_LABELS[s.key].ar}</Link>
            <button {...tip("تحريك لفوق", "يطلّع القسم خطوة لفوق بالموقع.")} onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded-lg p-1.5 text-lilac/60 hover:bg-white/10 disabled:opacity-20" aria-label="لأعلى"><Icon name="chevR" className="h-4 w-4 -rotate-90" /></button>
            <button {...tip("تحريك لجوّه", "ينزّل القسم خطوة لجوّه بالموقع.")} onClick={() => move(i, i + 1)} disabled={i === list.length - 1} className="rounded-lg p-1.5 text-lilac/60 hover:bg-white/10 disabled:opacity-20" aria-label="لأسفل"><Icon name="chevR" className="h-4 w-4 rotate-90" /></button>
            <button
              role="switch"
              aria-checked={s.visible}
              aria-label="إظهار"
              {...tip(s.visible ? "القسم ظاهر" : "القسم مخفي", s.visible ? "اضغط حتى تخفيه من الموقع ووضع العرض (محتواه ما ينحذف)." : "اضغط حتى يرجع يطلع بالموقع.")}
              onClick={() => setList(list.map((x, j) => (j === i ? { ...x, visible: !x.visible } : x)))}
              className={`relative h-6 w-11 rounded-full transition ${s.visible ? "bg-green" : "bg-white/15"}`}
            >
              <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${s.visible ? "start-6 bg-ink" : "start-1 bg-white"}`} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
