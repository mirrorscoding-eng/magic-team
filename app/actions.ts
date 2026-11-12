"use server";
import { addMessage } from "@/lib/store";

export type ContactState = { ok: boolean; error?: string } | null;

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => String(form.get(k) ?? "").trim().slice(0, 2000);
  const name = get("name");
  const phone = get("phone");
  const email = get("email");
  if (get("website")) return { ok: true }; // honeypot
  if (!name || (!phone && !email)) return { ok: false, error: "missing" };
  await addMessage({ name, company: get("company"), phone, email, service: get("service"), message: get("message") });
  return { ok: true };
}
