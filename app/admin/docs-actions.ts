"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { DOC_ROUTE, DOC_TYPES, invoiceFromQuote, newDoc, type Doc, type DocType } from "@/lib/docs";
import { getDoc, getDocs, nextDocNumber, putDoc, removeDoc } from "@/lib/store";

const refresh = (type: DocType) => revalidatePath(`/admin/${DOC_ROUTE[type]}`, "layout");

export async function createDoc(type: DocType) {
  await requireAdmin();
  if (!DOC_TYPES.includes(type)) return;
  const [prev] = await getDocs(type);
  const doc = newDoc(type, await nextDocNumber(type), prev);
  await putDoc(doc);
  refresh(type);
  redirect(`/admin/${DOC_ROUTE[type]}/${doc.id}`);
}

export async function saveDoc(doc: Doc) {
  await requireAdmin();
  const current = await getDoc(doc?.id);
  if (!current || current.type !== doc.type) return { ok: false, error: "المستند غير موجود" };
  if (!doc.number?.trim()) return { ok: false, error: "المستند يحتاج رقم" };
  await putDoc({ ...doc, createdAt: current.createdAt, updatedAt: new Date().toISOString() });
  refresh(doc.type);
  return { ok: true };
}

export async function duplicateDoc(id: string) {
  await requireAdmin();
  const src = await getDoc(id);
  if (!src) return;
  const now = new Date().toISOString();
  const copy = { ...structuredClone(src), id: crypto.randomUUID(), number: await nextDocNumber(src.type), createdAt: now, updatedAt: now } as Doc;
  if (copy.type === "quote") copy.status = "draft";
  if (copy.type === "invoice") copy.paid = 0;
  await putDoc(copy);
  refresh(src.type);
  redirect(`/admin/${DOC_ROUTE[src.type]}/${copy.id}`);
}

export async function convertQuote(id: string) {
  await requireAdmin();
  const q = await getDoc(id);
  if (q?.type !== "quote") return;
  const [prev] = await getDocs("invoice");
  const inv = invoiceFromQuote(q, await nextDocNumber("invoice"), prev);
  await putDoc(inv);
  if (q.status !== "accepted") await putDoc({ ...q, status: "accepted", updatedAt: new Date().toISOString() });
  refresh("quote");
  refresh("invoice");
  redirect(`/admin/invoices/${inv.id}`);
}

export async function deleteDoc(id: string) {
  await requireAdmin();
  const d = await getDoc(id);
  if (!d) return;
  await removeDoc(id);
  refresh(d.type);
}
