-- AlterTable
ALTER TABLE "Event" ADD COLUMN "ctaType" TEXT NOT NULL DEFAULT 'link',
ADD COLUMN "ctaWhatsappNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN "ctaWhatsappMessage" TEXT NOT NULL DEFAULT '';
