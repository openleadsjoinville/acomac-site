import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEW_NUMBER = "5547991103681"; // (47) 99110-3681 com DDI 55

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
    if (obj.whatsapp && typeof obj.whatsapp === "object") {
      const w = obj.whatsapp as Record<string, unknown>;
      w.number = NEW_NUMBER;
    }
    await prisma.globalContent.update({
      where: { id: g.id },
      data: { data: JSON.stringify(obj) },
    });
    console.log(`✅ ${g.id} → whatsapp.number = ${NEW_NUMBER}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
