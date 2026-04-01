import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_exception.dart';
import '../../../../core/domain/models.dart';
import '../mappers/patient_json_mapper.dart';
import 'patient_repositories.dart';

class ApiAuthRepository implements AuthRepository {
  const ApiAuthRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<CurrentUser> getCurrentUser() async {
    final json = await apiClient.getJson('/users/me');
    return mapCurrentUser(json);
  }

  @override
  Future<String> registerPatient(PatientSignUpRequest request) async {
    final payload = <String, dynamic>{
      'fullName': request.fullName.trim(),
      'email': request.email.trim(),
      'password': request.password,
      'phone': request.phone.trim(),
      'address': request.address.trim(),
      'role': 'PATIENT',
      'patientProfile': <String, dynamic>{
        'gender': _mapGender(request.gender),
        'dateOfBirth': _toIsoDate(request.dateOfBirth),
      },
    };

    final json = await apiClient.postJson('/auth/register', payload);
    final token = json['access_token'] as String?;
    if (token == null || token.isEmpty) {
      throw const ApiException('Missing access token in register response');
    }
    return token;
  }

  @override
  Future<void> requestPasswordReset(ForgotPasswordRequest request) async {
    await apiClient.postJson('/auth/forgot-password', <String, dynamic>{
      'email': request.email.trim(),
    });
  }

  @override
  Future<void> resetPassword(ResetPasswordRequest request) async {
    await apiClient.postJson('/auth/reset-password', <String, dynamic>{
      'email': request.email.trim(),
      'resetCode': request.resetCode.trim(),
      'newPassword': request.newPassword,
    });
  }

  String _mapGender(PatientRegistrationGender gender) {
    switch (gender) {
      case PatientRegistrationGender.male:
        return 'MALE';
      case PatientRegistrationGender.female:
        return 'FEMALE';
      case PatientRegistrationGender.other:
        return 'OTHER';
    }
  }

  String _toIsoDate(DateTime value) {
    final y = value.year.toString().padLeft(4, '0');
    final m = value.month.toString().padLeft(2, '0');
    final d = value.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }
}

class ApiDoctorsRepository implements DoctorsRepository {
  const ApiDoctorsRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<List<UserSummary>> listDoctors() async {
    final list = await apiClient.getList('/users/doctors');
    return list
        .map((item) => mapUserSummary((item as Map).cast<String, dynamic>()))
        .toList();
  }

  @override
  Future<DoctorDetails?> getDoctorDetailsById(String doctorId) async {
    final json = await apiClient.getJson('/users/doctors/$doctorId');
    final details = mapDoctorDetails(json);
    if (details.id.isEmpty) return null;
    return details;
  }
}

class ApiAppointmentsRepository implements AppointmentsRepository {
  const ApiAppointmentsRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<Appointment> cancelAppointment(String appointmentId) async {
    final json = await apiClient.patchJson(
      '/appointments/$appointmentId/cancel',
    );
    return mapAppointment(json);
  }

  @override
  Future<Appointment> createAppointment(
    CreateAppointmentRequest request,
  ) async {
    final payload = <String, dynamic>{
      'doctorId': request.doctorId,
      if (request.preferredDateFrom != null)
        'preferredDateFrom': request.preferredDateFrom!
            .toUtc()
            .toIso8601String(),
      if (request.preferredDateTo != null)
        'preferredDateTo': request.preferredDateTo!.toUtc().toIso8601String(),
      if (request.preferredTimeNote != null &&
          request.preferredTimeNote!.trim().isNotEmpty)
        'preferredTimeNote': request.preferredTimeNote!.trim(),
      if (request.reason != null && request.reason!.trim().isNotEmpty)
        'reason': request.reason!.trim(),
    };
    final json = await apiClient.postJson('/appointments', payload);
    return mapAppointment(json);
  }

  @override
  Future<Appointment?> getAppointmentById(String appointmentId) async {
    final appointments = await listMyAppointments();
    for (final item in appointments) {
      if (item.id == appointmentId) return item;
    }
    return null;
  }

  @override
  Future<List<Appointment>> listMyAppointments() async {
    final list = await apiClient.getList('/appointments/me');
    return list
        .map((item) => mapAppointment((item as Map).cast<String, dynamic>()))
        .toList();
  }
}

class ApiLabsRepository implements LabsRepository {
  const ApiLabsRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<List<LabOrder>> listMyLabOrders() async {
    final list = await apiClient.getList('/labs/orders/me');
    return list
        .map((item) => mapLabOrder((item as Map).cast<String, dynamic>()))
        .toList();
  }
}

class ApiPrescriptionsRepository implements PrescriptionsRepository {
  const ApiPrescriptionsRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<Prescription?> getPrescriptionById(String prescriptionId) async {
    final json = await apiClient.getJson('/prescriptions/$prescriptionId');
    return mapPrescription(json);
  }

  @override
  Future<List<Prescription>> listMyPrescriptions() async {
    final list = await apiClient.getList('/prescriptions/me');
    return list
        .map((item) => mapPrescription((item as Map).cast<String, dynamic>()))
        .toList();
  }
}

class ApiNotificationsRepository implements NotificationsRepository {
  const ApiNotificationsRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<List<AppNotification>> listMyNotifications() async {
    final list = await apiClient.getList('/notifications/me');
    return list
        .map((item) => mapNotification((item as Map).cast<String, dynamic>()))
        .toList();
  }

  @override
  Future<void> markAllRead() async {
    await apiClient.patchJson('/notifications/read-all');
  }

  @override
  Future<void> markRead(String notificationId) async {
    await apiClient.patchJson(
      '/notifications/$notificationId/read',
      <String, dynamic>{'read': true},
    );
  }
}

class ApiPatientProfileRepository implements PatientProfileRepository {
  const ApiPatientProfileRepository({required this.apiClient});

  final ApiClient apiClient;

  @override
  Future<PatientProfile> getMyProfile() async {
    final json = await apiClient.getJson('/patients/me/profile');
    return mapPatientProfile(json);
  }

  @override
  Future<PatientProfile> updateMyProfile(
    UpdatePatientProfileRequest request,
  ) async {
    final payload = <String, dynamic>{
      if (request.fullName != null) 'fullName': request.fullName,
      if (request.phone != null) 'phone': request.phone,
      if (request.address != null) 'address': request.address,
      if (request.allergies != null) 'allergies': request.allergies,
      if (request.chronicConditions != null)
        'chronicConditions': request.chronicConditions,
      if (request.currentMedications != null)
        'currentMedications': request.currentMedications,
      if (request.emergencyContactName != null)
        'emergencyContactName': request.emergencyContactName,
      if (request.emergencyContactPhone != null)
        'emergencyContactPhone': request.emergencyContactPhone,
      if (request.emergencyContactRelation != null)
        'emergencyContactRelation': request.emergencyContactRelation,
    };
    final json = await apiClient.patchJson('/patients/me/profile', payload);
    return mapPatientProfile(json);
  }

  @override
  Future<PatientProfile> uploadMyAvatar(AvatarUploadRequest request) async {
    await apiClient.patchMultipartFile(
      path: '/users/me/avatar',
      fieldName: 'file',
      bytes: request.bytes,
      fileName: request.fileName,
      contentType: request.mimeType,
    );
    return getMyProfile();
  }

  @override
  Future<PatientProfile> removeMyAvatar() async {
    await apiClient.deleteJson('/users/me/avatar');
    return getMyProfile();
  }
}
