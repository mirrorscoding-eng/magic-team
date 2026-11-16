"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetDemo } from "@/app/admin/actions";
import { confirmDialog } from "@/components/admin/ConfirmDialog";
import { tip } from "@/lib/tip";

export function ResetDemo() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      {...tip("استرجاع المحتوى الأصلي", "يمسح كل تعديلاتك ويرجّع المحتوى الأصلي. يسألك أول قبل ما يسوي أي شي، وما ينفع التراجع بعده.")}
      onClick={async () => {
        const ok = await confirmDialog({
          title: "استرجاع المحتوى الأصلي؟",
          message: "راح يرجع كل المحتوى للمحتوى الأصلي وتنمسح كل تعديلاتك. ما تگدر تتراجع عن هالخطوة.",
          confirmLabel: "استرجاع",
        });
        if (!ok) return;
        start(async () => {
          await resetDemo();
          router.refresh();
        });
      }}
      className="rounded-full border border-orchid/40 px-4 py-2 text-sm text-orchid hover:bg-orchid/10 disabled:opacity-50"
    >
      {pending ? "..." : "استرجاع المحتوى الأصلي"}
    </button>
  );
}
