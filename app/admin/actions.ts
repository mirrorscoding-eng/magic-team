"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createToken, SESSION_COOKIE } from "@/lib/session";
import { deleteMessage as dbDeleteMessage, getContent, resetContent, saveContentKey, setMessageRead as dbSetMessageRead } from "@/lib/store";
import { SECTION_KEYS, type Content, type ContentKey, type SectionKey } from "@/lib/types";

const KEYS: ContentKey[] = ["settings", "hero", "clients", "featured", "team", "gallery", "cases", "beforeAfter", "manifesto", "services", "contact", "presentations"];

export async function login(_prev: { error?: string } | null, form: FormData) {
  const pass = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || pass !== expected) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: "كلمة المرور غير صحيحة" };
  }
  const { token, maxAge } = await createToken();
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveKey(key: ContentKey, value: unknown) {
  await requireAdmin();
  if (!KEYS.includes(key)) return { ok: false, error: "قسم غير معروف" };
  if (key === "presentations") {
    if (!Array.isArray(value)) return { ok: false, error: "بيانات غير صالحة" };
    const slugs = (value as Content["presentations"]).map((p) => p.slug.trim());
    if (slugs.some((s) => !/^[a-z0-9-]+$/i.test(s))) return { ok: false, error: "رابط العرض لازم يكون أحرف إنكليزية وأرقام و - فقط" };
    if (new Set(slugs).size !== slugs.length) return { ok: false, error: "في عرضين بنفس الرابط" };
  } else if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "بيانات غير صالحة" };
  }
  if (key === "cases") {
    const ids = (value as Content["cases"]).items.map((c) => c.id.trim());
    if (ids.some((id) => !id)) return { ok: false, error: "كل قصة تحتاج معرّف" };
    if (new Set(ids).size !== ids.length) return { ok: false, error: "في قصتين بنفس المعرّف" };
  }
  if (key === "settings") {
    // section order/visibility is managed separately
    const current = await getContent();
    (value as Content["settings"]).sections = current.settings.sections;
  }
  await saveContentKey(key, value as Content[typeof key]);
  refresh();
  return { ok: true };
}

export async function saveSections(sections: { key: SectionKey; visible: boolean }[]) {
  await requireAdmin();
  const clean = sections.filter((s) => (SECTION_KEYS as readonly string[]).includes(s.key)).map((s) => ({ key: s.key, visible: !!s.visible }));
  const content = await getContent();
  await saveContentKey("settings", { ...content.settings, sections: clean });
  refresh();
  return { ok: true };
}

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await dbSetMessageRead(id, read);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await dbDeleteMessage(id);
  revalidatePath("/admin", "layout");
}

export async function resetDemo() {
  await requireAdmin();
  await resetContent();
  refresh();
  return { ok: true };
}
