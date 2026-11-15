"use client";
import { useEffect, useRef } from "react";
import { canAmbient, embedUrl, isVertical, parseVideo, posterOf } from "@/lib/video";

/**
 * Decorative, silent, looping video that fills its box (like object-cover).
 * Files play only while on screen; YouTube/Vimeo play as muted background embeds;
 * TikTok/Instagram can't autoplay silently, so they show the cover with a play badge.
 */
export function AmbientVideo({
  video,
  image,
  alt = "",
  className = "",
  eager = false,
}: {
  video: string;
  image?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const v = parseVideo(video);
  const ref = useRef<HTMLVideoElement>(null);
  const poster = posterOf(video, image);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [v?.kind]);

  if (v?.kind === "file") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video ref={ref} src={v.src} poster={poster || undefined} muted loop playsInline preload={eager ? "auto" : "metadata"} aria-label={alt} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  const src = v && canAmbient(v) ? embedUrl(v, true) : null;
  const ratio = v && isVertical(v) ? 9 / 16 : 16 / 9;
  return (
    <div className={`relative overflow-hidden bg-ink-2 [container-type:size] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {poster && <img src={poster} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading={eager ? "eager" : "lazy"} />}
      {src && (
        <iframe
          src={src}
          title={alt || "video"}
          tabIndex={-1}
          loading={eager ? "eager" : "lazy"}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
          style={{
            width: `max(100cqw, calc(100cqh * ${ratio}))`,
            height: `max(100cqh, calc(100cqw / ${ratio}))`,
          }}
        />
      )}
      {!src && <PlayBadge />}
    </div>
  );
}

export function PlayBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink/60 ring-1 ring-white/25 backdrop-blur-md ${className}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="ms-0.5 h-6 w-6 fill-white">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
      </svg>
    </span>
  );
}

/** Full player with sound and controls (lightbox). */
export function VideoPlayer({ video, image, title }: { video: string; image?: string; title: string }) {
  const v = parseVideo(video);
  if (!v) return null;
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  if (v.kind === "file") {
    return <video key={v.src} src={v.src} poster={posterOf(video, image) || undefined} controls autoPlay playsInline className="max-h-full max-w-full rounded-2xl" onClick={stop} />;
  }
  const vertical = isVertical(v);
  return (
    <div
      onClick={stop}
      className={`overflow-hidden rounded-2xl bg-black shadow-2xl ${vertical ? "aspect-[9/16] h-full max-h-full max-w-full" : "aspect-video w-full max-w-5xl max-h-full"} ${v.kind === "instagram" ? "aspect-[9/15] bg-white" : ""}`}
    >
      <iframe
        key={video}
        src={embedUrl(v, false)!}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
