import type { L, Locale } from "@/lib/types";
import { t } from "@/lib/types";

export function SectionHead({ eyebrow, title, subtitle, locale, align = "start" }: { eyebrow: L; title: L; subtitle?: L; locale: Locale; align?: "start" | "center" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center flex flex-col items-center" : ""}`}>
      <span className="eyebrow reveal" style={{ ["--d" as string]: 0 }}>{t(eyebrow, locale)}</span>
      <h2 className="h-section mt-5 reveal" style={{ ["--d" as string]: 1 }}>{t(title, locale)}</h2>
      {subtitle && <p className="lead mt-5 reveal" style={{ ["--d" as string]: 2 }}>{t(subtitle, locale)}</p>}
    </div>
  );
}
