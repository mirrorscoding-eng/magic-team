import { cookies } from "next/headers";
import { Sidebar } from "@/components/admin/Sidebar";
import { SIDEBAR_COOKIE, SIDEBAR_GROUPS_COOKIE } from "@/lib/sidebar";
import { requireAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unread = (await getMessages()).filter((m) => !m.read).length;
  const jar = await cookies();
  const collapsed = jar.get(SIDEBAR_COOKIE)?.value === "1";
  const closedGroups = (jar.get(SIDEBAR_GROUPS_COOKIE)?.value ?? "").split(",").filter(Boolean);
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar unread={unread} initialCollapsed={collapsed} initialClosedGroups={closedGroups} />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10">{children}</main>
    </div>
  );
}
