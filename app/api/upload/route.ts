import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db, UPLOAD_BUCKET } from "@/lib/store";

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
// Supabase free plan caps a single file at 50MB
const MAX_VIDEO = 50 * 1024 * 1024;

/**
 * Step 1 of an upload: the dashboard sends { type, size } and gets back a one-time signed URL.
 * The browser then PUTs the file straight to Supabase Storage (Vercel functions cap bodies at 4.5MB),
 * and stores `publicUrl` in the content.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { type?: string; size?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  const type = String(body.type ?? "").toLowerCase();
  const ext = IMAGE[type] ?? VIDEO[type];
  if (!ext) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 415 });
  const video = !!VIDEO[type];
  if (Number(body.size ?? 0) > (video ? MAX_VIDEO : MAX_IMAGE)) {
    return NextResponse.json({ error: video ? "الفيديو أكبر من 50MB" : "الحجم أكبر من 8MB" }, { status: 413 });
  }

  const path = `${crypto.randomUUID()}.${ext}`;
  const storage = db().storage.from(UPLOAD_BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: "فشل تجهيز الرفع" }, { status: 500 });
  return NextResponse.json({ uploadUrl: data.signedUrl, publicUrl: storage.getPublicUrl(path).data.publicUrl });
}
