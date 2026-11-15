import { DocPage } from "@/components/docs/DocPage";

export default async function Page({ params }: PageProps<"/admin/invoices/[id]">) {
  const { id } = await params;
  return <DocPage type="invoice" id={id} />;
}
