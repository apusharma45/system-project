import { RoleValue } from '../role.values';
declare const GENDER_VALUES: readonly ["MALE", "FEMALE", "OTHER"];
declare class PatientProfileRegisterDto {
    gender: (typeof GENDER_VALUES)[number];
    dateOfBirth: string;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}
declare class ProfessionalProfileRegisterDto {
    gender?: (typeof GENDER_VALUES)[number];
    dateOfBirth?: string;
    licenseNumber?: string;
    specialization?: string;
    pharmacyName?: string;
    labName?: string;
    degrees?: string[];
    certifications?: string[];
    yearsOfExperience?: number;
    licenseAuthority?: string;
    accreditations?: string[];
    availableTests?: string[];
}
export declare class RegisterDto {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: RoleValue;
    patientProfile?: PatientProfileRegisterDto;
    professionalProfile?: ProfessionalProfileRegisterDto;
}
export {};
