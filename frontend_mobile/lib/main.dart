import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app/app.dart';
import 'app/app_dependencies.dart';
import 'app/state/session_controller.dart';
import 'core/api/api_client.dart';
import 'core/config/app_config.dart';
import 'features/patient/data/realtime/notifications_realtime_service.dart';
import 'features/patient/data/repositories/api_patient_repositories.dart';
import 'features/patient/presentation/controllers/notifications_center_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final config = AppConfig.fromEnvironment();
  final preferences = await SharedPreferences.getInstance();

  late final SessionController session;
  final apiClient = ApiClient(
    baseUrl: config.apiBaseUrl,
    tokenProvider: () => session.token,
  );

  session = SessionController(apiClient: apiClient, preferences: preferences);
  final notificationsRealtimeService = SocketIoNotificationsRealtimeService();
  final notificationsRepository = ApiNotificationsRepository(
    apiClient: apiClient,
  );
  final notificationsCenterController = NotificationsCenterController(
    session: session,
    notificationsRepository: notificationsRepository,
    realtimeService: notificationsRealtimeService,
    wsBaseUrl: config.wsBaseUrl,
  );
  final dependencies = AppDependencies(
    config: config,
    apiClient: apiClient,
    session: session,
    authRepository: ApiAuthRepository(apiClient: apiClient),
    doctorsRepository: ApiDoctorsRepository(apiClient: apiClient),
    appointmentsRepository: ApiAppointmentsRepository(apiClient: apiClient),
    labsRepository: ApiLabsRepository(apiClient: apiClient),
    prescriptionsRepository: ApiPrescriptionsRepository(apiClient: apiClient),
    notificationsRepository: notificationsRepository,
    patientProfileRepository: ApiPatientProfileRepository(apiClient: apiClient),
    notificationsRealtimeService: notificationsRealtimeService,
    notificationsCenterController: notificationsCenterController,
  );

  await session.bootstrap();
  runApp(PatientApp(dependencies: dependencies));
}
