enum UserRole { patient, doctor, pharmacy, diagnostic, admin }

enum AppointmentStatus {
  requested,
  confirmed,
  called,
  inVisit,
  examDone,
  closed,
  cancelled,
}

enum LabOrderStatus { created, assigned, sampleCollected, sent }

enum PrescriptionStatus {
  draft,
  signed,
  sentToPatient,
  sentToPharmacy,
  dispensed,
}

enum NotificationType {
  appointmentCalled,
  labAssigned,
  labResultUploaded,
  prescriptionReady,
}
