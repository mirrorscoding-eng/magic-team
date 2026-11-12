"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { Mark } from "@/components/brand/Logo";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="grain relative flex min-h-dvh items-center justify-center overflow-hidden p-5">
      <div className="aurora" aria-hidden><span className="a1" /><span className="a2" /><span className="a3" /></div>
      <form action={action} className="glass relative w-full max-w-sm rounded-[2rem] p-8">
        <Mark draw className="mx-auto h-14 w-auto text-orchid" id="login-mark" />
        <h1 className="mt-6 text-center text-2xl font-bold">لوحة تحكم ماجك</h1>
        <p className="mt-2 text-center text-sm text-lilac/60">ادخل كلمة المرور للمتابعة</p>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="كلمة المرور"
          className="mt-8 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3.5 text-white outline-none placeholder:text-lilac/40 focus:border-orchid"
        />
        {state?.error && <p className="mt-3 text-sm text-orchid">{state.error}</p>}
        <button disabled={pending} className="btn btn-primary mt-5 w-full justify-center disabled:opacity-60">
          {pending ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
