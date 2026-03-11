-- Collapse terminal lab-order states to a single status: SENT
ALTER TABLE "LabOrder" ALTER COLUMN "status" DROP DEFAULT;

UPDATE "LabOrder"
SET "status" = 'SENT'
WHERE "status" = 'RESULT_UPLOADED';

ALTER TYPE "LabOrderStatus" RENAME TO "LabOrderStatus_old";

CREATE TYPE "LabOrderStatus" AS ENUM (
    'CREATED',
    'ASSIGNED',
    'SAMPLE_COLLECTED',
    'SENT'
);

ALTER TABLE "LabOrder"
ALTER COLUMN "status" TYPE "LabOrderStatus"
USING ("status"::text::"LabOrderStatus");

DROP TYPE "LabOrderStatus_old";

ALTER TABLE "LabOrder" ALTER COLUMN "status" SET DEFAULT 'CREATED';
