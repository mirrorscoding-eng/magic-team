import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { companyFrom, type DocType } from "@/lib/docs";
import { getContent, getDoc } from "@/lib/store";
import { DocEditor } from "./DocEditor";

export async function DocPage({ type, id }: { type: DocType; id: string }) {
  await requireAdmin();
  const [doc, content] = await Promise.all([getDoc(id), getContent()]);
  if (!doc || doc.type !== type) notFound();
  return <DocEditor key={doc.id} initial={doc} company={companyFrom(content.settings)} />;
}
