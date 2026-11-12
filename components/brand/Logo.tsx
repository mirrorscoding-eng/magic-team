import { LOGO_PATHS, LOGO_VIEWBOX, MARK_PATH, MARK_VIEWBOX } from "./logo-paths";

export function Logo({ className = "", title = "Magic Team" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} fill="currentColor" role="img" aria-label={title}>
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Centerline of the M wave, used as a mask to "draw" the mark. */
const MARK_CENTERLINE =
  "M1077.5 527 L1089 527.5 C1092 540 1094 552.5 1097 552.5 C1104 552.5 1110 500 1119 500 C1128 500 1133 552.5 1140 552.5 C1150 552.5 1160 484 1171 484 C1178 484 1178.5 520 1178.5 556";

export function Mark({ className = "", draw = false, id = "mk" }: { className?: string; draw?: boolean; id?: string }) {
  if (!draw)
    return (
      <svg viewBox={MARK_VIEWBOX} className={className} fill="currentColor" aria-hidden>
        <path d={MARK_PATH} />
      </svg>
    );
  // Draw the centerline stroke, then cross-fade to the exact vector mark (no SVG masks: they
  // fail to repaint inside hidden/transformed presentation slides in Chromium).
  return (
    <svg viewBox={MARK_VIEWBOX} className={`mark-draw ${className}`} fill="currentColor" aria-hidden data-id={id}>
      <path className="stroke" d={MARK_CENTERLINE} pathLength={1} fill="none" stroke="currentColor" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <path className="fill" d={MARK_PATH} />
    </svg>
  );
}
