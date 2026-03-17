import { NotificationType } from '../../../generated/prisma/client';
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    message: string;
    payload?: Record<string, unknown>;
}
