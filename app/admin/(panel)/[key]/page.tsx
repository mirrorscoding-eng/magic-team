import { notFound } from "next/navigation";
import { DeckLinks } from "@/components/admin/DeckLinks";
import { Editor } from "@/components/admin/Editor";
import { requireAdmin } from "@/lib/auth";
import { getSchema } from "@/lib/schema";
import { getContent } from "@/lib/store";
import { SECTION_KEYS, SECTION_LABELS, type ContentKey } from "@/lib/types";

export default async function EditPage({ params }: PageProps<"/admin/[key]">) {
  await requireAdmin();
  const { key } = await params;
  const schema = getSchema(key);
  if (!schema) notFound();
  const content = await getContent();
  const k = key as ContentKey;
  const initial = k === "presentations" ? { __root: content.presentations } : (content[k] as unknown as Record<string, unknown>);
  const options = {
    sections: SECTION_KEYS.map((s) => ({ value: s, label: SECTION_LABELS[s].ar })),
    cases: content.cases.items.map((c) => ({ value: c.id, label: c.client })),
  };
  return (
    <>
      <Editor key={k} schemaKey={k} initial={initial} options={options} />
      {k === "presentations" && <DeckLinks decks={content.presentations} />}
    </>
  );
}
