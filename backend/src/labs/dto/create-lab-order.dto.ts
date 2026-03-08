import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { LabTestItemDto } from './lab-test-item.dto';

export class CreateLabOrderDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  diagnosticId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LabTestItemDto)
  tests: LabTestItemDto[];
}
