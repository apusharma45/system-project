import '../../../../core/domain/models.dart';

class CreateAppointmentRequest {
  const CreateAppointmentRequest({
    required this.doctorId,
    this.preferredDateFrom,
    this.preferredDateTo,
    this.preferredTimeNote,
    this.reason,
  });

  final String doctorId;
  final DateTime? preferredDateFrom;
  final DateTime? preferredDateTo;
  final String? preferredTimeNote;
  final String? reason;
}

class UpdatePatientProfileRequest {
  const UpdatePatientProfileRequest({
    this.fullName,
    this.phone,
    this.address,
    this.allergies,
    this.chronicConditions,
    this.currentMedications,
    this.emergencyContactName,
    this.emergencyContactPhone,
    this.emergencyContactRelation,
  });

  final String? fullName;
  final String? phone;
  final String? address;
  final String? allergies;
  final String? chronicConditions;
  final String? currentMedications;
  final String? emergencyContactName;
  final String? emergencyContactPhone;
  final String? emergencyContactRelation;
}

abstract class AuthRepository {
  Future<CurrentUser> getCurrentUser();
}

abstract class DoctorsRepository {
  Future<List<UserSummary>> listDoctors();
}

abstract class AppointmentsRepository {
  Future<List<Appointment>> listMyAppointments();
  Future<Appointment> createAppointment(CreateAppointmentRequest request);
  Future<Appointment> cancelAppointment(String appointmentId);
  Future<Appointment?> getAppointmentById(String appointmentId);
}

abstract class LabsRepository {
  Future<List<LabOrder>> listMyLabOrders();
}

abstract class PrescriptionsRepository {
  Future<List<Prescription>> listMyPrescriptions();
  Future<Prescription?> getPrescriptionById(String prescriptionId);
}

abstract class NotificationsRepository {
  Future<List<AppNotification>> listMyNotifications();
  Future<void> markRead(String notificationId);
  Future<void> markAllRead();
}

abstract class PatientProfileRepository {
  Future<PatientProfile> getMyProfile();
  Future<PatientProfile> updateMyProfile(UpdatePatientProfileRequest request);
}
