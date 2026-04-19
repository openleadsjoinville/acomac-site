-- AlterTable
ALTER TABLE "Associate" ADD COLUMN "address" TEXT;
ALTER TABLE "Associate" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "Associate" ADD COLUMN "facebook" TEXT;
ALTER TABLE "Associate" ADD COLUMN "hours" TEXT;
ALTER TABLE "Associate" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "Associate" ADD COLUMN "products" TEXT;
ALTER TABLE "Associate" ADD COLUMN "state" TEXT DEFAULT 'SC';
ALTER TABLE "Associate" ADD COLUMN "whatsapp" TEXT;
ALTER TABLE "Associate" ADD COLUMN "yearsInMarket" INTEGER;
ALTER TABLE "Associate" ADD COLUMN "zipCode" TEXT;
