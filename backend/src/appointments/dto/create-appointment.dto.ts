import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @ValidateIf((dto: CreateAppointmentDto) => !dto.scheduledAt)
  @IsDateString()
  preferredDateFrom: string;

  @ValidateIf((dto: CreateAppointmentDto) => !dto.scheduledAt)
  @IsDateString()
  preferredDateTo: string;

  @ValidateIf((dto: CreateAppointmentDto) => !dto.scheduledAt)
  @IsString()
  @MinLength(3)
  reason: string;

  @IsOptional()
  @IsString()
  preferredTimeNote?: string;

  // Backward-compatible legacy field; doctor-scheduled flow should use preferred window fields.
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
