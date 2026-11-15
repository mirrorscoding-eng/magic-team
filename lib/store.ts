import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { seed } from "./seed";
import { SECTION_KEYS, type Content, type ContentKey, type Message } from "./types";

/**
 * File-based content store (data/content.json).
 * Swap this module for a database (e.g. Supabase) before deploying to serverless hosting:
 * every read/write in the app goes through these functions only.
 */
const DATA_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export async function getContent(): Promise<Content> {
  const stored = await readJson<Partial<Content> | null>(CONTENT_FILE, null);
  if (!stored) {
    await writeJson(CONTENT_FILE, seed);
    return structuredClone(seed);
  }
  // fill any keys added after the file was created
  const content = { ...structuredClone(seed), ...stored } as Content;
  // the portfolio moved from one flat list to per-project pages
  if (!Array.isArray(content.gallery?.projects)) content.gallery = structuredClone(seed.gallery);
  // hero cards used to be plain images from a single shoot; now each card points at a project
  if (content.hero?.cards?.length && content.hero.cards.every((c) => !("project" in c))) content.hero.cards = structuredClone(seed.hero.cards);
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
  await writeJson(CONTENT_FILE, content);
}

export async function resetContent() {
  await writeJson(CONTENT_FILE, seed);
}

export async function getMessages(): Promise<Message[]> {
  const list = await readJson<Message[]>(MESSAGES_FILE, []);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addMessage(msg: Omit<Message, "id" | "createdAt" | "read">) {
  const list = await readJson<Message[]>(MESSAGES_FILE, []);
  list.push({ ...msg, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false });
  await writeJson(MESSAGES_FILE, list);
}

export async function updateMessages(fn: (list: Message[]) => Message[]) {
  const list = await readJson<Message[]>(MESSAGES_FILE, []);
  await writeJson(MESSAGES_FILE, fn(list));
}
