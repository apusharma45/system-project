-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM (
    'REQUESTED',
    'CONFIRMED',
    'CALLED',
    'IN_VISIT',
    'EXAM_DONE',
    'CLOSED',
    'CANCELLED'
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

-- AddForeignKey
ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_patientId_fkey"
FOREIGN KEY ("patientId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_doctorId_fkey"
FOREIGN KEY ("doctorId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
