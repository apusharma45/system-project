-- AlterTable
ALTER TABLE "ProfessionalProfile"
ADD COLUMN "about" TEXT,
ADD COLUMN "clinicName" TEXT,
ADD COLUMN "clinicAddress" TEXT,
ADD COLUMN "clinicPhone" TEXT,
ADD COLUMN "availableTimeSlots" JSONB;
