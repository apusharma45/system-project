-- Add password reset codes table for code-based forgot-password flow.
CREATE TABLE IF NOT EXISTS "PasswordResetCode" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PasswordResetCode"
ADD CONSTRAINT "PasswordResetCode_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "PasswordResetCode_email_createdAt_idx"
ON "PasswordResetCode"("email", "createdAt");

CREATE INDEX IF NOT EXISTS "PasswordResetCode_userId_createdAt_idx"
ON "PasswordResetCode"("userId", "createdAt");
