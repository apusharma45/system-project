import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/realtime/notifications_realtime_service.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';
import 'package:frontend_mobile/features/patient/presentation/controllers/notifications_center_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'controller starts/stops realtime from authenticated session state',
    () async {
      SharedPreferences.setMockInitialValues(<String, Object>{
        'session_token': 'token',
      });
      final prefs = await SharedPreferences.getInstance();
      final api = ApiClient(
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
      final fakeRepo = _FakeNotificationsRepository();
      final fakeRealtime = _FakeRealtimeService();
      final session = SessionController(apiClient: api, preferences: prefs);

      final controller = NotificationsCenterController(
        session: session,
        notificationsRepository: fakeRepo,
        realtimeService: fakeRealtime,
        wsBaseUrl: 'ws://localhost:3000',
        pollInterval: const Duration(milliseconds: 30),
      );

      await session.bootstrap();
      await Future<void>.delayed(const Duration(milliseconds: 10));
      expect(fakeRealtime.startCount, 1);

      await session.logout();
      await Future<void>.delayed(const Duration(milliseconds: 10));
      expect(fakeRealtime.stopCount, greaterThanOrEqualTo(1));

      controller.dispose();
    },
  );

  test('controller uses polling fallback when realtime disconnected', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{
      'session_token': 'token',
    });
    final prefs = await SharedPreferences.getInstance();
    final api = ApiClient(
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
    final session = SessionController(apiClient: api, preferences: prefs);
    final fakeRepo = _FakeNotificationsRepository();
    final fakeRealtime = _FakeRealtimeService();

    final controller = NotificationsCenterController(
      session: session,
      notificationsRepository: fakeRepo,
      realtimeService: fakeRealtime,
      wsBaseUrl: 'ws://localhost:3000',
      pollInterval: const Duration(milliseconds: 20),
    );

    await session.bootstrap();
    await Future<void>.delayed(const Duration(milliseconds: 10));
    fakeRealtime.emitConnection(
      NotificationsRealtimeConnectionState.disconnected,
    );
    await Future<void>.delayed(const Duration(milliseconds: 75));
    expect(controller.isPollingFallback, true);
    expect(fakeRepo.listCalls, greaterThan(1));

    fakeRealtime.emitConnection(NotificationsRealtimeConnectionState.connected);
    final before = fakeRepo.listCalls;
    await Future<void>.delayed(const Duration(milliseconds: 50));
    expect(controller.isPollingFallback, false);
    expect(fakeRepo.listCalls, before);

    controller.dispose();
  });

  test(
    'controller updates unread counts for mark read/all and incoming events',
    () async {
      SharedPreferences.setMockInitialValues(<String, Object>{
        'session_token': 'token',
      });
      final prefs = await SharedPreferences.getInstance();
      final api = ApiClient(
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
      final session = SessionController(apiClient: api, preferences: prefs);
      final fakeRepo = _FakeNotificationsRepository();
      final fakeRealtime = _FakeRealtimeService();
      final controller = NotificationsCenterController(
        session: session,
        notificationsRepository: fakeRepo,
        realtimeService: fakeRealtime,
        wsBaseUrl: 'ws://localhost:3000',
        pollInterval: const Duration(milliseconds: 20),
      );

      await session.bootstrap();
      await Future<void>.delayed(const Duration(milliseconds: 10));
      await controller.refresh();
      expect(controller.unreadCount, 1);

      await controller.markAllRead();
      expect(controller.unreadCount, 0);

      fakeRealtime.emitEvent(
        NotificationsRealtimeEvent(
          eventName: 'appointment.called',
          notification: AppNotification(
            id: 'n2',
            userId: 'u1',
            type: NotificationType.appointmentCalled,
            message: 'New',
            read: false,
            createdAt: DateTime.now(),
          ),
        ),
      );
      await Future<void>.delayed(const Duration(milliseconds: 20));
      expect(controller.unreadCount, 1);

      controller.dispose();
    },
  );
}

class _FakeNotificationsRepository implements NotificationsRepository {
  int listCalls = 0;
  final List<AppNotification> _items = <AppNotification>[
    AppNotification(
      id: 'n1',
      userId: 'u1',
      type: NotificationType.labAssigned,
      message: 'Assigned',
      read: false,
      createdAt: DateTime.now(),
    ),
  ];

  @override
  Future<List<AppNotification>> listMyNotifications() async {
    listCalls += 1;
    return List<AppNotification>.from(_items);
  }

  @override
  Future<void> markAllRead() async {
    for (var i = 0; i < _items.length; i += 1) {
      final old = _items[i];
      _items[i] = AppNotification(
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
    final i = _items.indexWhere((x) => x.id == notificationId);
    if (i < 0) return;
    final old = _items[i];
    _items[i] = AppNotification(
      id: old.id,
      userId: old.userId,
      type: old.type,
      message: old.message,
      read: true,
      createdAt: old.createdAt,
    );
  }
}

class _FakeRealtimeService implements NotificationsRealtimeService {
  int startCount = 0;
  int stopCount = 0;
  final StreamController<NotificationsRealtimeConnectionState> _connection =
      StreamController<NotificationsRealtimeConnectionState>.broadcast();
  final StreamController<NotificationsRealtimeEvent> _events =
      StreamController<NotificationsRealtimeEvent>.broadcast();

  @override
  Stream<NotificationsRealtimeConnectionState> get connectionStateStream =>
      _connection.stream;

  @override
  Stream<NotificationsRealtimeEvent> get eventStream => _events.stream;

  void emitConnection(NotificationsRealtimeConnectionState state) {
    _connection.add(state);
  }

  void emitEvent(NotificationsRealtimeEvent event) {
    _events.add(event);
  }

  @override
  void start({required String wsBaseUrl, required String token}) {
    startCount += 1;
  }

  @override
  void stop() {
    stopCount += 1;
  }

  @override
  void dispose() {
    _connection.close();
    _events.close();
  }
}
