import { PrescriptionMedicationDto } from './prescription-medication.dto';
export declare class UpdatePrescriptionNotesDto {
    notes?: string;
    diagnosis?: string;
    instructions?: string;
    medications?: PrescriptionMedicationDto[];
}
