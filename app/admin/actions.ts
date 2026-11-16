"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { checkPassword, currentStamp, setPassword } from "@/lib/password";
import { createToken, SESSION_COOKIE } from "@/lib/session";
import { deleteMessage as dbDeleteMessage, getContent, resetContent, saveContentKey, setMessageRead as dbSetMessageRead } from "@/lib/store";
import { SECTION_KEYS, type Content, type ContentKey, type SectionKey } from "@/lib/types";

const KEYS: ContentKey[] = ["settings", "hero", "clients", "featured", "team", "gallery", "cases", "beforeAfter", "manifesto", "services", "contact", "presentations"];

async function startSession(stamp: string) {
  const { token, maxAge } = await createToken(stamp);
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
}

export async function login(_prev: { error?: string } | null, form: FormData) {
  const pass = String(form.get("password") ?? "");
  if (!pass || !(await checkPassword(pass))) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: "كلمة المرور غير صحيحة" };
  }
  await startSession(await currentStamp());
  redirect("/admin");
}

export async function changePassword(_prev: { ok?: boolean; error?: string } | null, form: FormData) {
  await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (!(await checkPassword(current))) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }
  if (next.length < 8) return { error: "كلمة المرور الجديدة لازم تكون 8 أحرف على الأقل" };
  if (next !== confirm) return { error: "تأكيد كلمة المرور ما يطابق الجديدة" };
  if (next === current) return { error: "كلمة المرور الجديدة نفس الحالية" };
  // new stamp signs out every other device; keep this one signed in
  await startSession(await setPassword(next));
  return { ok: true };
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
