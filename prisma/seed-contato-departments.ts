import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_DEPARTMENTS = [
  {
    name: "Associação",
    description:
      "Adesão de novas empresas, emissão de contratos e suporte aos associados.",
    email: "acomac@acomacjoinville.com.br",
  },
  {
    name: "Eventos e Convênios",
    description:
      "FENAC, rodadas de negócios, parcerias comerciais e patrocínios.",
    email: "executivo@acomacjoinville.com.br",
  },
  {
    name: "Academia da Construção",
    description:
      "Inscrições em cursos, turmas corporativas e emissão de certificados.",
    email: "informe@acomacjoinville.com.br",
  },
  {
    name: "Locação de Espaço",
    description:
      "Auditório e salas de treinamento disponíveis para associados e parceiros.",
    email: "informe@acomacjoinville.com.br",
  },
  {
    name: "Telefonia e Certificado Digital",
    description:
      "Planos corporativos com operadoras parceiras e emissão de certificado digital.",
    email: "telefone@acomacjoinville.com.br",
  },
];

async function main() {
  const page = await prisma.pageContent.findUnique({ where: { id: "contato" } });
  if (!page) {
    console.log("Página 'contato' não encontrada");
    return;
  }
  let data: unknown;
  try {
    data = JSON.parse(page.data);
  } catch {
    console.log("JSON inválido");
    return;
  }
  const obj = data as Record<string, unknown>;
  const existing = Array.isArray(obj.departments) ? obj.departments : [];
  if (existing.length === 0) {
    obj.departments = DEFAULT_DEPARTMENTS;
    await prisma.pageContent.update({
      where: { id: "contato" },
      data: { data: JSON.stringify(obj) },
    });
    console.log("✅ contato.departments populado com os 5 padrões");
  } else {
    console.log(`(skip) contato já tem ${existing.length} departamentos`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
