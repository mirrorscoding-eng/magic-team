// Signed session token, works in both Node and the proxy runtime (Web Crypto only).
// Format: `${exp}.${stamp}.${sig}` — `stamp` ties the token to the current password (see lib/password.ts).
export const SESSION_COOKIE = "magic_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createToken(stamp: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return { token: `${exp}.${stamp}.${await hmac(`${exp}.${stamp}`)}`, maxAge: MAX_AGE };
}

/** Checks signature and expiry; returns the token's stamp, or null if invalid. */
export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  const [exp, stamp, sig] = token.split(".");
  if (!exp || !stamp || !sig || Number(exp) < Date.now() / 1000) return null;
  const expected = await hmac(`${exp}.${stamp}`);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? stamp : null;
}
