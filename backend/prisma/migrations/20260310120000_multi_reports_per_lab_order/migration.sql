-- Remove one-result-per-order uniqueness and support multiple reports per lab order
DROP INDEX IF EXISTS "LabResult_labOrderId_key";

-- Helpful lookups for latest report and per-order history
CREATE INDEX IF NOT EXISTS "LabResult_labOrderId_idx" ON "LabResult"("labOrderId");
CREATE INDEX IF NOT EXISTS "LabResult_uploadedAt_idx" ON "LabResult"("uploadedAt");
