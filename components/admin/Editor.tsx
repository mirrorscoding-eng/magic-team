"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveKey } from "@/app/admin/actions";
import { Icon } from "@/components/brand/Icon";
import type { EditorSchema } from "@/lib/schema";
import { getSchema } from "@/lib/schema";
import { pageOf } from "@/lib/pages";
import type { ContentKey, SectionKey } from "@/lib/types";
import { Fields, type Options } from "./SchemaForm";

type Obj = Record<string, unknown>;

export function Editor({ schemaKey, initial, options }: { schemaKey: ContentKey; initial: Obj; options: Options }) {
  const schema = getSchema(schemaKey) as EditorSchema;
  const [value, setValue] = useState<Obj>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const dirty = JSON.stringify(value) !== saved;

  const save = useCallback(() => {
    start(async () => {
      const payload = "__root" in value ? value.__root : value;
      const res = await saveKey(schemaKey, payload);
      if (res.ok) {
        setSaved(JSON.stringify(value));
        setToast({ ok: true, msg: "تم الحفظ ونُشر على الموقع ✨" });
        router.refresh();
      } else setToast({ ok: false, msg: res.error ?? "صار خطأ" });
      setTimeout(() => setToast(null), 3200);
    });
  }, [schemaKey, value, router]);

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

  return (
    <div className="mx-auto max-w-5xl">
      <header className="sticky top-0 z-30 -mx-4 mb-8 flex flex-wrap items-center gap-4 border-b border-[var(--line)] bg-ink/85 px-4 py-4 backdrop-blur md:-mx-10 md:px-10 lg:top-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{schema.title}</h1>
          <p className="mt-1 text-sm text-lilac/60">{schema.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {schema.anchor && (
            <a href={`/ar${pageOf(schema.anchor as SectionKey) ? `/${pageOf(schema.anchor as SectionKey)}` : ""}#${schema.anchor}`} target="_blank" className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-lilac hover:border-orchid hover:text-white">
              <Icon name="globe" className="h-4 w-4" /> معاينة
            </a>
          )}
          {dirty && (
            <button onClick={() => setValue(JSON.parse(saved))} className="rounded-full px-4 py-2.5 text-sm text-lilac/70 hover:text-white">
              تراجع
            </button>
          )}
          <button onClick={save} disabled={!dirty || pending} className="btn btn-primary py-2.5! disabled:opacity-40 disabled:shadow-none">
            {pending ? "جاري الحفظ..." : dirty ? "حفظ ونشر" : "محفوظ"}
            <span className="arrow"><Icon name="check" className="h-4 w-4" strokeWidth={2.5} /></span>
          </button>
        </div>
      </header>
      <div className="card p-5 md:p-8">
        <Fields fields={schema.fields} value={value} onChange={setValue} options={options} />
      </div>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl ${toast.ok ? "bg-green text-ink" : "bg-orchid text-ink"}`} role="status" style={{ animation: "storyIn .5s cubic-bezier(.16,1,.3,1)" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
