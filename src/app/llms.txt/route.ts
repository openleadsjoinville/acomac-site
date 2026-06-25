import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";
import {
  SITE_NAME,
  SITE_DEFAULT_DESCRIPTION,
  absoluteUrl,
} from "@/lib/site";

// /llms.txt — mapa do site em markdown para assistentes de IA (ChatGPT, Claude,
// Perplexity, Gemini etc.) descobrirem e citarem o conteúdo da ACOMAC.
// Padrão: https://llmstxt.org/ . Cacheado no CDN (ver @/lib/cache).

const PAGES: Array<{ path: string; title: string; desc: string }> = [
  {
    path: "/",
    title: "Início",
    desc: "Visão geral da ACOMAC Joinville: cursos, eventos, convênios e benefícios para o varejo de material de construção.",
  },
  {
    path: "/sobre",
    title: "A ACOMAC",
    desc: "História, missão, visão e valores da associação, fundada em 1983 em Joinville/SC.",
  },
  {
    path: "/beneficios",
    title: "Benefícios para associados",
    desc: "O que a loja associada ganha: capacitação, convênios, representatividade e mais.",
  },
  {
    path: "/cursos",
    title: "Cursos — Academia da Construção",
    desc: "Capacitação técnica e de gestão para lojistas e equipes do varejo de construção.",
  },
  {
    path: "/eventos",
    title: "Eventos",
    desc: "Agenda da ACOMAC: FENAC, rodadas de negócios, encontros com fornecedores e palestras.",
  },
  {
    path: "/convenios",
    title: "Convênios e parcerias",
    desc: "Descontos e vantagens em saúde, educação, combustível, jurídico e outros para associados.",
  },
  {
    path: "/conecta-associados",
    title: "Conecta Associados",
    desc: "Diretório das empresas associadas à ACOMAC Joinville.",
  },
  {
    path: "/blog",
    title: "Blog e notícias",
    desc: "Notícias e conteúdos sobre o varejo de material de construção.",
  },
  {
    path: "/participe-do-conecta-associados",
    title: "Associe-se",
    desc: "Como associar sua loja à ACOMAC Joinville.",
  },
  {
    path: "/contato",
    title: "Contato",
    desc: "Telefone, e-mail, endereço e formulário de contato da associação.",
  },
];

export async function GET() {
  const posts = await prisma.blogPost
    .findMany({
      where: { published: true },
      select: { slug: true, title: true, excerpt: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 25,
    })
    .catch(() => [] as { slug: string; title: string; excerpt: string }[]);

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_DEFAULT_DESCRIPTION}`);
  lines.push("");
  lines.push(
    "A ACOMAC (Associação dos Comerciantes de Material de Construção de " +
      "Joinville) representa o varejo de material de construção da região desde " +
      "1983. Sede: Rua Princesa Isabel, 438, Joinville/SC, 89202-260. " +
      "Telefone: +55 47 3435-0660. E-mail: acomac@acomacjoinville.com.br."
  );
  lines.push("");
  lines.push("## Páginas principais");
  lines.push("");
  for (const p of PAGES) {
    lines.push(`- [${p.title}](${absoluteUrl(p.path)}): ${p.desc}`);
  }

  if (posts.length > 0) {
    lines.push("");
    lines.push("## Blog e notícias");
    lines.push("");
    for (const post of posts) {
      const desc = post.excerpt
        ? `: ${post.excerpt.replace(/\s+/g, " ").trim()}`
        : "";
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)})${desc}`
      );
    }
  }

  lines.push("");
  lines.push("## Recursos");
  lines.push("");
  lines.push(`- [Sitemap XML](${absoluteUrl("/sitemap.xml")})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...PUBLIC_CACHE_HEADERS,
    },
  });
}
