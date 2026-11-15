import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOAD_DIR } from "@/lib/store";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
};

const stream = (file: string, start?: number, end?: number) =>
  Readable.toWeb(createReadStream(file, { start, end })) as unknown as ReadableStream;

export async function GET(req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: parts } = await ctx.params;
  const name = parts.join("/");
  if (!/^[a-f0-9-]+\.(png|jpg|webp|gif|svg|avif|mp4|webm|mov|m4v)$/.test(name)) return new Response("Not found", { status: 404 });
  const file = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name);
  let size: number;
  try {
    size = (await fs.stat(file)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const headers: Record<string, string> = {
    "Content-Type": MIME[name.split(".").pop()!],
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    "Accept-Ranges": "bytes",
  };

  // videos are fetched in byte ranges (seeking; Safari won't play without it)
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : size - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    return new Response(stream(file, start, end), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new Response(stream(file), { headers: { ...headers, "Content-Length": String(size) } });
}
