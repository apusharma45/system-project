-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM (
    'DRAFT',
    'SIGNED',
    'SENT_TO_PATIENT',
    'SENT_TO_PHARMACY',
    'DISPENSED'
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_appointmentId_key" ON "Prescription"("appointmentId");

-- CreateIndex
CREATE INDEX "Prescription_doctorId_idx" ON "Prescription"("doctorId");

-- CreateIndex
CREATE INDEX "Prescription_pharmacyId_idx" ON "Prescription"("pharmacyId");

-- AddForeignKey
ALTER TABLE "Prescription"
ADD CONSTRAINT "Prescription_appointmentId_fkey"
FOREIGN KEY ("appointmentId")
REFERENCES "Appointment"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription"
ADD CONSTRAINT "Prescription_doctorId_fkey"
FOREIGN KEY ("doctorId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription"
ADD CONSTRAINT "Prescription_pharmacyId_fkey"
FOREIGN KEY ("pharmacyId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
