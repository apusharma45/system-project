-- CreateEnum
CREATE TYPE "LabOrderStatus" AS ENUM (
    'CREATED',
    'ASSIGNED',
    'SAMPLE_COLLECTED',
    'RESULT_UPLOADED',
    'SENT'
);

-- AlterTable
ALTER TABLE "Appointment"
ADD COLUMN "requiresLab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "labFlowLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "diagnosticId" TEXT NOT NULL,
    "status" "LabOrderStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "labOrderId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_appointmentId_key" ON "LabOrder"("appointmentId");

-- CreateIndex
CREATE INDEX "LabOrder_diagnosticId_idx" ON "LabOrder"("diagnosticId");

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_labOrderId_key" ON "LabResult"("labOrderId");

-- AddForeignKey
ALTER TABLE "LabOrder"
ADD CONSTRAINT "LabOrder_appointmentId_fkey"
FOREIGN KEY ("appointmentId")
REFERENCES "Appointment"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder"
ADD CONSTRAINT "LabOrder_diagnosticId_fkey"
FOREIGN KEY ("diagnosticId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult"
ADD CONSTRAINT "LabResult_labOrderId_fkey"
FOREIGN KEY ("labOrderId")
REFERENCES "LabOrder"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
