-- DropIndex
DROP INDEX IF EXISTS "LabOrder_appointmentId_key";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LabOrder_appointmentId_idx" ON "LabOrder"("appointmentId");
