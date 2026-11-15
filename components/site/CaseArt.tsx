import type { CaseStudy } from "@/lib/types";

/** Client logo, or the client name as a wordmark when no logo was uploaded. */
export function CaseLogo({ c, className = "" }: { c: Pick<CaseStudy, "client" | "logo">; className?: string }) {
  if (c.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.logo} alt="" className={`object-contain ${className}`} />;
  }
  return (
    <span className="grid h-full max-w-full place-items-center truncate font-latin text-[0.7rem] font-extrabold leading-none tracking-tight text-white" dir="ltr">
      {c.client}
    </span>
  );
}

/** On-brand fill for stories without a cover photo: the story colour, a soft grid and the client name. */
export function CaseBackdrop({ c, className = "" }: { c: Pick<CaseStudy, "client" | "color">; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-ink-2 c-${c.color} ${className}`} aria-hidden>
      <div className="absolute -start-1/4 -top-1/3 h-[120%] w-[90%] rounded-full opacity-40 blur-3xl" style={{ background: "var(--c)" }} />
      <div className="absolute -bottom-1/3 -end-1/4 h-[90%] w-[70%] rounded-full bg-orchid opacity-25 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "linear-gradient(var(--c) 1px, transparent 1px), linear-gradient(90deg, var(--c) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
      />
      <div className="absolute inset-x-0 top-[18%] text-center font-latin text-[clamp(3rem,11vw,8rem)] font-extrabold uppercase leading-none tracking-tighter text-white/10" dir="ltr">
        {c.client}
      </div>
    </div>
  );
}
