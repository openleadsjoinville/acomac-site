import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const RegisterSchema = z.object({
  companyName: z.string().min(2, "Nome obrigatório"),
  cnpj: z.string().optional().default(""),
  contactName: z.string().min(2, "Nome do contato obrigatório"),
  phone: z.string().min(6, "Telefone obrigatório"),
  whatsapp: z.string().optional().default(""),
  email: z.string().email("Email inválido"),
  city: z.string().optional().default(""),
  neighborhood: z.string().optional().default(""),
  address: z.string().optional().default(""),
  state: z.string().optional().default(""),
  zipCode: z.string().optional().default(""),
  hours: z.string().optional().default(""),
  products: z.string().optional().default(""),
  yearsInMarket: z.union([z.number(), z.string()]).optional().nullable(),
  coverImage: z.string().optional().default(""),
  website: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  facebook: z.string().optional().default(""),
  segment: z.string().optional().default(""),
  description: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "dados inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const years =
    typeof data.yearsInMarket === "string"
      ? parseInt(data.yearsInMarket, 10) || null
      : typeof data.yearsInMarket === "number"
      ? data.yearsInMarket
      : null;
  const record = await prisma.associate.create({
    data: {
      companyName: data.companyName,
      cnpj: data.cnpj || null,
      contactName: data.contactName,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email,
      city: data.city || null,
      neighborhood: data.neighborhood || null,
      address: data.address || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
      hours: data.hours || null,
      products: data.products || null,
      yearsInMarket: years,
      coverImage: data.coverImage || null,
      website: data.website || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      segment: data.segment || null,
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      status: "PENDING",
    },
  });
  return NextResponse.json({ ok: true, id: record.id });
}
