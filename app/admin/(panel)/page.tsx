import Link from "next/link";
import { ResetDemo } from "@/components/admin/ResetDemo";
import { SectionsManager } from "@/components/admin/SectionsManager";
import { Icon } from "@/components/brand/Icon";
import { requireAdmin } from "@/lib/auth";
import { getContent, getMessages } from "@/lib/store";

export default async function Overview() {
  await requireAdmin();
  const [content, messages] = await Promise.all([getContent(), getMessages()]);
  const unread = messages.filter((m) => !m.read).length;
  const stats = [
    { label: "شعارات العملاء", value: content.clients.logos.length, href: "/admin/clients", color: "c-lilac" },
    { label: "قصص النجاح", value: content.cases.items.length, href: "/admin/cases", color: "c-yellow" },
    { label: "العروض المخصصة", value: content.presentations.length, href: "/admin/presentations", color: "c-cyan" },
    { label: "رسائل جديدة", value: unread, href: "/admin/messages", color: "c-green" },
  ];
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-orchid">هلا بيك 👋</p>
          <h1 className="mt-1 text-3xl font-bold">لوحة تحكم ماجك</h1>
          <p className="mt-2 text-sm text-lilac/60">كل تعديل تحفظه يطلع مباشرة على الموقع ووضع العرض.</p>
        </div>
        <div className="flex gap-2">
          <a href="/ar" target="_blank" className="btn btn-ghost py-2.5!">عرض الموقع</a>
          <a href="/ar/present" target="_blank" className="btn btn-primary py-2.5!">
            ابدأ العرض <span className="arrow"><Icon name="present" className="h-4 w-4" /></span>
          </a>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`group rounded-3xl p-5 text-ink transition hover:-translate-y-1 ${s.color}`} style={{ background: "var(--c)" }}>
            <div className="font-latin text-4xl font-extrabold">{s.value}</div>
            <div className="mt-2 flex items-center justify-between text-sm font-semibold">
              {s.label}
              <Icon name="chevL" className="h-4 w-4 transition group-hover:-translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <SectionsManager initial={content.settings.sections} />
        <div className="space-y-6">
          <div className="card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">العروض المخصصة</h2>
              <Link href="/admin/presentations" className="text-sm text-orchid hover:underline">إدارة</Link>
            </div>
            <ul className="space-y-2">
              {content.presentations.map((p) => (
                <li key={p.slug} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-latin font-bold">{p.client}</div>
                    <div className="text-xs text-lilac/50">{p.sections.length} أقسام · {p.caseIds.length || "كل"} قصص</div>
                  </div>
                  <a href={`/ar/present/${p.slug}`} target="_blank" className="grid h-9 w-9 place-items-center rounded-full bg-orchid text-ink" aria-label="فتح العرض">
                    <Icon name="present" className="h-4 w-4" />
                  </a>
                </li>
              ))}
              {!content.presentations.length && <li className="text-sm text-lilac/50">ما كو عروض بعد.</li>}
            </ul>
          </div>
          <div className="card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">آخر الرسائل</h2>
              <Link href="/admin/messages" className="text-sm text-orchid hover:underline">الكل</Link>
            </div>
            <ul className="space-y-2">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-3 py-2.5">
                  {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-orchid" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{m.name} {m.company && <span className="font-normal text-lilac/50">· {m.company}</span>}</div>
                    <div className="truncate text-xs text-lilac/50">{m.service || m.message}</div>
                  </div>
                </li>
              ))}
              {!messages.length && <li className="text-sm text-lilac/50">ما كو رسائل بعد. رسائل نموذج التواصل تظهر هنا.</li>}
            </ul>
          </div>
          <div className="flex justify-end"><ResetDemo /></div>
        </div>
      </div>
    </div>
  );
}
