"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.PrescriptionStatus = exports.LabOrderStatus = exports.AppointmentStatus = exports.Role = void 0;
exports.Role = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    PHARMACY: 'PHARMACY',
    DIAGNOSTIC: 'DIAGNOSTIC',
    ADMIN: 'ADMIN'
};
exports.AppointmentStatus = {
    REQUESTED: 'REQUESTED',
    CONFIRMED: 'CONFIRMED',
    CALLED: 'CALLED',
    IN_VISIT: 'IN_VISIT',
    EXAM_DONE: 'EXAM_DONE',
    CLOSED: 'CLOSED',
    CANCELLED: 'CANCELLED'
};
exports.LabOrderStatus = {
    CREATED: 'CREATED',
    ASSIGNED: 'ASSIGNED',
    SAMPLE_COLLECTED: 'SAMPLE_COLLECTED',
    SENT: 'SENT'
};
exports.PrescriptionStatus = {
    DRAFT: 'DRAFT',
    SIGNED: 'SIGNED',
    SENT_TO_PATIENT: 'SENT_TO_PATIENT',
    SENT_TO_PHARMACY: 'SENT_TO_PHARMACY',
    DISPENSED: 'DISPENSED'
};
exports.NotificationType = {
    APPOINTMENT_CALLED: 'APPOINTMENT_CALLED',
    LAB_ASSIGNED: 'LAB_ASSIGNED',
    LAB_RESULT_UPLOADED: 'LAB_RESULT_UPLOADED',
    PRESCRIPTION_READY: 'PRESCRIPTION_READY'
};
//# sourceMappingURL=enums.js.map