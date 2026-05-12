import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendNotificationEmail, esc } from "@/lib/email";

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

  // Notificação por email pra aprovar com 1 clique (não bloqueia o response)
  const location = [data.neighborhood, data.city, data.state].filter(Boolean).join(", ");
  void sendNotificationEmail({
    subject: `Novo cadastro Conecta Associados — ${data.companyName}`,
    replyTo: data.email,
    html: `
      <h2 style="margin:0 0 12px 0;font-family:system-ui,sans-serif;color:#0e1a2b">Nova empresa quer entrar no Conecta Associados</h2>
      <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;color:#0e1a2b">
        <tr><td><strong>Empresa:</strong></td><td>${esc(data.companyName)}</td></tr>
        ${data.cnpj ? `<tr><td><strong>CNPJ:</strong></td><td>${esc(data.cnpj)}</td></tr>` : ""}
        ${data.segment ? `<tr><td><strong>Segmento:</strong></td><td>${esc(data.segment)}</td></tr>` : ""}
        <tr><td><strong>Contato:</strong></td><td>${esc(data.contactName)}</td></tr>
        <tr><td><strong>Telefone:</strong></td><td>${esc(data.phone)}</td></tr>
        <tr><td><strong>Email:</strong></td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
        ${location ? `<tr><td><strong>Endereço:</strong></td><td>${esc(location)}</td></tr>` : ""}
        ${data.description ? `<tr><td valign="top"><strong>Descrição:</strong></td><td style="white-space:pre-wrap">${esc(data.description)}</td></tr>` : ""}
      </table>
      <p style="margin-top:18px;font-family:system-ui,sans-serif">
        <a href="https://www.acomacjoinville.com.br/admin/associates"
           style="display:inline-block;background:#F6811E;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">
          Revisar e aprovar
        </a>
      </p>
      <p style="margin-top:8px;font-size:12px;color:#6b7486;font-family:system-ui,sans-serif">
        Cadastro registrado como pendente até a aprovação.
      </p>
    `,
  });

  return NextResponse.json({ ok: true, id: record.id });
}
