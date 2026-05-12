/**
 * Wrapper minimalista do Resend (https://resend.com) via fetch — sem SDK.
 *
 * Env vars necessárias:
 *  - RESEND_API_KEY      Chave da API (https://resend.com/api-keys)
 *  - NOTIFICATION_EMAIL  Destinatário (ex.: acomac@acomacjoinville.com.br)
 *  - RESEND_FROM         Remetente verificado (ex.: avisos@acomacjoinville.com.br)
 *                        Default: "onboarding@resend.dev" (sandbox do Resend,
 *                        só envia pra email da conta que criou a key).
 *
 * Falhas são silenciosas (log) pra não derrubar o submit do form.
 */

export type EmailPayload = {
  subject: string;
  /** Conteúdo em HTML. Use linhas <p> + <strong> para semântica. */
  html: string;
  /** Sobrescreve o destinatário do .env (opcional). */
  to?: string;
  /** Email do remetente original — útil pra "Reply-To" cair na pessoa certa. */
  replyTo?: string;
};

const RESEND_URL = "https://api.resend.com/emails";

export async function sendNotificationEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY não configurada — pulando envio");
    return false;
  }
  const to = payload.to ?? process.env.NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("[email] NOTIFICATION_EMAIL não configurada — pulando envio");
    return false;
  }
  const from = process.env.RESEND_FROM ?? "ACOMAC Site <onboarding@resend.dev>";

  try {
    const body: Record<string, unknown> = {
      from,
      to,
      subject: payload.subject,
      html: payload.html,
    };
    if (payload.replyTo) body.reply_to = payload.replyTo;

    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[email] Resend retornou", res.status, txt.slice(0, 200));
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[email] falha de rede:", err);
    return false;
  }
}

/** Escape básico pra evitar HTML injection vindo dos campos do form. */
export function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
