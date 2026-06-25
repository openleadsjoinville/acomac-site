// Envio de e-mail de notificação dos formulários via API HTTP do Resend
// (https://resend.com) — sem SDK, só fetch, pra não adicionar dependência.
//
// Variáveis de ambiente (configurar na Vercel):
//   RESEND_API_KEY  (obrigatória)  chave da API do Resend
//   EMAIL_FROM      (opcional)     remetente; default usa o sandbox do Resend.
//                                  Em produção, verifique o domínio no Resend e
//                                  use algo como "ACOMAC Joinville
//                                  <formularios@acomacjoinville.com.br>".
//   EMAIL_TO        (opcional)     destinatário(s), separados por vírgula.
//                                  Default: acomac@acomacjoinville.com.br
//
// É best-effort: nunca lança erro. Se a chave faltar ou o Resend falhar, apenas
// registra no log — o formulário (que já salvou no banco) continua funcionando.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "ACOMAC Joinville <onboarding@resend.dev>";
const DEFAULT_TO = "acomac@acomacjoinville.com.br";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Monta um HTML simples (tabela de rótulo/valor) a partir dos campos do form.
// Campos vazios são omitidos. Quebras de linha viram <br>.
export function renderEmail(
  title: string,
  fields: Array<{ label: string; value?: string | null }>
): string {
  const rows = fields
    .filter((f) => f.value != null && String(f.value).trim() !== "")
    .map(
      (f) =>
        `<tr>` +
        `<td style="padding:8px 12px;font-weight:600;color:#0059AB;white-space:nowrap;vertical-align:top;border-bottom:1px solid #eef2f7">${esc(
          f.label
        )}</td>` +
        `<td style="padding:8px 12px;color:#111;border-bottom:1px solid #eef2f7">${esc(
          String(f.value)
        ).replace(/\n/g, "<br>")}</td>` +
        `</tr>`
    )
    .join("");

  return (
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:8px">` +
    `<h2 style="color:#0059AB;margin:0 0 16px">${esc(title)}</h2>` +
    `<table style="border-collapse:collapse;width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">${rows}</table>` +
    `<p style="color:#94a3b8;font-size:12px;margin-top:20px">Enviado automaticamente pelo site acomacjoinville.com.br</p>` +
    `</div>`
  );
}

export async function sendEmail({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY ausente — e-mail não enviado.");
    return;
  }

  const from = process.env.EMAIL_FROM || DEFAULT_FROM;
  const to = (process.env.EMAIL_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] falha ao enviar (${res.status}): ${detail}`);
    }
  } catch (err) {
    console.error("[email] erro ao enviar:", err);
  }
}
