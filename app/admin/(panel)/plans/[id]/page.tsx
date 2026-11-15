import { DocPage } from "@/components/docs/DocPage";

export default async function Page({ params }: PageProps<"/admin/plans/[id]">) {
  const { id } = await params;
  return <DocPage type="plan" id={id} />;
}
