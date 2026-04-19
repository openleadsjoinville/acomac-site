import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.sponsor.findMany({
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json().catch(() => ({}));
  const item = await prisma.sponsor.create({
    data: {
      name: body.name ?? "Novo patrocinador",
      image: body.image ?? "",
      url: body.url ?? "",
      description: body.description ?? "",
      active: body.active !== false,
      weight: Number(body.weight ?? 5),
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
  return NextResponse.json(item);
}
