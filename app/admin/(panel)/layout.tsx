import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unread = (await getMessages()).filter((m) => !m.read).length;
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar unread={unread} />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10">{children}</main>
    </div>
  );
}
