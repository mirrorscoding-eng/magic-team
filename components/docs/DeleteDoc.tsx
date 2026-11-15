"use client";
import { useTransition } from "react";
import { deleteDoc } from "@/app/admin/docs-actions";
import { confirmDialog } from "@/components/admin/ConfirmDialog";
import { Icon } from "@/components/brand/Icon";
import { tip } from "@/lib/tip";

export function DeleteDoc({ id, label }: { id: string; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (await confirmDialog({ title: `حذف ${label}؟`, message: "ينحذف نهائياً وما يرجع.", confirmLabel: "حذف", danger: true })) start(() => deleteDoc(id));
      }}
      {...tip("حذف", "يحذف المستند نهائياً بعد ما تأكد.")}
      className="grid h-9 w-9 place-items-center rounded-full text-lilac/60 hover:bg-orchid/20 hover:text-orchid disabled:opacity-40"
      aria-label="حذف"
    >
      <Icon name="close" className="h-4 w-4" />
    </button>
  );
}
