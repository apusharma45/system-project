-- AlterTable
ALTER TABLE "User"
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "avatarPublicId" TEXT,
ADD COLUMN "avatarMimeType" TEXT,
ADD COLUMN "avatarSizeBytes" INTEGER;
