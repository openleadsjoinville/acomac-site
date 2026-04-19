import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `tipo não permitido (${file.type})` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "arquivo muito grande (máx 10MB)" }, { status: 400 });
  }
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  const url = `/uploads/${filename}`;
  await prisma.media.create({
    data: { filename, url, mimeType: file.type, size: file.size },
  });
  return NextResponse.json({ url, filename });
}
