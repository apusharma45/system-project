-- Drop unique constraint so a single appointment can have multiple prescriptions.
DROP INDEX IF EXISTS "Prescription_appointmentId_key";

-- Keep appointment-based lookups fast.
CREATE INDEX IF NOT EXISTS "Prescription_appointmentId_idx" ON "Prescription"("appointmentId");
