export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/li>|<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

export function autoExcerpt(html: string, maxLen = 180): string {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  const sliced = text.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.6 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
}

export function autoReadTime(html: string, wpm = 200): string {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!words) return "";
  const minutes = Math.max(1, Math.round(words / wpm));
  return `${minutes} min`;
}
