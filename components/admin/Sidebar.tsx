"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Mark } from "@/components/brand/Logo";
import { Icon } from "@/components/brand/Icon";
import { logout } from "@/app/admin/actions";
import { SIDEBAR_COOKIE, SIDEBAR_GROUPS_COOKIE } from "@/lib/sidebar";
import { tip } from "@/lib/tip";
import { SCHEMAS } from "@/lib/schema";

/** What each page is for, shown when hovering its link. */
const PAGE_HELP: Record<string, string> = {
  "/admin": "الصفحة الرئيسية للوحة: أرقام سريعة، ترتيب أقسام الموقع، وآخر الرسائل.",
  "/admin/messages": "الطلبات اللي يرسلها الزوار من نموذج التواصل بالموقع.",
  ...Object.fromEntries(SCHEMAS.map((s) => [`/admin/${s.key}`, s.description])),
};

// Every titled group can be folded from its header; `key` identifies it in the cookie.
const GROUPS: { key: string; title: string; items: { href: string; label: string; icon: string }[] }[] = [
  { key: "home", title: "", items: [{ href: "/admin", label: "نظرة عامة", icon: "grid" }] },
  {
    key: "content",
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
    key: "deals",
    title: "العروض والعملاء",
    items: [
      { href: "/admin/presentations", label: "العروض المخصصة", icon: "present" },
      { href: "/admin/messages", label: "الرسائل", icon: "mail" },
      { href: "/admin/settings", label: "الإعدادات", icon: "shield" },
    ],
  },
];

export function Sidebar({
  unread,
  initialCollapsed = false,
  initialClosedGroups = [],
}: {
  unread: number;
  initialCollapsed?: boolean;
  initialClosedGroups?: string[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [closed, setClosed] = useState<string[]>(initialClosedGroups);

  const toggleGroup = (key: string) =>
    setClosed((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      document.cookie = `${SIDEBAR_GROUPS_COOKIE}=${next.join(",")}; path=/admin; max-age=31536000; samesite=lax`;
      return next;
    });

  const toggle = () =>
    setCollapsed((c) => {
      const next = !c;
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/admin; max-age=31536000; samesite=lax`;
      return next;
    });

  // Ctrl/⌘ + B toggles the sidebar on desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Collapsed styles only apply on desktop; the mobile drawer always shows labels.
  const c = collapsed;
  const hideLabel = c ? "lg:hidden" : "";
  const itemCls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${c ? "lg:justify-center lg:px-0" : ""}`;

  const nav = (
    <nav className={`flex flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-3 pb-4 ${c ? "lg:gap-3" : ""}`}>
      {GROUPS.map((g) => {
        const shut = !!g.title && closed.includes(g.key);
        return (
        <div key={g.key}>
          {g.title && (
            <>
              <button
                type="button"
                {...tip(shut ? "فتح المجموعة" : "طي المجموعة", shut ? "يعرض صفحات هذي المجموعة." : "يخفي صفحات هذي المجموعة حتى تصير القائمة أقصر.", "left")}
                onClick={() => toggleGroup(g.key)}
                aria-expanded={!shut}
                className={`group mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-semibold tracking-wider text-lilac/40 transition hover:text-lilac/80 ${hideLabel}`}
              >
                <span className="flex-1 whitespace-nowrap text-start">{g.title}</span>
                <Icon
                  name="chevD"
                  className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 group-hover:opacity-100 ${shut ? "rotate-90" : ""}`}
                />
              </button>
              {c && <div className="mx-auto mb-3 hidden h-px w-8 bg-[var(--line)] lg:block" />}
            </>
          )}
          {/* Folded groups stay open in the icon-only rail, where there is no header to unfold them. */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 [transition-timing-function:var(--ease-out)] ${
              shut ? `grid-rows-[0fr] ${c ? "lg:grid-rows-[1fr]" : ""}` : "grid-rows-[1fr]"
            }`}
          >
          <ul className="min-h-0 space-y-0.5 overflow-hidden" inert={shut && !c ? true : undefined}>
            {g.items.map((it) => {
              const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
              const badge = it.href === "/admin/messages" && unread > 0;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    {...tip(it.label, PAGE_HELP[it.href], "left")}
                    className={`${itemCls} ${active ? "bg-orchid text-ink font-bold" : "text-lilac/75 hover:bg-white/5 hover:text-white"}`}
                  >
                    <span className="relative shrink-0">
                      <Icon name={it.icon} className="h-[18px] w-[18px]" />
                      {badge && c && <span className="absolute -end-1 -top-1 hidden h-2 w-2 rounded-full bg-orchid ring-2 ring-[#19001d] lg:block" />}
                    </span>
                    <span className={`flex-1 whitespace-nowrap ${hideLabel}`}>{it.label}</span>
                    {badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${hideLabel} ${active ? "bg-ink text-orchid" : "bg-orchid text-ink"}`}>{unread}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
        );
      })}
    </nav>
  );

  const footer = [
    { href: "/ar", label: "عرض الموقع", icon: "globe", help: "يفتح الموقع مثل ما يشوفه الزوار، بتبويب جديد." },
    { href: "/ar/present", label: "وضع العرض", icon: "present", help: "يفتح الموقع كعرض تقديمي بشاشة كاملة، تتنقل بين الأقسام بالأسهم. مناسب للاجتماعات." },
  ];

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo className="h-7 w-auto text-lilac" />
        <button onClick={() => setOpen(!open)} {...tip("القائمة", "يفتح قائمة صفحات لوحة التحكم.", "bottom")} className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm">القائمة</button>
      </div>
      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-72 shrink-0 flex-col border-e border-[var(--line)] bg-[#19001d] transition-[transform,width] duration-300 [transition-timing-function:var(--ease-out)] lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          c ? "lg:w-[76px]" : ""
        } ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        <div className={`flex items-center gap-3 px-6 py-6 ${c ? "lg:flex-col lg:gap-4 lg:px-3" : ""}`}>
          {c ? (
            <>
              <Logo className="h-8 w-auto text-lilac lg:hidden" />
              <Mark className="hidden h-7 w-auto text-lilac lg:block" />
            </>
          ) : (
            <Logo className="h-8 w-auto text-lilac" />
          )}
          <span className={`whitespace-nowrap rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-lilac/60 ${hideLabel}`}>لوحة التحكم</span>
          <button
            type="button"
            onClick={toggle}
            {...tip(c ? "توسيع القائمة" : "تصغير القائمة", c ? "يرجّع أسماء الصفحات جنب الأيقونات. اختصار: ⌘B أو Ctrl+B." : "يخلي القائمة أيقونات بس حتى يصير مكان أكبر للتعديل. اختصار: ⌘B أو Ctrl+B.", "left")}
            aria-label={c ? "توسيع القائمة" : "تصغير القائمة"}
            aria-expanded={!c}
            className={`hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] text-lilac/60 transition hover:border-orchid hover:text-white lg:grid ${c ? "" : "ms-auto"}`}
          >
            <Icon name={c ? "chevL" : "chevR"} className="h-4 w-4" />
          </button>
        </div>
        {nav}
        <div className="space-y-1 border-t border-[var(--line)] p-3">
          {footer.map((f) => (
            <a key={f.href} href={f.href} target="_blank" {...tip(f.label, f.help, "left")} className={`${itemCls} text-lilac/75 hover:bg-white/5 hover:text-white`}>
              <Icon name={f.icon} className="h-[18px] w-[18px] shrink-0" />
              <span className={`whitespace-nowrap ${hideLabel}`}>{f.label}</span>
            </a>
          ))}
          <form action={logout}>
            <button {...tip("تسجيل خروج", "يطلعك من لوحة التحكم. تحتاج كلمة السر حتى ترجع تدخل.", "left")} className={`${itemCls} w-full text-lilac/75 hover:bg-white/5 hover:text-white`}>
              <Icon name="close" className="h-[18px] w-[18px] shrink-0" />
              <span className={`whitespace-nowrap ${hideLabel}`}>تسجيل خروج</span>
            </button>
          </form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
