"use client";
import { useActionState, useEffect, useRef } from "react";
import { changePassword } from "@/app/admin/actions";
import { tip } from "@/lib/tip";

const FIELDS = [
  { name: "current", label: "كلمة المرور الحالية", auto: "current-password" },
  { name: "next", label: "كلمة المرور الجديدة", auto: "new-password", hint: "8 أحرف على الأقل." },
  { name: "confirm", label: "تأكيد كلمة المرور الجديدة", auto: "new-password" },
];

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="card mt-8 space-y-5 p-6">
      {FIELDS.map((f) => (
        <label key={f.name} className="block">
          <span className="text-sm font-semibold">{f.label}</span>
          <input
            name={f.name}
            type="password"
            required
            minLength={f.name === "current" ? undefined : 8}
            autoComplete={f.auto}
            dir="ltr"
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 text-white outline-none focus:border-orchid"
          />
          {f.hint && <span className="mt-1.5 block text-xs text-lilac/50">{f.hint}</span>}
        </label>
      ))}
      {state?.error && <p className="text-sm text-orchid">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-300">تم تغيير كلمة المرور. استخدم الجديدة بالدخول الجاي.</p>}
      <button
        disabled={pending}
        {...tip("حفظ كلمة المرور", "يحفظ كلمة المرور الجديدة ويطلّع كل الأجهزة الثانية من اللوحة. هذا الجهاز يبقى داخل.")}
        className="btn btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "تغيير كلمة المرور"}
      </button>
    </form>
  );
}
