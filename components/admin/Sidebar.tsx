"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/brand/Icon";
import { logout } from "@/app/admin/actions";

const GROUPS: { title: string; items: { href: string; label: string; icon: string }[] }[] = [
  { title: "", items: [{ href: "/admin", label: "نظرة عامة", icon: "grid" }] },
  {
    title: "محتوى الموقع",
    items: [
      { href: "/admin/hero", label: "الواجهة", icon: "spark" },
      { href: "/admin/clients", label: "علامات وثقت بنا", icon: "star" },
      { href: "/admin/featured", label: "خدمات مميزة", icon: "star" },
      { href: "/admin/team", label: "فريق ماجك", icon: "chat" },
      { href: "/admin/gallery", label: "معرض الأعمال", icon: "grid" },
      { href: "/admin/cases", label: "قصص النجاح", icon: "play" },
      { href: "/admin/beforeAfter", label: "قبل وبعد ماجك", icon: "wand" },
      { href: "/admin/manifesto", label: "البيان", icon: "bolt" },
      { href: "/admin/services", label: "الخدمات", icon: "target" },
      { href: "/admin/contact", label: "التواصل", icon: "mail" },
    ],
  },
  {
    title: "العروض والعملاء",
    items: [
      { href: "/admin/presentations", label: "العروض المخصصة", icon: "present" },
      { href: "/admin/messages", label: "الرسائل", icon: "mail" },
      { href: "/admin/settings", label: "الإعدادات", icon: "shield" },
    ],
  },
];

export function Sidebar({ unread }: { unread: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.title && <div className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-lilac/40">{g.title}</div>}
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-orchid text-ink font-bold" : "text-lilac/75 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon name={it.icon} className="h-[18px] w-[18px]" />
                    <span className="flex-1">{it.label}</span>
                    {it.href === "/admin/messages" && unread > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-ink text-orchid" : "bg-orchid text-ink"}`}>{unread}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo className="h-7 w-auto text-lilac" />
        <button onClick={() => setOpen(!open)} className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm">القائمة</button>
      </div>
      <aside className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-[var(--line)] bg-[#19001d] transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <Logo className="h-8 w-auto text-lilac" />
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-lilac/60">لوحة التحكم</span>
        </div>
        {nav}
        <div className="space-y-1 border-t border-[var(--line)] p-3">
          <a href="/ar" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-lilac/75 hover:bg-white/5 hover:text-white">
            <Icon name="globe" className="h-[18px] w-[18px]" /> عرض الموقع
          </a>
          <a href="/ar/present" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-lilac/75 hover:bg-white/5 hover:text-white">
            <Icon name="present" className="h-[18px] w-[18px]" /> وضع العرض
          </a>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-lilac/75 hover:bg-white/5 hover:text-white">
              <Icon name="close" className="h-[18px] w-[18px]" /> تسجيل خروج
            </button>
          </form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
