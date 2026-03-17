import { LabTestItemDto } from './lab-test-item.dto';
export declare class CreateLabOrderDto {
    appointmentId: string;
    diagnosticId: string;
    tests: LabTestItemDto[];
}
