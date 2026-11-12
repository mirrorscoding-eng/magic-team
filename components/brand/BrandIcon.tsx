/**
 * Page icons drawn in the logo's style: one heavy flowing line (the M wave) plus a solid
 * round dot (the dot of the "i"). Strokes use pathLength=1 so `.brand-icon` can redraw them.
 */
type Part = { d: string; w?: number } | { dot: [number, number, number] };

const ICONS: Record<string, Part[]> = {
  // Magic sparkle — Services
  services: [
    { d: "M24 5C25.6 17.6 30.4 22.4 43 24C30.4 25.6 25.6 30.4 24 43C22.4 30.4 17.6 25.6 5 24C17.6 22.4 22.4 17.6 24 5Z" },
    { dot: [40, 8, 3.4] },
  ],
  // A frame holding the wave, with the dot as a sun — Work
  work: [
    { d: "M14.5 7H33.5C39 7 43.5 11.5 43.5 17V31C43.5 36.5 39 41 33.5 41H14.5C9 41 4.5 36.5 4.5 31V17C4.5 11.5 9 7 14.5 7Z" },
    { d: "M10.5 33.5C13.5 33.5 14.5 23 18.5 23C22.5 23 23 31 27 31C31.5 31 32 19.5 38.5 19.5" },
    { dot: [30, 15.5, 3.2] },
  ],
  // The M wave as shoulders, dots as heads — Team
  team: [
    { d: "M3 43C3 34 7 29.5 12 29.5C16 29.5 17.6 32.5 18.2 35.5C18.8 30 20.5 26.5 24 26.5C27.5 26.5 29.2 30 29.8 35.5C30.4 32.5 32 29.5 36 29.5C41 29.5 45 34 45 43" },
    { dot: [12, 19.5, 4.6] },
    { dot: [24, 15.5, 4.6] },
    { dot: [36, 19.5, 4.6] },
  ],
  // A speech bubble carrying the wave — Contact
  contact: [
    { d: "M24 6C35 6 43 13.2 43 22C43 30.8 35 38 24 38C21.3 38 18.8 37.6 16.5 36.8L6.5 41.5L9.2 32.8C6.6 30 5 26.2 5 22C5 13.2 13 6 24 6Z" },
    { d: "M13 24C15.5 24 16 17.5 19 17.5C22 17.5 22.6 27 25.6 27C28.6 27 29.2 19.5 35 19.5", w: 4.4 },
  ],
};

export const BRAND_ICONS = Object.keys(ICONS);

export function BrandIcon({ name, className = "h-12 w-12" }: { name: string; className?: string }) {
  const parts = ICONS[name] ?? ICONS.services;
  return (
    <svg viewBox="0 0 48 48" className={`brand-icon ${className}`} fill="none" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" aria-hidden>
      {parts.map((p, i) =>
        "dot" in p ? (
          <circle key={i} className="bi-dot" cx={p.dot[0]} cy={p.dot[1]} r={p.dot[2]} fill="currentColor" stroke="none" />
        ) : (
          <path key={i} className="bi-line" d={p.d} pathLength={1} strokeWidth={p.w} />
        ),
      )}
    </svg>
  );
}
