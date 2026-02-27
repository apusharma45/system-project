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
