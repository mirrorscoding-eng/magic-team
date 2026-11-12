"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

/** In presentation mode each section lives in a slide; "shown" follows the active slide. */
export const SlideContext = createContext<{ inDeck: boolean; active: boolean }>({ inDeck: false, active: false });

export function useShown<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const slide = useContext(SlideContext);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (slide.inDeck) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slide.inDeck, threshold]);
  const shown = slide.inDeck ? slide.active : seen;
  return [ref, shown] as const;
}

/** Wrapper that adds `is-shown` to its children's `.reveal` items. */
export function Reveal({ as: Tag = "div", className = "", children, threshold }: { as?: React.ElementType; className?: string; children: React.ReactNode; threshold?: number }) {
  const [ref, shown] = useShown<HTMLDivElement>(threshold);
  return (
    <Tag ref={ref} className={`${className} ${shown ? "is-shown" : ""}`}>
      {children}
    </Tag>
  );
}
