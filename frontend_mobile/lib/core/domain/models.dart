import 'enums.dart';

class UserLite {
  const UserLite({this.id, this.fullName, this.email});

  final String? id;
  final String? fullName;
  final String? email;
}

class DiagnosticSnapshot {
  const DiagnosticSnapshot({this.name, this.address, this.phone});

  final String? name;
  final String? address;
  final String? phone;
}

class PharmacySnapshot {
  const PharmacySnapshot({this.name, this.address, this.phone});

  final String? name;
  final String? address;
  final String? phone;
}

class CurrentUser {
  const CurrentUser({
    required this.userId,
    required this.email,
    required this.role,
    this.fullName,
    this.avatarUrl,
  });

  final String userId;
  final String email;
  final UserRole role;
  final String? fullName;
  final String? avatarUrl;
}

class UserSummary {
  const UserSummary({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    this.avatarUrl,
    this.specialization,
    this.yearsOfExperience,
  });

  final String id;
  final String email;
  final UserRole role;
  final String? fullName;
  final String? avatarUrl;
  final String? specialization;
  final int? yearsOfExperience;
}

class DoctorAvailableTimeSlot {
  const DoctorAvailableTimeSlot({
    required this.label,
    this.day,
    this.startTime,
    this.endTime,
  });

  final String label;
  final String? day;
  final String? startTime;
  final String? endTime;
}

class DoctorDetails {
  const DoctorDetails({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    this.avatarUrl,
    this.specialization,
    this.yearsOfExperience,
    this.degrees = const <String>[],
    this.about,
    this.clinicName,
    this.clinicAddress,
    this.clinicPhone,
    this.availableTimeSlots = const <DoctorAvailableTimeSlot>[],
  });

  final String id;
  final String email;
  final UserRole role;
  final String? fullName;
  final String? avatarUrl;
  final String? specialization;
  final int? yearsOfExperience;
  final List<String> degrees;
  final String? about;
  final String? clinicName;
  final String? clinicAddress;
  final String? clinicPhone;
  final List<DoctorAvailableTimeSlot> availableTimeSlots;
}

class Appointment {
  const Appointment({
    required this.id,
    required this.patientId,
    required this.doctorId,
    required this.status,
    this.scheduledAt,
    this.reason,
    this.preferredDateFrom,
    this.preferredDateTo,
    this.preferredTimeNote,
    this.requiresLab = false,
    this.labFlowLocked = false,
    this.doctorSnapshot,
    this.patientSnapshot,
  });

  final String id;
  final String patientId;
  final String doctorId;
  final AppointmentStatus status;
  final DateTime? scheduledAt;
  final String? reason;
  final DateTime? preferredDateFrom;
  final DateTime? preferredDateTo;
  final String? preferredTimeNote;
  final bool requiresLab;
  final bool labFlowLocked;
  final UserLite? doctorSnapshot;
  final UserLite? patientSnapshot;
}

class LabReport {
  const LabReport({
    required this.id,
    required this.labOrderId,
    required this.fileUrl,
  });

  final String id;
  final String labOrderId;
  final String fileUrl;
}

class PatientReportRecord {
  const PatientReportRecord({required this.report, required this.labOrder});

  final LabReport report;
  final LabOrder labOrder;
}

class LabOrder {
  const LabOrder({
    required this.id,
    required this.appointmentId,
    required this.diagnosticId,
    required this.status,
    this.tests = const <String>[],
    this.reports = const <LabReport>[],
    this.diagnosticSnapshot,
  });

  final String id;
  final String appointmentId;
  final String diagnosticId;
  final LabOrderStatus status;
  final List<String> tests;
  final List<LabReport> reports;
  final DiagnosticSnapshot? diagnosticSnapshot;
}

class Prescription {
  const Prescription({
    required this.id,
    required this.appointmentId,
    required this.doctorId,
    required this.pharmacyId,
    required this.notes,
    required this.status,
    this.diagnosis,
    this.instructions,
    this.documentUrl,
    this.documentMimeType,
    this.medications = const <PrescriptionMedication>[],
    this.pharmacySnapshot,
  });

  final String id;
  final String appointmentId;
  final String doctorId;
  final String pharmacyId;
  final String notes;
  final PrescriptionStatus status;
  final String? diagnosis;
  final String? instructions;
  final String? documentUrl;
  final String? documentMimeType;
  final List<PrescriptionMedication> medications;
  final PharmacySnapshot? pharmacySnapshot;
}

class PrescriptionMedication {
  const PrescriptionMedication({
    required this.name,
    this.dosage,
    this.frequency,
    this.duration,
  });

  final String name;
  final String? dosage;
  final String? frequency;
  final String? duration;
}

class AppNotification {
  const AppNotification({
    required this.id,
    required this.userId,
    required this.type,
    required this.message,
    required this.read,
    required this.createdAt,
  });

  final String id;
  final String userId;
  final NotificationType type;
  final String message;
  final bool read;
  final DateTime createdAt;
}

class PatientProfile {
  const PatientProfile({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    this.avatarUrl,
    this.phone,
    this.address,
    this.allergies,
    this.chronicConditions,
    this.currentMedications,
    this.emergencyContactName,
    this.emergencyContactPhone,
    this.emergencyContactRelation,
  });

  final String id;
  final String email;
  final UserRole role;
  final String? fullName;
  final String? avatarUrl;
  final String? phone;
  final String? address;
  final String? allergies;
  final String? chronicConditions;
  final String? currentMedications;
  final String? emergencyContactName;
  final String? emergencyContactPhone;
  final String? emergencyContactRelation;
}
