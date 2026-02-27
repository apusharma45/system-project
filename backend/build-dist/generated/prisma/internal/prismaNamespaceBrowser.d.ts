import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Appointment: "Appointment";
    readonly LabOrder: "LabOrder";
    readonly LabResult: "LabResult";
    readonly Prescription: "Prescription";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const AppointmentScalarFieldEnum: {
    readonly id: "id";
    readonly patientId: "patientId";
    readonly doctorId: "doctorId";
    readonly status: "status";
    readonly scheduledAt: "scheduledAt";
    readonly requiresLab: "requiresLab";
    readonly labFlowLocked: "labFlowLocked";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum];
export declare const LabOrderScalarFieldEnum: {
    readonly id: "id";
    readonly appointmentId: "appointmentId";
    readonly diagnosticId: "diagnosticId";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LabOrderScalarFieldEnum = (typeof LabOrderScalarFieldEnum)[keyof typeof LabOrderScalarFieldEnum];
export declare const LabResultScalarFieldEnum: {
    readonly id: "id";
    readonly labOrderId: "labOrderId";
    readonly fileUrl: "fileUrl";
    readonly uploadedAt: "uploadedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LabResultScalarFieldEnum = (typeof LabResultScalarFieldEnum)[keyof typeof LabResultScalarFieldEnum];
export declare const PrescriptionScalarFieldEnum: {
    readonly id: "id";
    readonly appointmentId: "appointmentId";
    readonly doctorId: "doctorId";
    readonly pharmacyId: "pharmacyId";
    readonly notes: "notes";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PrescriptionScalarFieldEnum = (typeof PrescriptionScalarFieldEnum)[keyof typeof PrescriptionScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
