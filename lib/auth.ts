import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentStamp } from "./password";
import { SESSION_COOKIE, verifyToken } from "./session";

export async function isAdmin() {
  const store = await cookies();
  const stamp = await verifyToken(store.get(SESSION_COOKIE)?.value);
  return !!stamp && stamp === (await currentStamp());
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
