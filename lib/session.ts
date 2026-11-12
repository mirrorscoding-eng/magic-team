// Signed session token, works in both Node and the proxy runtime (Web Crypto only).
export const SESSION_COOKIE = "magic_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return { token: `${exp}.${await hmac(String(exp))}`, maxAge: MAX_AGE };
}

export async function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
