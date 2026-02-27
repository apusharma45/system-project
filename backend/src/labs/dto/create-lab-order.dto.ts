import { IsUUID } from 'class-validator';

export class CreateLabOrderDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  diagnosticId: string;
}
