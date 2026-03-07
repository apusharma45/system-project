import { IsOptional, IsString } from 'class-validator';

export class PrescriptionMedicationDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  route?: string;
}
