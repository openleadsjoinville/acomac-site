// Cache-Control para respostas públicas que podem ser servidas pelo CDN.
//
// Centraliza a política para reduzir edge requests / data transfer na Vercel e
// permitir que bots (ex.: facebookexternalhit) sejam atendidos pelo cache do CDN
// em vez de baterem na função de origem a cada acesso.
//
//   public                 -> pode ser guardado por caches compartilhados (CDN)
//   s-maxage=300           -> CDN serve a resposta como "fresca" por 5 minutos
//   stale-while-revalidate -> serve a versão em cache instantaneamente enquanto
//                             revalida em background por até 1 dia
//
// Conteúdo público muda pouco; uma janela de ~5 min é imperceptível e corta a
// grande maioria das requisições repetidas (visitantes em sequência e crawlers).
export const PUBLIC_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=86400";

export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": PUBLIC_CACHE_CONTROL,
} as const;
