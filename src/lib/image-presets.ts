// Presets de dimensão por tipo de campo.
// O nome da chave bate (exato ou sufixo) com o nome do campo no schema.

export type ImagePreset = {
  label: string; // descrição visual
  width: number;
  height: number;
  aspect: number; // width / height
  hint?: string;
  minHeight?: number; // altura mínima do preview grande
  // "contain" mantém a imagem inteira visível (logos, banners verticais).
  // "cover" preenche o preview cortando se necessário (capas, fotos).
  fit?: "contain" | "cover";
};

export const DEFAULT_PRESET: ImagePreset = {
  label: "Imagem",
  width: 1200,
  height: 800,
  aspect: 3 / 2,
  hint: "Recomendado: 1200×800 (formato 3:2). Máximo 10MB.",
  minHeight: 280,
};

export const PRESETS: Record<string, ImagePreset> = {
  logo: {
    label: "Logotipo",
    width: 400,
    height: 120,
    aspect: 400 / 120,
    hint: "Recomendado: 400×120 · PNG transparente ou SVG. Máx. 10MB.",
    minHeight: 200,
    fit: "contain",
  },
  brandlogo: {
    label: "Logotipo",
    width: 400,
    height: 120,
    aspect: 400 / 120,
    hint: "Recomendado: 400×120 · PNG transparente. Máx. 10MB.",
    minHeight: 200,
    fit: "contain",
  },
  backgroundimage: {
    label: "Imagem de fundo",
    width: 1920,
    height: 1080,
    aspect: 16 / 9,
    hint: "Recomendado: 1920×1080 (Full HD, 16:9). Máx. 10MB.",
    minHeight: 360,
  },
  backgroundvideo: {
    label: "Vídeo de fundo",
    width: 1920,
    height: 1080,
    aspect: 16 / 9,
    hint: "Aceita MP4 (arquivo de vídeo) ou imagem 1920×1080. Máx. 10MB.",
    minHeight: 300,
  },
  image: {
    label: "Imagem",
    width: 1600,
    height: 1000,
    aspect: 16 / 10,
    hint: "Recomendado: 1600×1000 (16:10). Máx. 10MB.",
    minHeight: 320,
  },
  coverimage: {
    label: "Imagem de capa",
    width: 1200,
    height: 630,
    aspect: 1200 / 630,
    hint: "Recomendado: 1200×630 (OpenGraph, ótimo p/ redes sociais). Máx. 10MB.",
    minHeight: 300,
  },
  photo: {
    label: "Foto",
    width: 800,
    height: 800,
    aspect: 1,
    hint: "Recomendado: 800×800 (quadrada). Máx. 10MB.",
    minHeight: 300,
  },
  icon: {
    label: "Ícone",
    width: 128,
    height: 128,
    aspect: 1,
    hint: "Recomendado: 128×128 · PNG ou SVG. Máx. 10MB.",
    minHeight: 160,
  },
  displaylogo: {
    label: "Logo de exibição",
    width: 400,
    height: 400,
    aspect: 1,
    hint: "Recomendado: 400×400 (quadrado). Máx. 10MB.",
    minHeight: 200,
  },
  logourl: {
    label: "Logo do associado",
    width: 400,
    height: 400,
    aspect: 1,
    hint: "Recomendado: 400×400 (quadrado). Máx. 10MB.",
    minHeight: 200,
  },
};

// Presets por contexto (usado em formulários dedicados)
export const CONTEXT_PRESETS = {
  eventCover: {
    label: "Imagem do evento",
    width: 1200,
    height: 750,
    aspect: 1200 / 750,
    hint: "Recomendado: 1200×750 (16:10). Aparece como capa do evento. Máx. 10MB.",
    minHeight: 340,
  } as ImagePreset,
  courseCover: {
    label: "Imagem do curso",
    width: 1200,
    height: 750,
    aspect: 1200 / 750,
    hint: "Recomendado: 1200×750. Aparece como capa do curso. Máx. 10MB.",
    minHeight: 340,
  } as ImagePreset,
  blogCover: {
    label: "Capa do post",
    width: 1600,
    height: 900,
    aspect: 16 / 9,
    hint: "Recomendado: 1600×900 (16:9 – bom para compartilhamento). Máx. 10MB.",
    minHeight: 360,
  } as ImagePreset,
  heroBackground: {
    label: "Imagem do hero",
    width: 1920,
    height: 1080,
    aspect: 16 / 9,
    hint: "Recomendado: 1920×1080 (Full HD). Máx. 10MB.",
    minHeight: 360,
  } as ImagePreset,
  popupImage: {
    label: "Imagem do pop-up",
    width: 800,
    height: 800,
    aspect: 1,
    hint: "Recomendado: 800×800 (quadrada). Aparece no lado esquerdo do pop-up. Máx. 10MB.",
    minHeight: 300,
  } as ImagePreset,
  logoAssociate: {
    label: "Logo do associado",
    width: 400,
    height: 400,
    aspect: 1,
    hint: "Recomendado: 400×400 (quadrada). Máx. 10MB.",
    minHeight: 200,
  } as ImagePreset,
  sponsorBanner: {
    label: "Banner do patrocinador",
    width: 600,
    height: 400,
    aspect: 3 / 2,
    hint: "Recomendado: 600×400 (formato 3:2). Aparece como medium rectangle 240×160 na lateral. Máx. 10MB.",
    minHeight: 280,
  } as ImagePreset,
} as const;

export function resolveFieldPreset(fieldName?: string): ImagePreset {
  if (!fieldName) return DEFAULT_PRESET;
  const k = fieldName.toLowerCase();
  if (PRESETS[k]) return PRESETS[k];
  // Match por sufixo comum
  if (k.endsWith("logo")) return PRESETS.logo;
  if (k.endsWith("image")) return PRESETS.image;
  if (k.endsWith("photo")) return PRESETS.photo;
  if (k.endsWith("icon")) return PRESETS.icon;
  return DEFAULT_PRESET;
}
