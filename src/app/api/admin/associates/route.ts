import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const items = await prisma.associate.findMany({
    where: status ? { status } : {},
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json();
  const item = await prisma.associate.create({
    data: {
      companyName: body.companyName ?? "Nova empresa",
      cnpj: body.cnpj ?? null,
      contactName: body.contactName ?? "",
      phone: body.phone ?? "",
      email: body.email ?? "",
      city: body.city ?? null,
      website: body.website ?? null,
      instagram: body.instagram ?? null,
      segment: body.segment ?? null,
      description: body.description ?? null,
      logoUrl: body.logoUrl ?? null,
      displayName: body.displayName ?? null,
      displayDescription: body.displayDescription ?? null,
      displayLogo: body.displayLogo ?? null,
      orderIndex: Number(body.orderIndex ?? 0),
      status: body.status ?? "APPROVED",
    },
  });
  return NextResponse.json(item);
}
