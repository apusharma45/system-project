import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { NotificationType } from '../../../generated/prisma/client';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  payload?: Record<string, unknown>;
}
