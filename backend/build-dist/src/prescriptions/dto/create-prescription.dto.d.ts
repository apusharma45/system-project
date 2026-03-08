import { PrescriptionMedicationDto } from './prescription-medication.dto';
export declare class CreatePrescriptionDto {
    appointmentId: string;
    pharmacyId: string;
    notes: string;
    diagnosis?: string;
    instructions?: string;
    medications?: PrescriptionMedicationDto[];
}
