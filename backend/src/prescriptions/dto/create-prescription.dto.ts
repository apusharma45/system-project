import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { PrescriptionMedicationDto } from './prescription-medication.dto';

export class CreatePrescriptionDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  pharmacyId: string;

  @IsString()
  @MinLength(1)
  notes: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionMedicationDto)
  medications?: PrescriptionMedicationDto[];
}
