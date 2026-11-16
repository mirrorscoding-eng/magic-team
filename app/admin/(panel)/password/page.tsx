import { requireAdmin } from "@/lib/auth";
import { PasswordForm } from "@/components/admin/PasswordForm";

export default async function PasswordPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">كلمة المرور</h1>
      <p className="mt-1 text-sm text-lilac/60">غيّر كلمة مرور الدخول للوحة التحكم. بعد التغيير ينسجل خروج كل الأجهزة الثانية.</p>
      <PasswordForm />
    </div>
  );
}
