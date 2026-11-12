"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetDemo } from "@/app/admin/actions";

export function ResetDemo() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("راح ترجع كل المحتوى للبيانات التجريبية الأصلية وتنمسح تعديلاتك. متأكد؟")) return;
        start(async () => {
          await resetDemo();
          router.refresh();
        });
      }}
      className="rounded-full border border-orchid/40 px-4 py-2 text-sm text-orchid hover:bg-orchid/10 disabled:opacity-50"
    >
      {pending ? "..." : "استرجاع البيانات التجريبية"}
    </button>
  );
}
