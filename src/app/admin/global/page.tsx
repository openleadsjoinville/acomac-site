import { getGlobalContent } from "@/lib/content/get";
import { GlobalEditor } from "./editor-client";

export const dynamic = "force-dynamic";

export default async function GlobalPage() {
  const initial = await getGlobalContent();
  return <GlobalEditor initial={initial} />;
}
