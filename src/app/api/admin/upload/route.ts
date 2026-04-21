import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/storage";

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/gif",
];
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
    return NextResponse.json(
      { error: `tipo não permitido (${file.type})` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "arquivo muito grande (máx 10MB)" },
      { status: 400 }
    );
  }

  try {
    const uploaded = await uploadFile(file);
    await prisma.media.create({
      data: {
        filename: uploaded.filename,
        url: uploaded.url,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
      },
    });
    return NextResponse.json({ url: uploaded.url, filename: uploaded.filename });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro no upload";
    console.error("[admin/upload]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
