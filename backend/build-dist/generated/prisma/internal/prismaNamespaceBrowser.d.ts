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
    readonly PatientProfile: "PatientProfile";
    readonly Appointment: "Appointment";
    readonly LabOrder: "LabOrder";
    readonly LabResult: "LabResult";
    readonly Prescription: "Prescription";
    readonly Notification: "Notification";
    readonly AuditLog: "AuditLog";
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
    readonly fullName: "fullName";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const PatientProfileScalarFieldEnum: {
    readonly id: "id";
    readonly patientId: "patientId";
    readonly dateOfBirth: "dateOfBirth";
    readonly gender: "gender";
    readonly phone: "phone";
    readonly address: "address";
    readonly allergies: "allergies";
    readonly chronicConditions: "chronicConditions";
    readonly currentMedications: "currentMedications";
    readonly emergencyContactName: "emergencyContactName";
    readonly emergencyContactPhone: "emergencyContactPhone";
    readonly emergencyContactRelation: "emergencyContactRelation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PatientProfileScalarFieldEnum = (typeof PatientProfileScalarFieldEnum)[keyof typeof PatientProfileScalarFieldEnum];
export declare const AppointmentScalarFieldEnum: {
    readonly id: "id";
    readonly patientId: "patientId";
    readonly doctorId: "doctorId";
    readonly status: "status";
    readonly scheduledAt: "scheduledAt";
    readonly reason: "reason";
    readonly preferredDateFrom: "preferredDateFrom";
    readonly preferredDateTo: "preferredDateTo";
    readonly preferredTimeNote: "preferredTimeNote";
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
    readonly tests: "tests";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LabOrderScalarFieldEnum = (typeof LabOrderScalarFieldEnum)[keyof typeof LabOrderScalarFieldEnum];
export declare const LabResultScalarFieldEnum: {
    readonly id: "id";
    readonly labOrderId: "labOrderId";
    readonly fileUrl: "fileUrl";
    readonly filePublicId: "filePublicId";
    readonly fileMimeType: "fileMimeType";
    readonly fileSizeBytes: "fileSizeBytes";
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
    readonly diagnosis: "diagnosis";
    readonly instructions: "instructions";
    readonly medications: "medications";
    readonly status: "status";
    readonly documentUrl: "documentUrl";
    readonly documentPublicId: "documentPublicId";
    readonly documentMimeType: "documentMimeType";
    readonly documentVersion: "documentVersion";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PrescriptionScalarFieldEnum = (typeof PrescriptionScalarFieldEnum)[keyof typeof PrescriptionScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly message: "message";
    readonly read: "read";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly actorUserId: "actorUserId";
    readonly action: "action";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
