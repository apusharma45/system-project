export declare const Role: {
    readonly PATIENT: "PATIENT";
    readonly DOCTOR: "DOCTOR";
    readonly PHARMACY: "PHARMACY";
    readonly DIAGNOSTIC: "DIAGNOSTIC";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const AppointmentStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly CONFIRMED: "CONFIRMED";
    readonly CALLED: "CALLED";
    readonly IN_VISIT: "IN_VISIT";
    readonly EXAM_DONE: "EXAM_DONE";
    readonly CLOSED: "CLOSED";
    readonly CANCELLED: "CANCELLED";
};
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
export declare const LabOrderStatus: {
    readonly CREATED: "CREATED";
    readonly ASSIGNED: "ASSIGNED";
    readonly SAMPLE_COLLECTED: "SAMPLE_COLLECTED";
    readonly SENT: "SENT";
};
export type LabOrderStatus = (typeof LabOrderStatus)[keyof typeof LabOrderStatus];
export declare const PrescriptionStatus: {
    readonly DRAFT: "DRAFT";
    readonly SIGNED: "SIGNED";
    readonly SENT_TO_PATIENT: "SENT_TO_PATIENT";
    readonly SENT_TO_PHARMACY: "SENT_TO_PHARMACY";
    readonly DISPENSED: "DISPENSED";
};
export type PrescriptionStatus = (typeof PrescriptionStatus)[keyof typeof PrescriptionStatus];
export declare const NotificationType: {
    readonly APPOINTMENT_CALLED: "APPOINTMENT_CALLED";
    readonly LAB_ASSIGNED: "LAB_ASSIGNED";
    readonly LAB_RESULT_UPLOADED: "LAB_RESULT_UPLOADED";
    readonly PRESCRIPTION_READY: "PRESCRIPTION_READY";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
