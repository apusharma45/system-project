declare class DoctorAvailableTimeSlotDto {
    day: string;
    startTime: string;
    endTime: string;
}
export declare class UpdateDoctorMyProfileDto {
    fullName?: string;
    phone?: string;
    address?: string;
    licenseNumber?: string;
    specialization?: string;
    dateOfBirth?: string;
    gender?: string;
    about?: string;
    clinicName?: string;
    clinicAddress?: string;
    clinicPhone?: string;
    degrees?: string[];
    certifications?: string[];
    yearsOfExperience?: number;
    availableTimeSlots?: DoctorAvailableTimeSlotDto[];
}
export {};
