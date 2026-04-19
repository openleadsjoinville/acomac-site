import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEW_ASSOC = "350";
const NEW_AREA = "1.500m²";

function patchStats(arr: unknown): unknown {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item) => {
    if (
      item &&
      typeof item === "object" &&
      "label" in item &&
      typeof (item as { label: unknown }).label === "string"
    ) {
      const it = item as { value: string; label: string };
      const label = it.label.toLowerCase();
      if (label.includes("associad") || label.includes("empresas")) {
        return { ...it, value: NEW_ASSOC };
      }
      if (
        label.includes("infraestrutura") ||
        label.includes("sede") ||
        label.includes("área") ||
        label.includes("m²") ||
        it.value.includes("m²") ||
        it.value.includes("1.000")
      ) {
        return { ...it, value: NEW_AREA };
      }
    }
    return item;
  });
}

function deepReplaceText(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replaceAll("180+", NEW_ASSOC)
      .replaceAll("1.000m²", NEW_AREA)
      .replaceAll("1.000 m²", NEW_AREA)
      .replaceAll("1000m²", NEW_AREA);
  }
  if (Array.isArray(value)) return value.map((v) => deepReplaceText(v));
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      next[k] = deepReplaceText(v);
    }
    return next;
  }
  return value;
}

async function updatePage(key: string) {
  const page = await prisma.pageContent.findUnique({ where: { id: key } });
  if (!page) {
    console.log(`(skip) página '${key}' não encontrada no DB`);
    return;
  }
  let data: unknown;
  try {
    data = JSON.parse(page.data);
  } catch {
    console.log(`(skip) página '${key}' com JSON inválido`);
    return;
  }
  if (!data || typeof data !== "object") return;
  const obj = data as Record<string, unknown>;

  // Substitui valores em arrays de stats em qualquer profundidade
  if (obj.stats) obj.stats = patchStats(obj.stats);
  if (obj.hero && typeof obj.hero === "object") {
    const hero = obj.hero as Record<string, unknown>;
    if (hero.stats) hero.stats = patchStats(hero.stats);
  }
  if (obj.about && typeof obj.about === "object") {
    const about = obj.about as Record<string, unknown>;
    if (about.highlights) about.highlights = patchStats(about.highlights);
  }

  // Replace residuais nos textos da página
  const finalData = deepReplaceText(obj);

  await prisma.pageContent.update({
    where: { id: key },
    data: { data: JSON.stringify(finalData) },
  });
  console.log(`✅ página '${key}' atualizada`);
}

async function main() {
  await updatePage("home");
  await updatePage("sobre");
  await updatePage("conecta-associados");
  await updatePage("beneficios");
  await updatePage("eventos");
  await updatePage("cursos");
  await updatePage("convenios");
  await updatePage("contato");
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
