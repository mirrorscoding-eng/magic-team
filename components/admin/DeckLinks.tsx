"use client";
import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};
import { Icon } from "@/components/brand/Icon";
import { tip } from "@/lib/tip";
import type { Presentation } from "@/lib/types";

export function DeckLinks({ decks }: { decks: Presentation[] }) {
  const [copied, setCopied] = useState("");
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1800);
  };
  if (!decks.length) return null;
  return (
    <div className="mx-auto mt-8 max-w-5xl">
      <h2 className="mb-3 text-lg font-bold">روابط العروض المحفوظة</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {decks.map((d) =>
          (["ar", "en"] as const).map((l) => {
            const path = `/${l}/present/${d.slug}`;
            const full = `${origin}${path}`;
            return (
              <div key={d.slug + l} className="card flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orchid/15 font-latin text-xs font-bold text-orchid">{l.toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-latin font-bold">{d.client}</div>
                  <div className="truncate font-latin text-xs text-lilac/50" dir="ltr">{path}</div>
                </div>
                <button {...tip("نسخ الرابط", "ينسخ رابط العرض حتى تلصقه برسالة للعميل (واتساب، إيميل...).")} onClick={() => copy(full)} className="rounded-lg px-3 py-2 text-xs text-lilac/80 hover:bg-white/10">
                  {copied === full ? "تم النسخ" : "نسخ"}
                </button>
                <a href={path} target="_blank" {...tip("فتح العرض", "يفتح العرض بتبويب جديد مثل ما يشوفه العميل.")} className="grid h-9 w-9 place-items-center rounded-full bg-orchid text-ink" aria-label="فتح">
                  <Icon name="present" className="h-4 w-4" />
                </a>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
