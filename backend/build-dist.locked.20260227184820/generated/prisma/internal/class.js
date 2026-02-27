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
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nenum Role {\n  PATIENT\n  DOCTOR\n  PHARMACY\n  DIAGNOSTIC\n  ADMIN\n}\n\nenum AppointmentStatus {\n  REQUESTED\n  CONFIRMED\n  CALLED\n  IN_VISIT\n  EXAM_DONE\n  CLOSED\n  CANCELLED\n}\n\nmodel User {\n  id           String   @id @default(uuid())\n  email        String   @unique\n  passwordHash String\n  role         Role\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  patientAppointments Appointment[] @relation(\"PatientAppointments\")\n  doctorAppointments  Appointment[] @relation(\"DoctorAppointments\")\n}\n\nmodel Appointment {\n  id String @id @default(uuid())\n\n  patientId String\n  patient   User   @relation(\"PatientAppointments\", fields: [patientId], references: [id], onDelete: Restrict)\n\n  doctorId String\n  doctor   User   @relation(\"DoctorAppointments\", fields: [doctorId], references: [id], onDelete: Restrict)\n\n  status      AppointmentStatus @default(REQUESTED)\n  scheduledAt DateTime\n  createdAt   DateTime          @default(now())\n  updatedAt   DateTime          @updatedAt\n\n  @@index([patientId])\n  @@index([doctorId])\n  @@index([scheduledAt])\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"patientAppointments\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"PatientAppointments\"},{\"name\":\"doctorAppointments\",\"kind\":\"object\",\"type\":\"Appointment\",\"relationName\":\"DoctorAppointments\"}],\"dbName\":null},\"Appointment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"patientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"patient\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PatientAppointments\"},{\"name\":\"doctorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"doctor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DoctorAppointments\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AppointmentStatus\"},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
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