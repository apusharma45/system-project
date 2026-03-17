import '../core/api/api_client.dart';
import '../core/config/app_config.dart';
import '../features/patient/data/repositories/patient_repositories.dart';
import '../features/patient/data/realtime/notifications_realtime_service.dart';
import '../features/patient/presentation/controllers/notifications_center_controller.dart';
import 'state/session_controller.dart';

class AppDependencies {
  const AppDependencies({
    required this.config,
    required this.apiClient,
    required this.session,
    required this.authRepository,
    required this.doctorsRepository,
    required this.appointmentsRepository,
    required this.labsRepository,
    required this.prescriptionsRepository,
    required this.notificationsRepository,
    required this.patientProfileRepository,
    required this.notificationsRealtimeService,
    required this.notificationsCenterController,
  });

  final AppConfig config;
  final ApiClient apiClient;
  final SessionController session;
  final AuthRepository authRepository;
  final DoctorsRepository doctorsRepository;
  final AppointmentsRepository appointmentsRepository;
  final LabsRepository labsRepository;
  final PrescriptionsRepository prescriptionsRepository;
  final NotificationsRepository notificationsRepository;
  final PatientProfileRepository patientProfileRepository;
  final NotificationsRealtimeService notificationsRealtimeService;
  final NotificationsCenterController notificationsCenterController;
}
