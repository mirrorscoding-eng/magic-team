"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Hover help for the whole dashboard. Any element with `data-tip` (and an optional
 * `data-tip-title`) gets a branded bubble after the pointer rests on it for a moment.
 * Use `tip()` from lib/tip to spread the attributes. Mount <TooltipHost /> once.
 */

type Side = "top" | "bottom" | "left" | "right";

const FIRST_DELAY = 650; // ms the pointer has to rest before the first tip shows
const WARM_DELAY = 120; // once one tip was open, neighbours show almost instantly
const WARM_WINDOW = 500; // how long after hiding we stay "warm"
const GAP = 10;
const MARGIN = 12;

type Shown = { title: string; body: string; target: HTMLElement; side: Side; x: number };

export function TooltipHost() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; side: Side; arrow: number } | null>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const lastHide = useRef(0);
  const current = useRef<HTMLElement | null>(null);
  const pending = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const clear = () => {
      window.clearTimeout(timer.current);
      pending.current = null;
    };
    const hide = () => {
      clear();
      if (current.current) lastHide.current = Date.now();
      current.current = null;
      setShown(null);
      setPos(null);
    };
    const schedule = (el: HTMLElement, x: number) => {
      if (current.current === el || pending.current === el) return;
      clear();
      pending.current = el;
      const warm = current.current !== null || Date.now() - lastHide.current < WARM_WINDOW;
      if (current.current) {
        current.current = null;
        setShown(null);
        setPos(null);
      }
      timer.current = window.setTimeout(() => {
        pending.current = null;
        const title = el.dataset.tipTitle ?? "";
        const body = el.dataset.tip ?? "";
        if (!title && !body) return;
        if (!el.isConnected) return;
        current.current = el;
        setShown({ title, body, target: el, side: (el.dataset.tipSide as Side) || "top", x });
      }, warm ? WARM_DELAY : FIRST_DELAY);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-tip],[data-tip-title]");
      if (!el) {
        if (current.current || pending.current) hide();
        return;
      }
      schedule(el, e.clientX);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.matches?.(":focus-visible")) return;
      const el = t.closest<HTMLElement>("[data-tip],[data-tip-title]");
      if (el) {
        const r = el.getBoundingClientRect();
        schedule(el, r.left + r.width / 2);
      }
    };
    const onLeaveDoc = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || current.current) hide();
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onLeaveDoc);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", hide);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      clear();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeaveDoc);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  // Measure the bubble, then place it next to the target, flipping/clamping to stay on screen.
  useEffect(() => {
    if (!shown || !bubble.current) return;
    const r = shown.target.getBoundingClientRect();
    const b = bubble.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let side = shown.side;
    if (side === "top" && r.top - b.height - GAP < MARGIN) side = "bottom";
    else if (side === "bottom" && r.bottom + b.height + GAP > vh - MARGIN) side = "top";
    else if (side === "left" && r.left - b.width - GAP < MARGIN) side = "right";
    else if (side === "right" && r.right + b.width + GAP > vw - MARGIN) side = "left";

    let left: number;
    let top: number;
    let arrow: number;
    if (side === "top" || side === "bottom") {
      // Wide targets (whole form fields) anchor at the pointer instead of their centre.
      const anchor = r.width > 280 ? Math.min(Math.max(shown.x, r.left + 24), r.right - 24) : r.left + r.width / 2;
      left = Math.min(Math.max(anchor - b.width / 2, MARGIN), vw - b.width - MARGIN);
      top = side === "top" ? r.top - b.height - GAP : r.bottom + GAP;
      arrow = anchor - left;
    } else {
      const anchor = r.top + r.height / 2;
      top = Math.min(Math.max(anchor - b.height / 2, MARGIN), vh - b.height - MARGIN);
      left = side === "left" ? r.left - b.width - GAP : r.right + GAP;
      arrow = anchor - top;
    }
    setPos({ left, top, side, arrow });
  }, [shown]);

  if (!shown) return null;
  const s = pos?.side ?? shown.side;
  const vertical = s === "top" || s === "bottom";

  return (
    <div
      ref={bubble}
      role="tooltip"
      className="pointer-events-none fixed z-[200] max-w-[min(300px,calc(100vw-24px))] rounded-2xl border border-orchid/30 bg-[#2a0530] px-3.5 py-2.5 text-start shadow-[0_18px_50px_-12px_rgba(0,0,0,.7)]"
      style={{
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        opacity: pos ? 1 : 0,
        transform: pos ? "none" : vertical ? `translateY(${s === "top" ? 4 : -4}px)` : `translateX(${s === "left" ? 4 : -4}px)`,
        transition: "opacity .15s ease, transform .2s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {shown.title && <div className="text-[13px] font-bold leading-snug text-white">{shown.title}</div>}
      {shown.body && <div className={`text-xs leading-relaxed text-lilac/80 ${shown.title ? "mt-1" : ""}`}>{shown.body}</div>}
      {pos && (
        <span
          className="absolute h-2.5 w-2.5 rotate-45 border-orchid/30 bg-[#2a0530]"
          style={
            vertical
              ? { left: pos.arrow - 5, [s === "top" ? "bottom" : "top"]: -6, borderWidth: s === "top" ? "0 1px 1px 0" : "1px 0 0 1px" }
              : { top: pos.arrow - 5, [s === "left" ? "right" : "left"]: -6, borderWidth: s === "left" ? "1px 1px 0 0" : "0 0 1px 1px" }
          }
        />
      )}
    </div>
  );
}
