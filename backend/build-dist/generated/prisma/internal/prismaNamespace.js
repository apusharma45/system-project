"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.SortOrder = exports.AuditLogScalarFieldEnum = exports.NotificationScalarFieldEnum = exports.PrescriptionScalarFieldEnum = exports.LabResultScalarFieldEnum = exports.LabOrderScalarFieldEnum = exports.AppointmentScalarFieldEnum = exports.ProfessionalProfileScalarFieldEnum = exports.PatientProfileScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.3.0",
    engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    PatientProfile: 'PatientProfile',
    ProfessionalProfile: 'ProfessionalProfile',
    Appointment: 'Appointment',
    LabOrder: 'LabOrder',
    LabResult: 'LabResult',
    Prescription: 'Prescription',
    Notification: 'Notification',
    AuditLog: 'AuditLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    address: 'address',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PatientProfileScalarFieldEnum = {
    id: 'id',
    patientId: 'patientId',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    phone: 'phone',
    address: 'address',
    allergies: 'allergies',
    chronicConditions: 'chronicConditions',
    currentMedications: 'currentMedications',
    emergencyContactName: 'emergencyContactName',
    emergencyContactPhone: 'emergencyContactPhone',
    emergencyContactRelation: 'emergencyContactRelation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProfessionalProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    licenseNumber: 'licenseNumber',
    specialization: 'specialization',
    pharmacyName: 'pharmacyName',
    labName: 'labName',
    gender: 'gender',
    dateOfBirth: 'dateOfBirth',
    degrees: 'degrees',
    certifications: 'certifications',
    yearsOfExperience: 'yearsOfExperience',
    licenseAuthority: 'licenseAuthority',
    accreditations: 'accreditations',
    availableTests: 'availableTests',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AppointmentScalarFieldEnum = {
    id: 'id',
    patientId: 'patientId',
    doctorId: 'doctorId',
    status: 'status',
    scheduledAt: 'scheduledAt',
    reason: 'reason',
    preferredDateFrom: 'preferredDateFrom',
    preferredDateTo: 'preferredDateTo',
    preferredTimeNote: 'preferredTimeNote',
    requiresLab: 'requiresLab',
    labFlowLocked: 'labFlowLocked',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LabOrderScalarFieldEnum = {
    id: 'id',
    appointmentId: 'appointmentId',
    diagnosticId: 'diagnosticId',
    status: 'status',
    tests: 'tests',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LabResultScalarFieldEnum = {
    id: 'id',
    labOrderId: 'labOrderId',
    fileUrl: 'fileUrl',
    filePublicId: 'filePublicId',
    fileMimeType: 'fileMimeType',
    fileSizeBytes: 'fileSizeBytes',
    uploadedAt: 'uploadedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PrescriptionScalarFieldEnum = {
    id: 'id',
    appointmentId: 'appointmentId',
    doctorId: 'doctorId',
    pharmacyId: 'pharmacyId',
    notes: 'notes',
    diagnosis: 'diagnosis',
    instructions: 'instructions',
    medications: 'medications',
    status: 'status',
    documentUrl: 'documentUrl',
    documentPublicId: 'documentPublicId',
    documentMimeType: 'documentMimeType',
    documentVersion: 'documentVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    message: 'message',
    read: 'read',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    actorUserId: 'actorUserId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map