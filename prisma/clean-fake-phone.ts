import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAKE_RE = /^[\(\s]*47[\)\s]*\s*99999[-\s]?9999\s*$/;

function cleanArray(arr: unknown): unknown {
  if (!Array.isArray(arr)) return arr;
  return arr.filter((item) => {
    if (
      item &&
      typeof item === "object" &&
      "value" in item &&
      typeof (item as { value: unknown }).value === "string"
    ) {
      const v = (item as { value: string }).value;
      if (FAKE_RE.test(v)) return false;
    }
    return true;
  });
}

function deepReplace(value: unknown): unknown {
  if (typeof value === "string") {
    return FAKE_RE.test(value) ? "" : value;
  }
  if (Array.isArray(value)) return value.map((v) => deepReplace(v));
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      next[k] = deepReplace(v);
    }
    return next;
  }
  return value;
}

async function main() {
  const pages = await prisma.pageContent.findMany();
  for (const page of pages) {
    let data: unknown;
    try {
      data = JSON.parse(page.data);
    } catch {
      continue;
    }
    if (!data || typeof data !== "object") continue;
    const obj = data as Record<string, unknown>;

    if (obj.phones) obj.phones = cleanArray(obj.phones);
    const cleaned = deepReplace(obj);

    const before = page.data;
    const after = JSON.stringify(cleaned);
    if (before !== after) {
      await prisma.pageContent.update({
        where: { id: page.id },
        data: { data: after },
      });
      console.log(`✅ ${page.id} limpo`);
    } else {
      console.log(`(skip) ${page.id} sem alteração`);
    }
  }

  // Global content também
  const globals = await prisma.globalContent.findMany();
  for (const g of globals) {
    let data: unknown;
    try {
      data = JSON.parse(g.data);
    } catch {
      continue;
    }
    const cleaned = deepReplace(data);
    const after = JSON.stringify(cleaned);
    if (g.data !== after) {
      await prisma.globalContent.update({
        where: { id: g.id },
        data: { data: after },
      });
      console.log(`✅ global ${g.id} limpo`);
    }
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
