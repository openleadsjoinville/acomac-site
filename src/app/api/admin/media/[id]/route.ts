import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const item = await prisma.media.findUnique({ where: { id } });
  if (item) {
    const filePath = path.join(process.cwd(), "public", item.url.replace(/^\//, ""));
    try {
      await unlink(filePath);
    } catch {
      /* ignore missing */
    }
    await prisma.media.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
