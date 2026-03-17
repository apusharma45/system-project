-- AlterTable
ALTER TABLE "Appointment"
ALTER COLUMN "scheduledAt" DROP NOT NULL,
ADD COLUMN "reason" TEXT,
ADD COLUMN "preferredDateFrom" TIMESTAMP(3),
ADD COLUMN "preferredDateTo" TIMESTAMP(3),
ADD COLUMN "preferredTimeNote" TEXT;

-- CreateIndex
CREATE INDEX "Appointment_preferredDateFrom_idx" ON "Appointment"("preferredDateFrom");

-- CreateIndex
CREATE INDEX "Appointment_preferredDateTo_idx" ON "Appointment"("preferredDateTo");
