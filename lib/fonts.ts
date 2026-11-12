import { Anton, IBM_Plex_Sans_Arabic, Montserrat } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

// Brand Arabic font is Helvetica Arabic (licensed). IBM Plex Sans Arabic is the free stand-in;
// drop licensed files in /public/fonts and add an @font-face named "Helvetica Arabic" to switch.
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const fontVars = `${montserrat.variable} ${plexArabic.variable} ${anton.variable}`;
