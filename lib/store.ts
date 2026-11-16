import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { seed } from "./seed";
import { SECTION_KEYS, type Content, type ContentKey, type Message } from "./types";
import { DOC_PREFIX, type Doc, type DocType } from "./docs";

/**
 * Supabase-backed store. Every read/write in the app goes through these functions only.
 * Tables (see supabase/schema.sql): site_content, messages, documents — each row keeps the
 * full object in a `data` jsonb column. Uploaded files live in the public `uploads` bucket.
 * Uses the service-role key, so this module must stay server-only.
 */
export const UPLOAD_BUCKET = "uploads";
const CONTENT_ID = "site";

let client: SupabaseClient | undefined;
export function db() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  return res.data;
}

async function writeContent(content: Content) {
  check(await db().from("site_content").upsert({ id: CONTENT_ID, data: content, updated_at: new Date().toISOString() }));
}

export async function getContent(): Promise<Content> {
  const row = check(await db().from("site_content").select("data").eq("id", CONTENT_ID).maybeSingle());
  const stored = (row?.data ?? null) as Partial<Content> | null;
  if (!stored) {
    await writeContent(seed);
    return structuredClone(seed);
  }
  // fill any keys added after the content was first saved
  const content = { ...structuredClone(seed), ...stored } as Content;
  // the portfolio moved from one flat list to per-project pages
  if (!Array.isArray(content.gallery?.projects)) content.gallery = structuredClone(seed.gallery);
  // hero cards used to be plain images from a single shoot; now each card points at a project
  if (content.hero?.cards?.length && content.hero.cards.every((c) => !("project" in c))) content.hero.cards = structuredClone(seed.hero.cards);
  // background wave controls were added to settings later
  content.settings.wave = { ...seed.settings.wave, ...content.settings.wave };
  const have = new Set(content.settings.sections.map((s) => s.key));
  for (const key of SECTION_KEYS) {
    if (have.has(key)) continue;
    // insert a new section right after the one it follows in SECTION_KEYS
    const prev = SECTION_KEYS[SECTION_KEYS.indexOf(key) - 1];
    const at = content.settings.sections.findIndex((s) => s.key === prev);
    content.settings.sections.splice(at + 1, 0, { key, visible: true });
  }
  return content;
}

export async function saveContentKey<K extends ContentKey>(key: K, value: Content[K]) {
  const content = await getContent();
  content[key] = value;
  await writeContent(content);
}

export async function resetContent() {
  await writeContent(seed);
}

/* ---------- Contact messages ---------- */
export async function getMessages(): Promise<Message[]> {
  const rows = check(await db().from("messages").select("data").order("created_at", { ascending: false }));
  return (rows ?? []).map((r) => r.data as Message);
}

export async function addMessage(msg: Omit<Message, "id" | "createdAt" | "read">) {
  const full: Message = { ...msg, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false };
  check(await db().from("messages").insert({ id: full.id, created_at: full.createdAt, data: full }));
}

export async function setMessageRead(id: string, read: boolean) {
  const row = check(await db().from("messages").select("data").eq("id", id).maybeSingle());
  if (!row) return;
  check(await db().from("messages").update({ data: { ...(row.data as Message), read } }).eq("id", id));
}

export async function deleteMessage(id: string) {
  check(await db().from("messages").delete().eq("id", id));
}

/* ---------- Business documents (quotes, invoices, marketing plans) ---------- */
export async function getDocs(type?: DocType): Promise<Doc[]> {
  let q = db().from("documents").select("data").order("created_at", { ascending: false });
  if (type) q = q.eq("type", type);
  return (check(await q) ?? []).map((r) => r.data as Doc);
}

export async function getDoc(id: string): Promise<Doc | undefined> {
  const row = check(await db().from("documents").select("data").eq("id", id).maybeSingle());
  return (row?.data as Doc | undefined) ?? undefined;
}

/** Next free number for this type and year, e.g. INV-2026-007. */
export async function nextDocNumber(type: DocType) {
  const year = new Date().getFullYear();
  const prefix = `${DOC_PREFIX[type]}-${year}-`;
  const used = (await getDocs(type)).map((d) => (d.number.startsWith(prefix) ? Number(d.number.slice(prefix.length)) || 0 : 0));
  return `${prefix}${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
}

export async function putDoc(doc: Doc) {
  check(await db().from("documents").upsert({ id: doc.id, type: doc.type, created_at: doc.createdAt, data: doc }));
}

export async function removeDoc(id: string) {
  check(await db().from("documents").delete().eq("id", id));
}
