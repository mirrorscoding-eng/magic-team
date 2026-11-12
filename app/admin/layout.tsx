import type { Metadata } from "next";
import "../globals.css";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "لوحة تحكم Magic",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/mark.svg" },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVars}>
      <body className="admin">{children}</body>
    </html>
  );
}
