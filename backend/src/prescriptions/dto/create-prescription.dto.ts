import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreatePrescriptionDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  pharmacyId: string;

  @IsString()
  @MinLength(1)
  notes: string;
}
