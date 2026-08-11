/**
 * Helpers de texto compartilhados entre o conteúdo do blog e o dos cursos.
 * O conteúdo salvo pelo admin pode vir como HTML (editor rich text) ou como
 * texto puro digitado antes do editor existir — os dois casos precisam
 * renderizar bem no site.
 */

const HTML_BLOCK_RE = /<(p|h[1-6]|ul|ol|li|blockquote|pre|img|hr|div)\b/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Converte o conteúdo salvo em HTML pronto para exibição.
 * Já sendo HTML, devolve como está; sendo texto puro, monta parágrafos,
 * títulos (#, ##, ###) e listas (- item).
 */
export function renderRichText(content: string): string {
  if (!content) return "";
  if (HTML_BLOCK_RE.test(content)) return content;

  return content
    .split(/\n{2,}/)
    .map((raw) => {
      const b = raw.trim();
      if (!b) return "";
      if (b.startsWith("### ")) return `<h3>${escapeHtml(b.slice(4))}</h3>`;
      if (b.startsWith("## ")) return `<h2>${escapeHtml(b.slice(3))}</h2>`;
      if (b.startsWith("# ")) return `<h2>${escapeHtml(b.slice(2))}</h2>`;
      if (/^-\s/.test(b)) {
        const items = b
          .split("\n")
          .filter((l) => /^-\s/.test(l))
          .map((l) => `<li>${escapeHtml(l.replace(/^-\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(b).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

/** Tira tags e entidades para sobrar só o texto legível. */
export function plainText(content: string): string {
  if (!content) return "";
  return content
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resumo curto para cards: corta no limite sem partir palavra e fecha com "…".
 * Protege o layout mesmo quando o texto cadastrado é longo demais.
 */
export function resumo(content: string, max = 160): string {
  const texto = plainText(content);
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  const espaco = corte.lastIndexOf(" ");
  return `${(espaco > max * 0.6 ? corte.slice(0, espaco) : corte).replace(/[.,;:!?-]+$/, "")}…`;
}
