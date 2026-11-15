"use client";

/**
 * Turns the rendered A4 pages into a PDF in the browser: each page is drawn by the browser itself
 * (SVG foreignObject), so Arabic shaping, fonts and gradients come out exactly as on screen.
 */
export async function downloadPdf(pages: HTMLElement[], filename: string) {
  const [{ toJpeg, getFontEmbedCSS }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  await document.fonts?.ready;
  // html-to-image waits a frame per image; frames stop in a background tab, so tick on a timer instead
  const raf = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(performance.now()), 16);
  try {
    await render(pages, filename, toJpeg, getFontEmbedCSS, jsPDF);
  } finally {
    window.requestAnimationFrame = raf;
  }
}

/**
 * html-to-image picks the fonts to embed from inline `font-family` as written, so `var(--font-x)`
 * never matches a real face. Hand it a detached probe listing the resolved families of every page.
 */
function fontProbe(pages: HTMLElement[]) {
  const families = new Set<string>();
  for (const page of pages) for (const el of [page, ...page.querySelectorAll<HTMLElement>("*")]) families.add(getComputedStyle(el).fontFamily);
  const probe = document.createElement("div");
  for (const f of families) {
    const span = document.createElement("span");
    span.style.fontFamily = f;
    probe.appendChild(span);
  }
  return probe;
}

async function render(
  pages: HTMLElement[],
  filename: string,
  toJpeg: typeof import("html-to-image").toJpeg,
  getFontEmbedCSS: typeof import("html-to-image").getFontEmbedCSS,
  jsPDF: typeof import("jspdf").jsPDF,
) {
  const fontEmbedCSS = await getFontEmbedCSS(fontProbe(pages));
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait", compress: true });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  // warm-up: the first foreignObject render can paint before embedded fonts are decoded
  for (const el of pages) await toJpeg(el, { pixelRatio: 0.3, fontEmbedCSS, width: el.offsetWidth, height: el.offsetHeight });
  for (let i = 0; i < pages.length; i++) {
    const el = pages[i];
    const img = await toJpeg(el, { pixelRatio: 2.4, quality: 0.93, fontEmbedCSS, width: el.offsetWidth, height: el.offsetHeight, style: { transform: "none" } });
    if (i) pdf.addPage("a4", "portrait");
    pdf.addImage(img, "JPEG", 0, 0, W, H, undefined, "FAST");
  }
  pdf.save(filename.replace(/[\\/:*?"<>|]+/g, " ").trim() + ".pdf");
}
