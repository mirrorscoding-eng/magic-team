"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";

type Opts = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};
type Req = Opts & { resolve: (ok: boolean) => void };

let push: ((r: Req) => void) | null = null;

/** Branded replacement for window.confirm(). Resolves true on confirm. */
export function confirmDialog(opts: Opts | string): Promise<boolean> {
  const o = typeof opts === "string" ? { title: opts } : opts;
  if (!push) return Promise.resolve(window.confirm(o.message ? `${o.title}\n\n${o.message}` : o.title));
  return new Promise((resolve) => push!({ ...o, resolve }));
}

/** Mount once in the admin layout. */
export function ConfirmHost() {
  const [req, setReq] = useState<Req | null>(null);
  const [shown, setShown] = useState(false);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    push = (r) => {
      setReq(r);
      requestAnimationFrame(() => setShown(true));
    };
    return () => {
      push = null;
    };
  }, []);

  const close = (ok: boolean) => {
    if (!req) return;
    req.resolve(ok);
    setShown(false);
    setTimeout(() => setReq(null), 180);
  };

  useEffect(() => {
    if (!req) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req]);

  if (!req) return null;
  const danger = req.danger ?? true;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center p-4 transition duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="absolute inset-0 bg-[#12001a]/70 backdrop-blur-sm" onClick={() => close(false)} />
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--line)] bg-ink-2 p-6 shadow-[0_30px_80px_-20px_rgba(235,112,250,.35)] transition duration-200 [transition-timing-function:var(--ease-out)] ${
          shown ? "translate-y-0 scale-100" : "translate-y-3 scale-95"
        }`}
      >
        <div className="pointer-events-none absolute -top-16 start-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-orchid/25 blur-3xl rtl:translate-x-1/2" />
        <div className="relative">
          <div
            className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${
              danger ? "bg-orchid/15 text-orchid" : "bg-cyan/15 text-cyan"
            }`}
          >
            <Icon name={danger ? "close" : "spark"} className="h-5 w-5" />
          </div>
          <h2 id="confirm-title" className="text-lg font-bold text-white">
            {req.title}
          </h2>
          {req.message && <p className="mt-2 text-sm leading-relaxed text-lilac/70">{req.message}</p>}
          <div className="mt-6 flex gap-2">
            <button
              ref={okRef}
              type="button"
              onClick={() => close(true)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                danger ? "bg-orchid focus-visible:outline-orchid" : "bg-lilac focus-visible:outline-lilac"
              }`}
            >
              {req.confirmLabel ?? (danger ? "حذف" : "تأكيد")}
            </button>
            <button
              type="button"
              onClick={() => close(false)}
              className="flex-1 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-lilac transition hover:border-orchid hover:text-white"
            >
              {req.cancelLabel ?? "إلغاء"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
