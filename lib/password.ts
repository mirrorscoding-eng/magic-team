import "server-only";
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { db } from "./store";

/**
 * Dashboard password. Once changed from the dashboard it lives (scrypt-hashed) in the
 * `site_content` row with id "auth"; until then ADMIN_PASSWORD from the env is used.
 * Deleting that row in Supabase falls back to ADMIN_PASSWORD (recovery if it's forgotten).
 * `stamp` changes with every password change and is baked into session tokens,
 * so changing the password signs out every other device.
 */
const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const AUTH_ID = "auth";
const ENV_STAMP = "env";

type AuthRow = { hash: string; salt: string; stamp: string };

const readAuth = cache(async (): Promise<AuthRow | null> => {
  const res = await db().from("site_content").select("data").eq("id", AUTH_ID).maybeSingle();
  if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  return (res.data?.data as AuthRow | undefined) ?? null;
});

/** Current session stamp: tokens carrying any other stamp are rejected. */
export async function currentStamp() {
  return (await readAuth())?.stamp ?? ENV_STAMP;
}

function same(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function checkPassword(pass: string) {
  const row = await readAuth();
  if (row) return same(await scrypt(pass, Buffer.from(row.salt, "hex"), 64), Buffer.from(row.hash, "hex"));
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && same(Buffer.from(pass), Buffer.from(expected));
}

/** Stores the new password and returns the new stamp. */
export async function setPassword(pass: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(pass, salt, 64);
  const row: AuthRow = { hash: hash.toString("hex"), salt: salt.toString("hex"), stamp: randomBytes(8).toString("hex") };
  const res = await db().from("site_content").upsert({ id: AUTH_ID, data: row, updated_at: new Date().toISOString() });
  if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  return row.stamp;
}
