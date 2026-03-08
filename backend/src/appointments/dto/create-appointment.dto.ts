import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsOptional()
  @IsDateString()
  preferredDateFrom?: string;

  @IsOptional()
  @IsDateString()
  preferredDateTo?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  reason?: string;

  @IsOptional()
  @IsString()
  preferredTimeNote?: string;

  // Backward-compatible legacy field; doctor-scheduled flow should use preferred window fields.
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
