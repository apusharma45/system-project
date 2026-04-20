import '../../../../core/domain/enums.dart';

UserRole? parseUserRole(String raw) {
  switch (raw.trim().toUpperCase()) {
    case 'PATIENT':
      return UserRole.patient;
    case 'DOCTOR':
      return UserRole.doctor;
    case 'PHARMACY':
      return UserRole.pharmacy;
    case 'DIAGNOSTIC':
      return UserRole.diagnostic;
    case 'ADMIN':
      return UserRole.admin;
    default:
      return null;
  }
}

AppointmentStatus? parseAppointmentStatus(String raw) {
  switch (raw.trim().toUpperCase()) {
    case 'REQUESTED':
      return AppointmentStatus.requested;
    case 'CONFIRMED':
      return AppointmentStatus.confirmed;
    case 'CALLED':
      return AppointmentStatus.called;
    case 'IN_VISIT':
      return AppointmentStatus.inVisit;
    case 'EXAM_DONE':
      return AppointmentStatus.examDone;
    case 'CLOSED':
      return AppointmentStatus.closed;
    case 'CANCELLED':
      return AppointmentStatus.cancelled;
    default:
      return null;
  }
}

LabOrderStatus? parseLabOrderStatus(String raw) {
  switch (raw.trim().toUpperCase()) {
    case 'CREATED':
      return LabOrderStatus.created;
    case 'ASSIGNED':
      return LabOrderStatus.assigned;
    case 'SAMPLE_COLLECTED':
      return LabOrderStatus.sampleCollected;
    case 'SENT':
      return LabOrderStatus.sent;
    default:
      return null;
  }
}

PrescriptionStatus? parsePrescriptionStatus(String raw) {
  switch (raw.trim().toUpperCase()) {
    case 'DRAFT':
      return PrescriptionStatus.draft;
    case 'SIGNED':
      return PrescriptionStatus.signed;
    case 'SENT_TO_PATIENT':
      return PrescriptionStatus.sentToPatient;
    case 'SENT_TO_PHARMACY':
      return PrescriptionStatus.sentToPharmacy;
    case 'DISPENSED':
      return PrescriptionStatus.dispensed;
    default:
      return null;
  }
}

NotificationType? parseNotificationType(String raw) {
  switch (raw.trim().toUpperCase()) {
    case 'APPOINTMENT_CALLED':
      return NotificationType.appointmentCalled;
    case 'LAB_ASSIGNED':
      return NotificationType.labAssigned;
    case 'LAB_RESULT_UPLOADED':
      return NotificationType.labResultUploaded;
    case 'PRESCRIPTION_READY':
      return NotificationType.prescriptionReady;
    default:
      return null;
  }
}
