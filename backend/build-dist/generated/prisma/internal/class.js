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
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.3.0",
    "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nenum Role {\n  PATIENT\n  DOCTOR\n  PHARMACY\n  DIAGNOSTIC\n  ADMIN\n}\n\nenum AppointmentStatus {\n  REQUESTED\n  CONFIRMED\n  CALLED\n  IN_VISIT\n  EXAM_DONE\n  CLOSED\n  CANCELLED\n}\n\nenum LabOrderStatus {\n  CREATED\n  ASSIGNED\n  SAMPLE_COLLECTED\n  RESULT_UPLOADED\n  SENT\n}\n\nenum PrescriptionStatus {\n  DRAFT\n  SIGNED\n  SENT_TO_PATIENT\n  SENT_TO_PHARMACY\n  DISPENSED\n}\n\nenum NotificationType {\n  APPOINTMENT_CALLED\n  LAB_RESULT_UPLOADED\n  PRESCRIPTION_READY\n}\n\nmodel User {\n  id           String   @id @default(uuid())\n  email        String   @unique\n  passwordHash String\n  role         Role\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  patientAppointments   Appointment[]  @relation(\"PatientAppointments\")\n  doctorAppointments    Appointment[]  @relation(\"DoctorAppointments\")\n  diagnosticLabOrders   LabOrder[]     @relation(\"DiagnosticLabOrders\")\n  doctorPrescriptions   Prescription[] @relation(\"DoctorPrescriptions\")\n  pharmacyPrescriptions Prescription[] @relation(\"PharmacyPrescriptions\")\n  notifications         Notification[]\n  auditLogs             AuditLog[]     @relation(\"ActorAuditLogs\")\n}\n\nmodel Appointment {\n  id String @id @default(uuid())\n\n  patientId String\n  patient   User   @relation(\"PatientAppointments\", fields: [patientId], references: [id], onDelete: Restrict)\n\n  doctorId String\n  doctor   User   @relation(\"DoctorAppointments\", fields: [doctorId], references: [id], onDelete: Restrict)\n\n  status        AppointmentStatus @default(REQUESTED)\n  scheduledAt   DateTime\n  requiresLab   Boolean           @default(false)\n  labFlowLocked Boolean           @default(false)\n  createdAt     DateTime          @default(now())\n  updatedAt     DateTime          @updatedAt\n  labOrder      LabOrder?\n  prescription  Prescription?\n\n  @@index([patientId])\n  @@index([doctorId])\n  @@index([scheduledAt])\n}\n\nmodel LabOrder {\n  id String @id @default(uuid())\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Restrict)\n\n  diagnosticId String\n  diagnostic   User   @relation(\"DiagnosticLabOrders\", fields: [diagnosticId], references: [id], onDelete: Restrict)\n\n  status    LabOrderStatus @default(CREATED)\n  createdAt DateTime       @default(now())\n  updatedAt DateTime       @updatedAt\n\n  labResult LabResult?\n\n  @@index([diagnosticId])\n}\n\nmodel LabResult {\n  id String @id @default(uuid())\n\n  labOrderId String\n  labOrder   LabOrder @relation(fields: [labOrderId], references: [id], onDelete: Restrict)\n\n  fileUrl    String\n  uploadedAt DateTime @default(now())\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@unique([labOrderId])\n}\n\nmodel Prescription {\n  id String @id @default(uuid())\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Restrict)\n\n  doctorId String\n  doctor   User   @relation(\"DoctorPrescriptions\", fields: [doctorId], references: [id], onDelete: Restrict)\n\n  pharmacyId String\n  pharmacy   User   @relation(\"PharmacyPrescriptions\", fields: [pharmacyId], references: [id], onDelete: Restrict)\n\n  notes     String\n  status    PrescriptionStatus @default(DRAFT)\n  createdAt DateTime           @default(now())\n  updatedAt DateTime           @updatedAt\n\n  @@index([doctorId])\n  @@index([pharmacyId])\n}\n\nmodel Notification {\n  id String @id @default(uuid())\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Restrict)\n\n  type      NotificationType\n  message   String\n  read      Boolean          @default(false)\n  createdAt DateTime         @default(now())\n  updatedAt DateTime         @updatedAt\n\n  @@index([userId, read])\n  @@index([createdAt])\n}\n\nmodel AuditLog {\n  id String @id @default(uuid())\n\n  actorUserId String?\n  actor       User?   @relation(\"ActorAuditLogs\", fields: [actorUserId], references: [id], onDelete: SetNull)\n\n  action     String\n  entityType String\n  entityId   String\n  metadata   Json?\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([actorUserId])\n  @@index([entityType, entityId])\n  @@index([createdAt])\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"patientAppointments\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"PatientAppointments\"},{\"name\":\"doctorAppointments\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"DoctorAppointments\"},{\"name\":\"diagnosticLabOrders\",\"kind\":\"object\",\"type\":\"LabOrder\",\"relationName\":\"DiagnosticLabOrders\"},{\"name\":\"doctorPrescriptions\",\"kind\":\"object\",\"type\":\"Prescription\",\"relationName\":\"DoctorPrescriptions\"},{\"name\":\"pharmacyPrescriptions\",\"kind\":\"object\",\"type\":\"Prescription\",\"relationName\":\"PharmacyPrescriptions\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToUser\"},{\"name\":\"auditLogs\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"ActorAuditLogs\"}],\"dbName\":null},\"Appointment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"patientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"patient\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PatientAppointments\"},{\"name\":\"doctorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"doctor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DoctorAppointments\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AppointmentStatus\"},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"requiresLab\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"labFlowLocked\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"labOrder\",\"kind\":\"object\",\"type\":\"LabOrder\",\"relationName\":\"AppointmentToLabOrder\"},{\"name\":\"prescription\",\"kind\":\"object\",\"type\":\"Prescription\",\"relationName\":\"AppointmentToPrescription\"}],\"dbName\":null},\"LabOrder\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appointmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appointment\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"AppointmentToLabOrder\"},{\"name\":\"diagnosticId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"diagnostic\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DiagnosticLabOrders\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"LabOrderStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"labResult\",\"kind\":\"object\",\"type\":\"LabResult\",\"relationName\":\"LabOrderToLabResult\"}],\"dbName\":null},\"LabResult\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"labOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"labOrder\",\"kind\":\"object\",\"type\":\"LabOrder\",\"relationName\":\"LabOrderToLabResult\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Prescription\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appointmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appointment\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"AppointmentToPrescription\"},{\"name\":\"doctorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"doctor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DoctorPrescriptions\"},{\"name\":\"pharmacyId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pharmacy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PharmacyPrescriptions\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PrescriptionStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationToUser\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"NotificationType\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"read\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actorUserId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ActorAuditLogs\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve().then(() => __importStar(require('node:buffer')));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"))),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js")));
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map