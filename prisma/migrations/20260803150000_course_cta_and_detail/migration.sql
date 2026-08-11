-- AlterTable
ALTER TABLE "Course" ADD COLUMN "ctaType" TEXT NOT NULL DEFAULT 'whatsapp',
ADD COLUMN "ctaWhatsappNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN "ctaWhatsappMessage" TEXT NOT NULL DEFAULT '';

-- Migra os dados legados: até aqui "ctaHref" guardava o telefone do WhatsApp e
-- "ctaLabel" guardava a mensagem. Agora esses dois campos voltam ao significado
-- natural (URL externa e rótulo do botão), então o conteúdo antigo se muda para
-- as colunas novas.
UPDATE "Course"
SET "ctaWhatsappNumber" = "ctaHref",
    "ctaWhatsappMessage" = "ctaLabel",
    "ctaHref" = '',
    "ctaLabel" = ''
WHERE "ctaHref" <> '' OR "ctaLabel" <> '';
