"use client";
import { useState } from "react";

export function Notice({ text }: { text: string }) {
  const [hidden, setHidden] = useState(false);
  if (!text || hidden) return null;
  return (
    <button
      type="button"
      onClick={() => setHidden(true)}
      title="إخفاء"
      className="fixed bottom-4 start-4 z-40 rounded-full bg-yellow px-4 py-2 text-xs font-semibold text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition hover:scale-[1.03]"
    >
      {text}
    </button>
  );
}
