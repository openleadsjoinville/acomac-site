import { PrismaClient } from "@prisma/client";
import { defaultGlobal, pageDefaults } from "../src/lib/content/defaults";

const prisma = new PrismaClient();

async function main() {
  // Global + pages (upsert, preserva edições feitas)
  await prisma.globalContent.upsert({
    where: { id: "global" },
    create: { id: "global", data: JSON.stringify(defaultGlobal) },
    update: {},
  });

  for (const [key, content] of Object.entries(pageDefaults)) {
    await prisma.pageContent.upsert({
      where: { id: key },
      create: { id: key, data: JSON.stringify(content) },
      update: {},
    });
  }

  // Seed Events (3 exemplos)
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          slug: "fenac-2026",
          title: "FENAC 2026",
          description:
            "A maior feira do varejo de material de construção de Santa Catarina. Rodadas de negócios, palestras e networking.",
          content:
            "A FENAC é o evento mais importante do setor em SC, reunindo mais de 500 empresários, indústria e varejo em três dias intensos de negócios.",
          date: new Date("2026-08-20T09:00:00"),
          endDate: new Date("2026-08-22T18:00:00"),
          location: "Expoville · Joinville, SC",
          image: "",
          ctaLabel: "Inscrever-se",
          ctaHref: "#",
          featured: true,
          published: true,
          orderIndex: 0,
        },
        {
          slug: "rodada-negocios-maio-2026",
          title: "Rodada de Negócios — Maio/2026",
          description:
            "Encontros diretos entre associados e fornecedores para geração de negócios com condições exclusivas.",
          content: "",
          date: new Date("2026-05-15T14:00:00"),
          location: "Sede ACOMAC",
          image: "",
          featured: false,
          published: true,
          orderIndex: 1,
        },
        {
          slug: "cafe-com-associados-abril",
          title: "Café com Associados",
          description:
            "Encontro mensal para troca de experiências e debate sobre o mercado.",
          date: new Date("2026-04-25T08:30:00"),
          location: "Sede ACOMAC",
          featured: false,
          published: true,
          orderIndex: 2,
        },
      ],
    });
  }

  // Seed Courses
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: [
        {
          slug: "vendas-consultivas",
          title: "Vendas Consultivas no Varejo",
          description:
            "Técnicas modernas de atendimento e fechamento para lojas de material de construção.",
          category: "Vendas",
          duration: "16h",
          level: "Básico",
          price: "Associados: grátis · Não associados: R$ 380",
          instructor: "Equipe ACOMAC",
          published: true,
          orderIndex: 0,
        },
        {
          slug: "gestao-financeira",
          title: "Gestão Financeira para Lojistas",
          description:
            "Fluxo de caixa, margem de contribuição e precificação para quem toca o dia a dia da loja.",
          category: "Gestão",
          duration: "20h",
          level: "Intermediário",
          price: "Associados: R$ 120 · Não associados: R$ 480",
          published: true,
          orderIndex: 1,
        },
        {
          slug: "marketing-digital",
          title: "Marketing Digital para Varejo",
          description:
            "Instagram, Google Ads e conteúdo orgânico aplicados ao varejo da construção.",
          category: "Marketing",
          duration: "12h",
          level: "Básico",
          price: "Associados: R$ 90 · Não associados: R$ 380",
          published: true,
          orderIndex: 2,
        },
      ],
    });
  }

  // Seed Blog
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          slug: "varejo-construcao-cresce-sc",
          title: "Varejo de material de construção cresce 4% em SC",
          excerpt:
            "Dados da pesquisa trimestral apontam recuperação do setor no primeiro trimestre de 2026.",
          content:
            "# Varejo em alta\n\nA pesquisa trimestral da ACOMAC aponta crescimento de 4% no faturamento do varejo de material de construção em Santa Catarina no primeiro trimestre de 2026.\n\n## Destaques\n\n- Tintas e acabamentos puxaram o crescimento\n- Joinville e Blumenau lideram o ranking\n- Expectativa positiva para o segundo semestre",
          coverImage: "",
          author: "ACOMAC Joinville",
          tags: "mercado, pesquisa",
          category: "Mercado",
          readTime: "3 min",
          published: true,
          publishedAt: new Date("2026-03-28"),
          featured: true,
        },
        {
          slug: "como-precificar-materiais",
          title: "Como precificar materiais de construção de forma correta",
          excerpt:
            "Guia prático de precificação considerando margem, impostos e concorrência.",
          content:
            "Precificar produtos de material de construção envolve mais que custo + margem. É preciso considerar impostos, frete, concorrência local e giro de estoque.",
          author: "Equipe ACOMAC",
          tags: "gestão, preço",
          category: "Gestão",
          readTime: "5 min",
          published: true,
          publishedAt: new Date("2026-03-15"),
        },
      ],
    });
  }

  // Categorias padrão do blog
  const defaultCategories = ["Mercado", "Gestão", "Eventos", "Educação", "Benefícios", "Notícias", "Institucional"];
  for (const name of defaultCategories) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    await prisma.blogCategory.upsert({
      where: { name },
      create: { name, slug },
      update: {},
    });
  }

  console.log("Seed completo: global, pages, events, courses, blog, categorias.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
