import { createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";
import { UPLOAD_DIR } from "@/lib/store";

const IMAGE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};
const VIDEO: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v",
};
const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_VIDEO = 300 * 1024 * 1024;

const tooBig = (video: boolean) => NextResponse.json({ error: video ? "الفيديو أكبر من 300MB" : "الحجم أكبر من 8MB" }, { status: 413 });

/**
 * Accepts the raw file as the request body (Content-Type = the file's type), streamed to disk
 * so big videos never sit in memory. Multipart `file` is still accepted for older clients.
 */
export async function POST(req: NextRequest) {
  if (!(await verifyToken(req.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  if (type === "multipart/form-data") {
    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
    const ext = IMAGE[file.type] ?? VIDEO[file.type];
    if (!ext) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 415 });
    const video = !!VIDEO[file.type];
    if (file.size > (video ? MAX_VIDEO : MAX_IMAGE)) return tooBig(video);
    const name = `${crypto.randomUUID()}.${ext}`;
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  }

  const ext = IMAGE[type] ?? VIDEO[type];
  if (!ext) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 415 });
  if (!req.body) return NextResponse.json({ error: "no file" }, { status: 400 });
  const video = !!VIDEO[type];
  const max = video ? MAX_VIDEO : MAX_IMAGE;
  if (Number(req.headers.get("content-length") ?? 0) > max) return tooBig(video);

  const name = `${crypto.randomUUID()}.${ext}`;
  const dest = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name);
  let size = 0;
  const limit = new Transform({
    transform(chunk: Buffer, _enc, cb) {
      size += chunk.length;
      cb(size > max ? new Error("too big") : null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(req.body as unknown as WebReadableStream), limit, createWriteStream(dest));
  } catch {
    await fs.rm(dest, { force: true });
    return size > max ? tooBig(video) : NextResponse.json({ error: "فشل الرفع" }, { status: 500 });
  }
  if (!size) {
    await fs.rm(dest, { force: true });
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  return NextResponse.json({ url: `/uploads/${name}` });
}
