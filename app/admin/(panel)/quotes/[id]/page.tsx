import { DocPage } from "@/components/docs/DocPage";

export default async function Page({ params }: PageProps<"/admin/quotes/[id]">) {
  const { id } = await params;
  return <DocPage type="quote" id={id} />;
}
