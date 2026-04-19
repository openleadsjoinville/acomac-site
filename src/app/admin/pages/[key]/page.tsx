import { notFound } from "next/navigation";
import { PAGE_KEYS, type PageKey } from "@/lib/content/schema";
import { getPageContent } from "@/lib/content/get";
import { PageContentEditor } from "./editor-client";

export const dynamic = "force-dynamic";

const TITLES: Record<PageKey, string> = {
  home: "Home",
  sobre: "A ACOMAC",
  beneficios: "Benefícios",
  convenios: "Convênios",
  cursos: "Cursos",
  eventos: "Eventos",
  "conecta-associados": "Conecta Associados",
  contato: "Contato",
};

const PREVIEW_URLS: Record<PageKey, string> = {
  home: "/",
  sobre: "/sobre",
  beneficios: "/beneficios",
  convenios: "/convenios",
  cursos: "/cursos",
  eventos: "/eventos",
  "conecta-associados": "/conecta-associados",
  contato: "/contato",
};

export default async function PageEditorRoute({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!(PAGE_KEYS as readonly string[]).includes(key)) notFound();
  const pk = key as PageKey;
  const content = await getPageContent(pk);

  return (
    <PageContentEditor
      pageKey={pk}
      title={TITLES[pk]}
      previewUrl={PREVIEW_URLS[pk]}
      initial={content}
    />
  );
}
