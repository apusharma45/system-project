import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePrescriptionNotesDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  notes: string;
}
