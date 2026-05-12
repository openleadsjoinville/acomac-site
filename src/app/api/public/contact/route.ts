import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendNotificationEmail, esc } from "@/lib/email";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(4),
  source: z.string().optional().default("contato"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  }
  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      source: data.source,
    },
  });
  await prisma.analyticsEvent.create({
    data: { type: "form_submit", target: data.source, path: "" },
  });

  // Notificação por email (não bloqueia a resposta se falhar)
  void sendNotificationEmail({
    subject: `Novo contato pelo site${data.subject ? ` — ${data.subject}` : ""}`,
    replyTo: data.email,
    html: `
      <h2 style="margin:0 0 12px 0;font-family:system-ui,sans-serif;color:#0e1a2b">Novo contato pelo site ACOMAC</h2>
      <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;color:#0e1a2b">
        <tr><td><strong>Nome:</strong></td><td>${esc(data.name)}</td></tr>
        <tr><td><strong>Email:</strong></td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
        ${data.phone ? `<tr><td><strong>Telefone:</strong></td><td>${esc(data.phone)}</td></tr>` : ""}
        ${data.subject ? `<tr><td><strong>Assunto:</strong></td><td>${esc(data.subject)}</td></tr>` : ""}
        <tr><td valign="top"><strong>Mensagem:</strong></td><td style="white-space:pre-wrap">${esc(data.message)}</td></tr>
        <tr><td><strong>Origem:</strong></td><td>${esc(data.source)}</td></tr>
      </table>
      <p style="margin-top:18px;font-size:12px;color:#6b7486;font-family:system-ui,sans-serif">
        Mensagem registrada no painel em <a href="https://www.acomacjoinville.com.br/admin/messages">/admin/messages</a>.
      </p>
    `,
  });

  return NextResponse.json({ ok: true });
}
