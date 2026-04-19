import { PreviewClient } from "./preview-client";

export const metadata = {
  title: "Prévia do post — ACOMAC",
  robots: { index: false, follow: false },
};

export default function BlogPreviewPage() {
  return <PreviewClient />;
}
