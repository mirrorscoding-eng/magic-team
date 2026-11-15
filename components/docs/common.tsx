import type { CSSProperties, ReactNode } from "react";
import type { Company, DocLang, Party } from "@/lib/docs";

export const BRAND = {
  ink: "#200024",
  ink2: "#2c0532",
  ink3: "#3a0a42",
  orchid: "#eb70fa",
  lilac: "#fac3fd",
  cyan: "#b3e9fc",
  yellow: "#f5fca9",
  green: "#9cfc8d",
};
export const SOFT = [BRAND.cyan, BRAND.yellow, BRAND.green, BRAND.lilac];

/** Arabic text in the Arabic face, Latin text and numbers in Montserrat. */
export function rootFont(lang: DocLang): CSSProperties {
  return {
    fontFamily: lang === "ar" ? "var(--font-arabic), var(--font-montserrat), sans-serif" : "var(--font-montserrat), var(--font-arabic), sans-serif",
    lineHeight: 1.6,
    WebkitFontSmoothing: "antialiased",
  };
}
// numbers, money and dates never break across lines (the PDF renderer can be a hair wider than the screen)
export const LATIN: CSSProperties = { fontFamily: "var(--font-montserrat), var(--font-arabic), sans-serif", whiteSpace: "nowrap" };
export const DISPLAY: CSSProperties = { fontFamily: "var(--font-display), var(--font-montserrat), sans-serif", letterSpacing: "0.01em" };

export const handle = (url: string) => {
  const last = (url || "").replace(/\/+$/, "").split("/").pop() ?? "";
  return last && !last.includes(".com") ? `@${last.replace(/^@/, "")}` : "";
};

/** Who the document is addressed to, as printable lines. */
export function partyLines(p: Party) {
  return [p.company && p.name ? p.name : "", p.phone, p.email, p.address].filter(Boolean);
}
export const partyTitle = (p: Party) => p.company || p.name;

export function contactBits(c: Company, lang: DocLang) {
  return [c.phone, c.email, handle(c.instagram), c.website, c.address[lang]].filter(Boolean);
}

/** Numbers and emails keep their own direction inside Arabic lines. */
export function Ltr({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span dir="ltr" style={{ ...LATIN, whiteSpace: "normal", unicodeBidi: "isolate", ...style }}>
      {children}
    </span>
  );
}
