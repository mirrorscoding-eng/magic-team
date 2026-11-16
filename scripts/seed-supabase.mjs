// One-time copy of the local JSON data (data/*.json) into Supabase.
// Usage: node --env-file=.env.local scripts/seed-supabase.mjs
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
const db = createClient(url, key, { auth: { persistSession: false } });

const read = async (f) => {
  try {
    return JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
  } catch {
    return null;
  }
};
const ok = (label, { error }) => {
  if (error) throw new Error(`${label}: ${error.message}`);
};

const content = await read("content.json");
if (content) {
  ok("content", await db.from("site_content").upsert({ id: "site", data: content, updated_at: new Date().toISOString() }));
  console.log("content: copied");
} else console.log("content: none locally (the site will start from the seed)");

const messages = (await read("messages.json")) ?? [];
if (messages.length) ok("messages", await db.from("messages").upsert(messages.map((m) => ({ id: m.id, created_at: m.createdAt, data: m }))));
console.log(`messages: ${messages.length}`);

const docs = (await read("documents.json")) ?? [];
if (docs.length) ok("documents", await db.from("documents").upsert(docs.map((d) => ({ id: d.id, type: d.type, created_at: d.createdAt, data: d }))));
console.log(`documents: ${docs.length}`);
