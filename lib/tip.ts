/** Hover help: spread onto any dashboard element; <TooltipHost /> renders it. Safe in server components. */
export type TipSide = "top" | "bottom" | "left" | "right";

export function tip(title: string, body?: string, side?: TipSide) {
  return {
    "data-tip": body ?? "",
    "data-tip-title": title,
    ...(side ? { "data-tip-side": side } : {}),
  } as Record<string, string>;
}
