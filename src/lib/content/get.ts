import { prisma } from "@/lib/db";
import {
  GlobalSchema,
  pageSchemas,
  type GlobalContent,
  type PageKey,
  type PageContentMap,
} from "./schema";
import { defaultGlobal, pageDefaults } from "./defaults";

export async function getGlobalContent(): Promise<GlobalContent> {
  // try/catch cobre também falha de conexão (ex.: DB indisponível no build/ISR):
  // cai no conteúdo padrão em vez de derrubar a renderização da página.
  try {
    const row = await prisma.globalContent.findUnique({
      where: { id: "global" },
    });
    if (!row) return defaultGlobal;
    return GlobalSchema.parse(JSON.parse(row.data));
  } catch {
    return defaultGlobal;
  }
}

export async function getPageContent<K extends PageKey>(
  key: K
): Promise<PageContentMap[K]> {
  const fallback = pageDefaults[key] as PageContentMap[K];
  // try/catch cobre também falha de conexão (ex.: DB indisponível no build/ISR).
  try {
    const row = await prisma.pageContent.findUnique({ where: { id: key } });
    if (!row) return fallback;
    const schema = pageSchemas[key];
    return schema.parse(JSON.parse(row.data)) as PageContentMap[K];
  } catch {
    return fallback;
  }
}

export async function setGlobalContent(data: GlobalContent) {
  const validated = GlobalSchema.parse(data);
  await prisma.globalContent.upsert({
    where: { id: "global" },
    create: { id: "global", data: JSON.stringify(validated) },
    update: { data: JSON.stringify(validated) },
  });
}

export async function setPageContent<K extends PageKey>(
  key: K,
  data: PageContentMap[K]
) {
  const schema = pageSchemas[key];
  const validated = schema.parse(data);
  await prisma.pageContent.upsert({
    where: { id: key },
    create: { id: key, data: JSON.stringify(validated) },
    update: { data: JSON.stringify(validated) },
  });
}
