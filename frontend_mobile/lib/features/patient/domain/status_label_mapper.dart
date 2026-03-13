import '../../../core/domain/enums.dart';
import '../data/mappers/enum_parsers.dart';

String appointmentStatusLabelFromRaw(String raw) {
  final status = parseAppointmentStatus(raw);
  return status == null ? 'Unknown ($raw)' : appointmentStatusLabel(status);
}

String notificationTypeLabelFromRaw(String raw) {
  final type = parseNotificationType(raw);
  return type == null ? 'Unknown ($raw)' : notificationTypeLabel(type);
}

String appointmentStatusLabel(AppointmentStatus status) {
  switch (status) {
    case AppointmentStatus.requested:
      return 'Requested';
    case AppointmentStatus.confirmed:
      return 'Confirmed';
    case AppointmentStatus.called:
      return 'Called';
    case AppointmentStatus.inVisit:
      return 'In Visit';
    case AppointmentStatus.examDone:
      return 'Exam Done';
    case AppointmentStatus.closed:
      return 'Closed';
    case AppointmentStatus.cancelled:
      return 'Cancelled';
  }
}

String labOrderStatusLabel(LabOrderStatus status) {
  switch (status) {
    case LabOrderStatus.created:
      return 'Created';
    case LabOrderStatus.assigned:
      return 'Assigned';
    case LabOrderStatus.sampleCollected:
      return 'Sample Collected';
    case LabOrderStatus.sent:
      return 'Sent';
  }
}

String prescriptionStatusLabel(PrescriptionStatus status) {
  switch (status) {
    case PrescriptionStatus.draft:
      return 'Draft';
    case PrescriptionStatus.signed:
      return 'Signed';
    case PrescriptionStatus.sentToPatient:
      return 'Sent to Patient';
    case PrescriptionStatus.sentToPharmacy:
      return 'Sent to Pharmacy';
    case PrescriptionStatus.dispensed:
      return 'Dispensed';
  }
}

String notificationTypeLabel(NotificationType type) {
  switch (type) {
    case NotificationType.appointmentCalled:
      return 'Appointment Called';
    case NotificationType.labAssigned:
      return 'Lab Assigned';
    case NotificationType.labResultUploaded:
      return 'Lab Result Uploaded';
    case NotificationType.prescriptionReady:
      return 'Prescription Ready';
  }
}
