import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/app_dependencies.dart';
import 'package:frontend_mobile/app/router/app_router.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/realtime/notifications_realtime_service.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('shell FAB shows unread badge and home unread updates', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.notificationsCenterController.refresh();

    final router = AppRouter.buildTestRouter(initialLocation: '/doctors');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('fab-notifications-badge')), findsOneWidget);

    router.go('/');
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('home-notification-icon')), findsOneWidget);
    expect(find.text('Welcome back,'), findsOneWidget);
  });

  testWidgets(
    'incoming realtime event shows snackbar and open action deep links',
    (WidgetTester tester) async {
      final setup = await _makeRealtimeEnabledDependencies();
      final deps = setup.dependencies;
      final realtime = setup.realtime;
      final router = AppRouter.buildTestRouter(initialLocation: '/doctors');

      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp.router(routerConfig: router),
        ),
      );
      await tester.pumpAndSettle();

      realtime.emitEvent(
        NotificationsRealtimeEvent(
          eventName: 'appointment.called',
          notification: AppNotification(
            id: 'live-1',
            userId: 'u1',
            type: NotificationType.appointmentCalled,
            message: 'Your appointment is called',
            read: false,
            createdAt: DateTime.now(),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Your appointment is called'), findsOneWidget);
      final openAction = find.descendant(
        of: find.byType(SnackBar),
        matching: find.text('Open'),
      );
      expect(openAction, findsOneWidget);
      final action = tester.widget<SnackBarAction>(find.byType(SnackBarAction));
      action.onPressed();
      await tester.pumpAndSettle();
      expect(find.text('My Appointments'), findsOneWidget);
    },
  );

  testWidgets('notifications page updates immediately on incoming event', (
    WidgetTester tester,
  ) async {
    final setup = await _makeRealtimeEnabledDependencies();
    final deps = setup.dependencies;
    final realtime = setup.realtime;
    final router = AppRouter.buildTestRouter(initialLocation: '/notifications');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    realtime.emitEvent(
      NotificationsRealtimeEvent(
        eventName: 'lab.result_uploaded',
        notification: AppNotification(
          id: 'live-2',
          userId: 'u1',
          type: NotificationType.labResultUploaded,
          message: 'Result uploaded',
          read: false,
          createdAt: DateTime.now(),
        ),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    expect(find.text('Result uploaded'), findsWidgets);
  });
}

Future<_RealtimeSetup> _makeRealtimeEnabledDependencies() async {
  SharedPreferences.setMockInitialValues(<String, Object>{
    'session_token': 'token',
  });
  final prefs = await SharedPreferences.getInstance();
  final apiClient = ApiClient(
    baseUrl: 'http://localhost:3000',
    tokenProvider: () => 'token',
    httpClient: MockClient((request) async {
      if (request.url.path.endsWith('/users/me')) {
        return http.Response(
          '{"id":"u1","email":"patient@example.com","role":"PATIENT"}',
          200,
        );
      }
      return http.Response('{}', 200);
    }),
  );
  final session = SessionController(apiClient: apiClient, preferences: prefs);
  await session.bootstrap();

  final realtime = _EmittableRealtimeService();
  final notificationsRepo = _RealtimeNotificationsRepository();
  final dependencies = makeTestDependenciesWithSession(
    session: session,
    apiClient: apiClient,
    notificationsRepository: notificationsRepo,
    notificationsRealtimeService: realtime,
  );
  await dependencies.notificationsCenterController.refresh();
  return _RealtimeSetup(dependencies: dependencies, realtime: realtime);
}

class _RealtimeSetup {
  const _RealtimeSetup({required this.dependencies, required this.realtime});

  final AppDependencies dependencies;
  final _EmittableRealtimeService realtime;
}

class _RealtimeNotificationsRepository implements NotificationsRepository {
  final List<AppNotification> _notifications = <AppNotification>[
    AppNotification(
      id: 'seed',
      userId: 'u1',
      type: NotificationType.labAssigned,
      message: 'Seed notification',
      read: false,
      createdAt: DateTime.now(),
    ),
  ];

  @override
  Future<List<AppNotification>> listMyNotifications() async {
    return List<AppNotification>.from(_notifications);
  }

  @override
  Future<void> markAllRead() async {
    for (var i = 0; i < _notifications.length; i += 1) {
      final old = _notifications[i];
      _notifications[i] = AppNotification(
        id: old.id,
        userId: old.userId,
        type: old.type,
        message: old.message,
        read: true,
        createdAt: old.createdAt,
      );
    }
  }

  @override
  Future<void> markRead(String notificationId) async {
    final idx = _notifications.indexWhere((n) => n.id == notificationId);
    if (idx < 0) return;
    final old = _notifications[idx];
    _notifications[idx] = AppNotification(
      id: old.id,
      userId: old.userId,
      type: old.type,
      message: old.message,
      read: true,
      createdAt: old.createdAt,
    );
  }
}

class _EmittableRealtimeService implements NotificationsRealtimeService {
  final StreamController<NotificationsRealtimeConnectionState>
  _connectionController =
      StreamController<NotificationsRealtimeConnectionState>.broadcast();
  final StreamController<NotificationsRealtimeEvent> _eventController =
      StreamController<NotificationsRealtimeEvent>.broadcast();

  @override
  Stream<NotificationsRealtimeConnectionState> get connectionStateStream =>
      _connectionController.stream;

  @override
  Stream<NotificationsRealtimeEvent> get eventStream => _eventController.stream;

  void emitEvent(NotificationsRealtimeEvent event) {
    _eventController.add(event);
  }

  @override
  void dispose() {
    _connectionController.close();
    _eventController.close();
  }

  @override
  void start({required String wsBaseUrl, required String token}) {
    _connectionController.add(NotificationsRealtimeConnectionState.connected);
  }

  @override
  void stop() {
    _connectionController.add(
      NotificationsRealtimeConnectionState.disconnected,
    );
  }
}
