import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/app_dependencies.dart';
import 'package:frontend_mobile/app/permissions/notification_permission_coordinator.dart';
import 'package:frontend_mobile/app/permissions/storage_permission_coordinator.dart';
import 'package:frontend_mobile/app/app_scope.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/core/config/app_config.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/realtime/notifications_realtime_service.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';
import 'package:frontend_mobile/features/patient/presentation/controllers/notifications_center_controller.dart';

Future<AppDependencies> makeTestDependencies() async {
  SharedPreferences.setMockInitialValues(<String, Object>{});
  final prefs = await SharedPreferences.getInstance();
  late final SessionController session;
  final api = ApiClient(
    baseUrl: 'http://localhost:3000',
    tokenProvider: () => session.token,
    httpClient: MockClient((request) async {
      final path = request.url.path;
      if (path.endsWith('/appointments/me') ||
          path.endsWith('/notifications/me') ||
          path.endsWith('/users/doctors') ||
          path.endsWith('/prescriptions/me') ||
          path.endsWith('/labs/orders/me')) {
        return http.Response('[]', 200);
      }
      return http.Response('{}', 200);
    }),
  );
  session = SessionController(apiClient: api, preferences: prefs);

  return makeTestDependenciesWithSession(session: session, apiClient: api);
}

AppDependencies makeTestDependenciesWithSession({
  required SessionController session,
  required ApiClient apiClient,
  AuthRepository? authRepository,
  DoctorsRepository? doctorsRepository,
  AppointmentsRepository? appointmentsRepository,
  LabsRepository? labsRepository,
  PrescriptionsRepository? prescriptionsRepository,
  NotificationsRepository? notificationsRepository,
  PatientProfileRepository? patientProfileRepository,
  NotificationsRealtimeService? notificationsRealtimeService,
}) {
  final resolvedDoctorsRepo =
      doctorsRepository ?? const _FakeDoctorsRepository();
  final resolvedAuthRepository = authRepository ?? const _FakeAuthRepository();
  final resolvedAppointmentsRepo =
      appointmentsRepository ?? const _FakeAppointmentsRepository();
  final resolvedLabsRepo = labsRepository ?? const _FakeLabsRepository();
  final resolvedPrescriptionsRepo =
      prescriptionsRepository ?? const _FakePrescriptionsRepository();
  final resolvedNotificationsRepo =
      notificationsRepository ?? const _FakeNotificationsRepository();
  final resolvedProfileRepo =
      patientProfileRepository ?? const _FakePatientProfileRepository();
  final resolvedRealtimeService =
      notificationsRealtimeService ?? const _FakeNotificationsRealtimeService();

  return AppDependencies(
    config: const AppConfig(
      apiBaseUrl: 'http://localhost:3000',
      wsBaseUrl: 'ws://localhost:3000',
    ),
    apiClient: apiClient,
    session: session,
    authRepository: resolvedAuthRepository,
    doctorsRepository: resolvedDoctorsRepo,
    appointmentsRepository: resolvedAppointmentsRepo,
    labsRepository: resolvedLabsRepo,
    prescriptionsRepository: resolvedPrescriptionsRepo,
    notificationsRepository: resolvedNotificationsRepo,
    patientProfileRepository: resolvedProfileRepo,
    notificationsRealtimeService: resolvedRealtimeService,
    notificationsCenterController: NotificationsCenterController(
      session: session,
      notificationsRepository: resolvedNotificationsRepo,
      realtimeService: resolvedRealtimeService,
      wsBaseUrl: 'ws://localhost:3000',
      pollInterval: const Duration(milliseconds: 50),
    ),
    notificationPermissionCoordinator: NotificationPermissionCoordinator(
      preferences: session.preferences,
      requester: const _FakeNotificationPermissionRequester(),
    ),
    storagePermissionCoordinator: StoragePermissionCoordinator(
      preferences: session.preferences,
      requester: const _FakeStoragePermissionRequester(),
    ),
  );
}

Widget wrapWithScope({
  required AppDependencies dependencies,
  required Widget child,
}) {
  return AppScope(dependencies: dependencies, child: child);
}

class _FakeAuthRepository implements AuthRepository {
  const _FakeAuthRepository();

  @override
  Future<CurrentUser> getCurrentUser() async {
    return const CurrentUser(
      userId: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient One',
    );
  }

  @override
  Future<String> registerPatient(PatientSignUpRequest request) async {
    return 'fake-token';
  }

  @override
  Future<void> requestPasswordReset(ForgotPasswordRequest request) async {}

  @override
  Future<void> resetPassword(ResetPasswordRequest request) async {}
}

class _FakeDoctorsRepository implements DoctorsRepository {
  const _FakeDoctorsRepository();

  @override
  Future<List<UserSummary>> listDoctors() async {
    return const <UserSummary>[
      UserSummary(
        id: 'd1',
        email: 'doctor@example.com',
        role: UserRole.doctor,
        fullName: 'Dr. Test',
        specialization: 'Cardiology',
        yearsOfExperience: 8,
      ),
    ];
  }

  @override
  Future<DoctorDetails?> getDoctorDetailsById(String doctorId) async {
    if (doctorId != 'd1') return null;
    return const DoctorDetails(
      id: 'd1',
      email: 'doctor@example.com',
      role: UserRole.doctor,
      fullName: 'Dr. Test',
      specialization: 'Cardiology',
      yearsOfExperience: 8,
      degrees: <String>['MBBS', 'MD'],
      about: 'Patient-focused cardiology specialist.',
      clinicName: 'Heart Care Clinic',
      clinicAddress: '123 Main Street',
      clinicPhone: '+15550003333',
      availableTimeSlots: <DoctorAvailableTimeSlot>[
        DoctorAvailableTimeSlot(
          label: 'Mon 10:00 AM - 1:00 PM',
          day: 'Mon',
          startTime: '10:00 AM',
          endTime: '1:00 PM',
        ),
      ],
    );
  }
}

class _FakeAppointmentsRepository implements AppointmentsRepository {
  const _FakeAppointmentsRepository();

  @override
  Future<Appointment> cancelAppointment(String appointmentId) async {
    return Appointment(
      id: appointmentId,
      patientId: 'u1',
      doctorId: 'd1',
      status: AppointmentStatus.cancelled,
      doctorSnapshot: const UserLite(
        fullName: 'Dr. Test',
        email: 'doctor@example.com',
      ),
    );
  }

  @override
  Future<Appointment> createAppointment(
    CreateAppointmentRequest request,
  ) async {
    return Appointment(
      id: 'a-new',
      patientId: 'u1',
      doctorId: request.doctorId,
      status: AppointmentStatus.requested,
      reason: request.reason,
      doctorSnapshot: const UserLite(
        fullName: 'Dr. Test',
        email: 'doctor@example.com',
      ),
    );
  }

  @override
  Future<Appointment?> getAppointmentById(String appointmentId) async {
    final list = await listMyAppointments();
    for (final item in list) {
      if (item.id == appointmentId) return item;
    }
    return null;
  }

  @override
  Future<List<Appointment>> listMyAppointments() async {
    return const <Appointment>[
      Appointment(
        id: 'a1',
        patientId: 'u1',
        doctorId: 'd1',
        status: AppointmentStatus.confirmed,
        reason: 'Follow up',
        doctorSnapshot: UserLite(
          fullName: 'Dr. Test',
          email: 'doctor@example.com',
        ),
      ),
    ];
  }
}

class _FakeLabsRepository implements LabsRepository {
  const _FakeLabsRepository();

  @override
  Future<List<LabOrder>> listMyLabOrders() async {
    return const <LabOrder>[
      LabOrder(
        id: 'l1',
        appointmentId: 'a1',
        diagnosticId: 'diag-1',
        status: LabOrderStatus.assigned,
        reports: <LabReport>[
          LabReport(
            id: 'r1',
            labOrderId: 'l1',
            fileUrl: 'https://example.com/report.pdf',
          ),
        ],
        diagnosticSnapshot: DiagnosticSnapshot(name: 'City Lab'),
      ),
    ];
  }
}

class _FakePrescriptionsRepository implements PrescriptionsRepository {
  const _FakePrescriptionsRepository();

  @override
  Future<Prescription?> getPrescriptionById(String prescriptionId) async {
    return const Prescription(
      id: 'p1',
      appointmentId: 'a1',
      doctorId: 'd1',
      pharmacyId: 'ph1',
      notes: 'Take after meal',
      status: PrescriptionStatus.signed,
      documentUrl: 'https://example.com/prescription.pdf',
      documentMimeType: 'application/pdf',
      medications: <PrescriptionMedication>[
        PrescriptionMedication(
          name: 'Atorvastatin',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
        ),
      ],
      pharmacySnapshot: PharmacySnapshot(
        name: 'Prime Pharmacy',
        phone: '+15551234567',
      ),
    );
  }

  @override
  Future<List<Prescription>> listMyPrescriptions() async {
    return const <Prescription>[
      Prescription(
        id: 'p1',
        appointmentId: 'a1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        notes: 'Take after meal',
        status: PrescriptionStatus.signed,
        documentUrl: 'https://example.com/prescription.pdf',
        documentMimeType: 'application/pdf',
        medications: <PrescriptionMedication>[
          PrescriptionMedication(
            name: 'Atorvastatin',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
          ),
        ],
        pharmacySnapshot: PharmacySnapshot(
          name: 'Prime Pharmacy',
          phone: '+15551234567',
        ),
      ),
    ];
  }
}

class _FakeNotificationsRepository implements NotificationsRepository {
  const _FakeNotificationsRepository();

  @override
  Future<List<AppNotification>> listMyNotifications() async {
    return <AppNotification>[
      AppNotification(
        id: 'n1',
        userId: 'u1',
        type: NotificationType.appointmentCalled,
        message: 'Your appointment is called',
        read: false,
        createdAt: DateTime.now(),
      ),
    ];
  }

  @override
  Future<void> markAllRead() async {}

  @override
  Future<void> markRead(String notificationId) async {}
}

class _FakePatientProfileRepository implements PatientProfileRepository {
  const _FakePatientProfileRepository();

  @override
  Future<PatientProfile> getMyProfile() async {
    return const PatientProfile(
      id: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient One',
      phone: '+15550001111',
      address: 'Demo Address',
      allergies: 'None',
      chronicConditions: 'None',
      currentMedications: 'None',
      emergencyContactName: 'Contact',
      emergencyContactPhone: '+15550002222',
      emergencyContactRelation: 'Sibling',
    );
  }

  @override
  Future<PatientProfile> updateMyProfile(
    UpdatePatientProfileRequest request,
  ) async {
    return PatientProfile(
      id: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: request.fullName ?? 'Patient One',
      phone: request.phone ?? '+15550001111',
      address: request.address ?? 'Demo Address',
      allergies: request.allergies ?? 'None',
      chronicConditions: request.chronicConditions ?? 'None',
      currentMedications: request.currentMedications ?? 'None',
      emergencyContactName: request.emergencyContactName ?? 'Contact',
      emergencyContactPhone: request.emergencyContactPhone ?? '+15550002222',
      emergencyContactRelation: request.emergencyContactRelation ?? 'Sibling',
    );
  }

  @override
  Future<PatientProfile> uploadMyAvatar(AvatarUploadRequest request) async {
    return const PatientProfile(
      id: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient One',
      avatarUrl: 'https://example.com/avatar.png',
      phone: '+15550001111',
      address: 'Demo Address',
      allergies: 'None',
      chronicConditions: 'None',
      currentMedications: 'None',
      emergencyContactName: 'Contact',
      emergencyContactPhone: '+15550002222',
      emergencyContactRelation: 'Sibling',
    );
  }

  @override
  Future<PatientProfile> removeMyAvatar() async {
    return const PatientProfile(
      id: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient One',
      phone: '+15550001111',
      address: 'Demo Address',
      allergies: 'None',
      chronicConditions: 'None',
      currentMedications: 'None',
      emergencyContactName: 'Contact',
      emergencyContactPhone: '+15550002222',
      emergencyContactRelation: 'Sibling',
    );
  }
}

class _FakeNotificationsRealtimeService
    implements NotificationsRealtimeService {
  const _FakeNotificationsRealtimeService();

  @override
  Stream<NotificationsRealtimeConnectionState> get connectionStateStream =>
      const Stream<NotificationsRealtimeConnectionState>.empty();

  @override
  Stream<NotificationsRealtimeEvent> get eventStream =>
      const Stream<NotificationsRealtimeEvent>.empty();

  @override
  void dispose() {}

  @override
  void start({required String wsBaseUrl, required String token}) {}

  @override
  void stop() {}
}

class _FakeNotificationPermissionRequester
    implements NotificationPermissionRequester {
  const _FakeNotificationPermissionRequester();

  @override
  Future<bool> requestNotificationPermission() async => false;
}

class _FakeStoragePermissionRequester implements StoragePermissionRequester {
  const _FakeStoragePermissionRequester();

  @override
  Future<bool> ensureStoragePermission() async => true;
}
