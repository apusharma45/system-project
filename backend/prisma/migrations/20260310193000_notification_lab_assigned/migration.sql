-- Add lab assignment notification type for patient visibility
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'LAB_ASSIGNED';
