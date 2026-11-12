"use client";
import { useActionState, useContext } from "react";
import { submitContact } from "@/app/actions";
import { Icon } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
import type { Contact as CT, Locale, Settings } from "@/lib/types";
import { t } from "@/lib/types";
import { Reveal, SlideContext } from "./shown";

const field = "w-full rounded-2xl border border-[var(--line)] bg-ink/50 px-4 py-3.5 text-white placeholder:text-lilac/40 outline-none transition focus:border-orchid focus:bg-ink/80";

export function Contact({ data, settings, locale }: { data: CT; settings: Settings; locale: Locale }) {
  const [state, action, pending] = useActionState(submitContact, null);
  const ar = locale === "ar";
  const { inDeck } = useContext(SlideContext);
  return (
    <section id="contact" className="relative overflow-hidden pt-28 md:pt-36">
      <div className="aurora opacity-60" aria-hidden><span className="a1" /><span className="a2" /><span className="a4" /></div>
      <Reveal className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 lg:grid-cols-2">
        <div>
          <span className="eyebrow reveal">{t(data.eyebrow, locale)}</span>
          <h2 className="reveal mt-5 text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.05]" style={{ ["--d" as string]: 1 }}>
            {t(data.title, locale)}
          </h2>
          <p className="lead reveal mt-5" style={{ ["--d" as string]: 2 }}>{t(data.subtitle, locale)}</p>
          <ul className="reveal mt-10 space-y-3 text-lilac/80" style={{ ["--d" as string]: 3 }}>
            <li><a className="flex items-center gap-3 hover:text-white" href={`mailto:${settings.email}`}><Icon name="mail" /> <span className="font-latin">{settings.email}</span></a></li>
            <li><a className="flex items-center gap-3 hover:text-white" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> <span className="font-latin" dir="ltr">{settings.phone}</span></a></li>
            <li className="flex items-center gap-3"><Icon name="pin" /> {t(settings.address, locale)}</li>
          </ul>
        </div>
        <form action={action} className="reveal card space-y-3 p-6 md:p-8" style={{ ["--d" as string]: 2 }}>
          {state?.ok ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-green text-ink"><Icon name="check" className="h-8 w-8" strokeWidth={2.5} /></span>
              <p className="mt-6 text-xl font-bold">{t(data.success, locale)}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="name" required placeholder={ar ? "الاسم" : "Name"} className={field} autoComplete="name" />
                <input name="company" placeholder={ar ? "اسم الشركة / العلامة" : "Company / brand"} className={field} autoComplete="organization" />
                <input name="phone" type="tel" placeholder={ar ? "رقم الهاتف" : "Phone"} className={field} dir="ltr" autoComplete="tel" />
                <input name="email" type="email" placeholder={ar ? "البريد الإلكتروني" : "Email"} className={field} dir="ltr" autoComplete="email" />
              </div>
              <select name="service" className={field} defaultValue="">
                <option value="" disabled>{ar ? "شنو تحتاج؟" : "What do you need?"}</option>
                {data.serviceOptions.map((o, i) => (
                  <option key={i} value={t(o, locale)} className="bg-ink">{t(o, locale)}</option>
                ))}
              </select>
              <textarea name="message" rows={4} placeholder={ar ? "احچيلنا عن مشروعك..." : "Tell us about your project..."} className={field} />
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              {state?.error && <p className="text-sm text-orchid">{ar ? "اكتب اسمك ورقم الهاتف أو الإيميل." : "Please add your name and a phone or email."}</p>}
              <button disabled={pending} className="btn btn-primary w-full justify-center disabled:opacity-60">
                {pending ? (ar ? "جاري الإرسال..." : "Sending...") : t(data.button, locale)}
                <span className="arrow flip-rtl"><Icon name="arrow" className="h-4 w-4" /></span>
              </button>
            </>
          )}
        </form>
      </Reveal>
      {/* On the website the shared <Footer> is in the layout; the deck keeps this one on its last slide. */}
      {inDeck && <DeckFooter settings={settings} ar={ar} />}
    </section>
  );
}

function DeckFooter({ settings, ar }: { settings: Settings; ar: boolean }) {
  return (
    <footer className="relative border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-10">
        <Logo className="h-9 w-auto text-lilac" />
        <SocialLinks settings={settings} />
        <p className="w-full text-center text-xs text-lilac/40 md:w-auto">© {new Date().getFullYear()} Magic Team. {ar ? "كل الحقوق محفوظة." : "All rights reserved."}</p>
      </div>
    </footer>
  );
}

export function SocialLinks({ settings }: { settings: Settings }) {
  return (
    <div className="flex gap-2">
      {[["instagram", settings.instagram], ["tiktok", settings.tiktok], ["linkedin", settings.linkedin]].filter(([, u]) => u).map(([n, u]) => (
        <a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={n} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-lilac transition hover:border-orchid hover:bg-orchid hover:text-ink">
          <Icon name={n} />
        </a>
      ))}
    </div>
  );
}
