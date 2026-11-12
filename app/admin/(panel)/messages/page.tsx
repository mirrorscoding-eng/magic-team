import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { Icon } from "@/components/brand/Icon";
import { requireAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/store";

export default async function Messages() {
  await requireAdmin();
  const messages = await getMessages();
  const fmt = new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">الرسائل</h1>
      <p className="mt-1 text-sm text-lilac/60">الطلبات اللي توصل من نموذج التواصل بالموقع.</p>
      <ul className="mt-8 space-y-3">
        {messages.map((m) => (
          <li key={m.id} className={`card p-5 ${m.read ? "opacity-70" : "border-orchid/40!"}`}>
            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.read && <span className="pill c-orchid text-[10px]!">جديد</span>}
                  <span className="text-lg font-bold">{m.name}</span>
                  {m.company && <span className="text-lilac/60">· {m.company}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-lilac/70">
                  {m.phone && <a href={`tel:${m.phone}`} className="font-latin hover:text-white" dir="ltr">{m.phone}</a>}
                  {m.email && <a href={`mailto:${m.email}`} className="font-latin hover:text-white">{m.email}</a>}
                  {m.service && <span className="pill-outline">{m.service}</span>}
                </div>
                {m.message && <p className="mt-3 whitespace-pre-wrap leading-7 text-white/90">{m.message}</p>}
                <div className="mt-3 text-xs text-lilac/40">{fmt.format(new Date(m.createdAt))}</div>
              </div>
              <div className="flex gap-2">
                <form action={setMessageRead.bind(null, m.id, !m.read)}>
                  <button className="rounded-full border border-[var(--line)] px-3 py-2 text-xs hover:border-orchid">{m.read ? "تعليم كغير مقروء" : "تعليم كمقروء"}</button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <button className="grid h-8 w-8 place-items-center rounded-full text-lilac/60 hover:bg-orchid/20 hover:text-orchid" aria-label="حذف"><Icon name="close" className="h-4 w-4" /></button>
                </form>
              </div>
            </div>
          </li>
        ))}
        {!messages.length && <li className="card p-10 text-center text-lilac/50">ما كو رسائل بعد.</li>}
      </ul>
    </div>
  );
}
