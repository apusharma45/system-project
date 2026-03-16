import 'dart:typed_data';

import '../../../../core/domain/models.dart';

enum PatientRegistrationGender { male, female, other }

class PatientSignUpRequest {
  const PatientSignUpRequest({
    required this.fullName,
    required this.email,
    required this.password,
    required this.phone,
    required this.address,
    required this.gender,
    required this.dateOfBirth,
  });

  final String fullName;
  final String email;
  final String password;
  final String phone;
  final String address;
  final PatientRegistrationGender gender;
  final DateTime dateOfBirth;
}

class ForgotPasswordRequest {
  const ForgotPasswordRequest({required this.email});

  final String email;
}

class ResetPasswordRequest {
  const ResetPasswordRequest({
    required this.email,
    required this.resetCode,
    required this.newPassword,
  });

  final String email;
  final String resetCode;
  final String newPassword;
}

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

class AvatarUploadRequest {
  const AvatarUploadRequest({
    required this.bytes,
    required this.fileName,
    required this.mimeType,
  });

  final Uint8List bytes;
  final String fileName;
  final String mimeType;
}

abstract class AuthRepository {
  Future<CurrentUser> getCurrentUser();
  Future<String> registerPatient(PatientSignUpRequest request);
  Future<void> requestPasswordReset(ForgotPasswordRequest request);
  Future<void> resetPassword(ResetPasswordRequest request);
}

abstract class DoctorsRepository {
  Future<List<UserSummary>> listDoctors();
  Future<DoctorDetails?> getDoctorDetailsById(String doctorId);
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
  Future<PatientProfile> uploadMyAvatar(AvatarUploadRequest request);
  Future<PatientProfile> removeMyAvatar();
}
