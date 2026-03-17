-- AlterTable
ALTER TABLE "LabResult"
ADD COLUMN "filePublicId" TEXT,
ADD COLUMN "fileMimeType" TEXT,
ADD COLUMN "fileSizeBytes" INTEGER;

-- AlterTable
ALTER TABLE "Prescription"
ADD COLUMN "diagnosis" TEXT,
ADD COLUMN "instructions" TEXT,
ADD COLUMN "medications" JSONB,
ADD COLUMN "documentUrl" TEXT,
ADD COLUMN "documentPublicId" TEXT,
ADD COLUMN "documentMimeType" TEXT,
ADD COLUMN "documentVersion" INTEGER NOT NULL DEFAULT 0;
