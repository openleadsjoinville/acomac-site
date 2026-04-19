import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CTAS = {
  associateNow: {
    label: "Associe-se agora",
    message:
      "Olá! Tenho interesse em me associar à ACOMAC Joinville e gostaria de receber mais informações sobre como participar.",
    whatsappNumber: "",
  },
  contactUs: {
    label: "Fale com a gente",
    message:
      "Olá! Vim pelo site da ACOMAC e gostaria de conversar com vocês.",
    whatsappNumber: "",
  },
  requestInfo: {
    label: "Solicitar informações",
    message:
      "Olá! Gostaria de receber mais informações sobre os serviços e benefícios da ACOMAC Joinville.",
    whatsappNumber: "",
  },
};

async function main() {
  const globals = await prisma.globalContent.findMany();
  for (const g of globals) {
    let data: unknown;
    try {
      data = JSON.parse(g.data);
    } catch {
      continue;
    }
    if (!data || typeof data !== "object") continue;
    const obj = data as Record<string, unknown>;
    const existing = (obj.whatsappCtas ?? {}) as Record<string, unknown>;
    obj.whatsappCtas = {
      associateNow: existing.associateNow ?? DEFAULT_CTAS.associateNow,
      contactUs: existing.contactUs ?? DEFAULT_CTAS.contactUs,
      requestInfo: existing.requestInfo ?? DEFAULT_CTAS.requestInfo,
    };
    await prisma.globalContent.update({
      where: { id: g.id },
      data: { data: JSON.stringify(obj) },
    });
    console.log(`✅ ${g.id} → whatsappCtas adicionados/preservados`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
