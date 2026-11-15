/**
 * A video on the site is one string: either a file (uploaded / under /public: mp4, webm, mov)
 * or a link to YouTube, Vimeo, TikTok or Instagram that we embed.
 */
export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "youtube"; id: string; vertical: boolean }
  | { kind: "vimeo"; id: string }
  | { kind: "tiktok"; id: string }
  | { kind: "instagram"; code: string; type: "p" | "reel" };

export const VIDEO_LABEL: Record<VideoSource["kind"], string> = {
  file: "ملف فيديو",
  youtube: "YouTube",
  vimeo: "Vimeo",
  tiktok: "TikTok",
  instagram: "Instagram",
};

export function parseVideo(raw: string | undefined): VideoSource | null {
  const url = raw?.trim();
  if (!url) return null;
  if (/\.(mp4|webm|mov|m4v)(\?.*)?(#.*)?$/i.test(url) || url.startsWith("/uploads/")) return { kind: "file", src: url };
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");
  const parts = u.pathname.split("/").filter(Boolean);
  if (host === "youtu.be" && parts[0]) return { kind: "youtube", id: parts[0], vertical: false };
  if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
    const v = u.searchParams.get("v");
    if (v) return { kind: "youtube", id: v, vertical: false };
    if (["shorts", "embed", "live", "v"].includes(parts[0]) && parts[1]) return { kind: "youtube", id: parts[1], vertical: parts[0] === "shorts" };
  }
  if (host.endsWith("vimeo.com")) {
    const id = parts.find((p) => /^\d+$/.test(p));
    if (id) return { kind: "vimeo", id };
  }
  if (host.endsWith("tiktok.com")) {
    const i = parts.findIndex((p) => p === "video" || p === "v1" || p === "v2");
    const id = i >= 0 ? parts[i + 1] : undefined;
    if (id && /^\d+$/.test(id)) return { kind: "tiktok", id };
  }
  if (host === "instagram.com" && ["p", "reel", "reels", "tv"].includes(parts[0]) && parts[1]) {
    return { kind: "instagram", code: parts[1], type: parts[0] === "p" ? "p" : "reel" };
  }
  return null;
}

/** Portrait (9:16) players: Shorts, TikTok and Instagram. */
export const isVertical = (v: VideoSource) =>
  (v.kind === "youtube" && v.vertical) || v.kind === "tiktok" || v.kind === "instagram";

/** Silent looping background playback is only reliable for files, YouTube and Vimeo. */
export const canAmbient = (v: VideoSource) => v.kind === "file" || v.kind === "youtube" || v.kind === "vimeo";

/** Iframe URL for an embedded video. `ambient` = muted, looping, no controls (decorative). */
export function embedUrl(v: VideoSource, ambient: boolean): string | null {
  switch (v.kind) {
    case "youtube": {
      const q = new URLSearchParams({ autoplay: "1", playsinline: "1", rel: "0", modestbranding: "1" });
      if (ambient) {
        q.set("mute", "1");
        q.set("loop", "1");
        q.set("playlist", v.id);
        q.set("controls", "0");
        q.set("disablekb", "1");
        q.set("iv_load_policy", "3");
      }
      return `https://www.youtube-nocookie.com/embed/${v.id}?${q}`;
    }
    case "vimeo":
      return `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1${ambient ? "&muted=1&loop=1&background=1" : ""}`;
    case "tiktok":
      return `https://www.tiktok.com/player/v1/${v.id}?autoplay=1&loop=1&rel=0&description=0&music_info=0`;
    case "instagram":
      return `https://www.instagram.com/${v.type}/${v.code}/embed`;
    default:
      return null;
  }
}

/** A cover image when the editor didn't set one (only YouTube exposes thumbnails without an API). */
export function posterOf(video: string | undefined, image: string | undefined): string {
  if (image) return image;
  const v = parseVideo(video);
  return v?.kind === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : "";
}
