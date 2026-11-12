"use client";
import type { Clients as ClientsT, Locale } from "@/lib/types";
import { SectionHead } from "./SectionHead";
import { Reveal } from "./shown";

function Row({ logos, reverse, speed }: { logos: ClientsT["logos"]; reverse?: boolean; speed: string }) {
  const track = (hidden?: boolean) => (
    <ul className="marquee-track" aria-hidden={hidden}>
      {logos.map((l, i) => (
        <li key={i} className="logo-tile" title={l.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.logo} alt={hidden ? "" : l.name} loading="lazy" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee ${reverse ? "reverse" : ""}`} style={{ ["--speed" as string]: speed }}>
      {track()}
      {track(true)}
    </div>
  );
}

export function Clients({ data, locale }: { data: ClientsT; locale: Locale }) {
  const half = Math.ceil(data.logos.length / 2);
  const a = data.logos.slice(0, half);
  const b = data.logos.slice(half).length ? data.logos.slice(half) : a;
  return (
    <section id="clients" className="relative py-28 md:py-36">
      <Reveal className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} locale={locale} align="center" />
      </Reveal>
      <Reveal className="mt-16 flex flex-col gap-5">
        <div className="reveal" style={{ ["--d" as string]: 3 }}>
          <Row logos={a} speed="45s" />
        </div>
        <div className="reveal" style={{ ["--d" as string]: 4 }}>
          <Row logos={b} speed="52s" reverse />
        </div>
      </Reveal>
    </section>
  );
}
