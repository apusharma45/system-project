import 'dart:async';

import 'package:flutter/widgets.dart';

import '../../../../app/state/session_controller.dart';
import '../../../../core/domain/models.dart';
import '../../data/realtime/notifications_realtime_service.dart';
import '../../data/repositories/patient_repositories.dart';

class NotificationsCenterController extends ChangeNotifier
    with WidgetsBindingObserver {
  NotificationsCenterController({
    required this.session,
    required this.notificationsRepository,
    required this.realtimeService,
    required this.wsBaseUrl,
    this.pollInterval = const Duration(seconds: 20),
  }) {
    WidgetsBinding.instance.addObserver(this);
    session.addListener(_onSessionChanged);
    _onSessionChanged();
  }

  final SessionController session;
  final NotificationsRepository notificationsRepository;
  final NotificationsRealtimeService realtimeService;
  final String wsBaseUrl;
  final Duration pollInterval;

  final StreamController<AppNotification> _incomingController =
      StreamController<AppNotification>.broadcast();
  StreamSubscription<NotificationsRealtimeConnectionState>? _connectionSub;
  StreamSubscription<NotificationsRealtimeEvent>? _eventSub;
  Timer? _pollTimer;

  bool _disposed = false;
  bool _isForeground = true;
  bool _isPollingFallback = false;
  bool _started = false;
  bool _isLoading = false;
  String? _errorMessage;
  List<AppNotification> _notifications = const <AppNotification>[];
  NotificationsRealtimeConnectionState _connectionState =
      NotificationsRealtimeConnectionState.disconnected;

  List<AppNotification> get notifications => _notifications;
  int get unreadCount => _notifications.where((item) => !item.read).length;
  bool get isLoading => _isLoading;
  bool get isPollingFallback => _isPollingFallback;
  String? get errorMessage => _errorMessage;
  NotificationsRealtimeConnectionState get connectionState => _connectionState;
  Stream<AppNotification> get incomingStream => _incomingController.stream;

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _isForeground = state == AppLifecycleState.resumed;
    if (_isForeground) {
      if (_isPollingFallback) {
        _startPolling();
      }
    } else {
      _pollTimer?.cancel();
    }
  }

  Future<void> refresh() async {
    await _fetch();
  }

  Future<void> markRead(String notificationId) async {
    await notificationsRepository.markRead(notificationId);
    _notifications = _notifications
        .map(
          (item) => item.id == notificationId
              ? AppNotification(
                  id: item.id,
                  userId: item.userId,
                  type: item.type,
                  message: item.message,
                  read: true,
                  createdAt: item.createdAt,
                )
              : item,
        )
        .toList(growable: false);
    notifyListeners();
  }

  Future<void> markAllRead() async {
    await notificationsRepository.markAllRead();
    _notifications = _notifications
        .map(
          (item) => AppNotification(
            id: item.id,
            userId: item.userId,
            type: item.type,
            message: item.message,
            read: true,
            createdAt: item.createdAt,
          ),
        )
        .toList(growable: false);
    notifyListeners();
  }

  void _onSessionChanged() {
    if (_disposed) return;
    if (session.status == AuthStatus.authenticated &&
        (session.token?.isNotEmpty ?? false)) {
      _start();
      return;
    }
    _stopAndClear();
  }

  void _start() {
    if (_started) return;
    _started = true;

    _connectionSub?.cancel();
    _eventSub?.cancel();
    _connectionSub = realtimeService.connectionStateStream.listen(
      _onConnectionState,
    );
    _eventSub = realtimeService.eventStream.listen(_onRealtimeEvent);

    realtimeService.start(wsBaseUrl: wsBaseUrl, token: session.token!);
    unawaited(_fetch());
  }

  void _stopAndClear() {
    _started = false;
    _pollTimer?.cancel();
    _isPollingFallback = false;
    _connectionSub?.cancel();
    _eventSub?.cancel();
    _connectionSub = null;
    _eventSub = null;
    realtimeService.stop();
    _connectionState = NotificationsRealtimeConnectionState.disconnected;
    _notifications = const <AppNotification>[];
    _errorMessage = null;
    _isLoading = false;
    notifyListeners();
  }

  void _onConnectionState(NotificationsRealtimeConnectionState state) {
    _connectionState = state;
    if (state == NotificationsRealtimeConnectionState.connected) {
      _pollTimer?.cancel();
      _isPollingFallback = false;
    } else {
      _isPollingFallback = true;
      _startPolling();
    }
    notifyListeners();
  }

  void _onRealtimeEvent(NotificationsRealtimeEvent event) {
    if (event.notification != null) {
      _applyIncomingNotification(event.notification!);
    }
    if (event.requiresRefresh) {
      unawaited(_fetch());
    }
  }

  void _applyIncomingNotification(AppNotification incoming) {
    final existingIndex = _notifications.indexWhere(
      (item) => item.id == incoming.id,
    );
    if (existingIndex >= 0) {
      final mutable = _notifications.toList(growable: true);
      mutable[existingIndex] = incoming;
      _notifications = mutable;
    } else {
      _notifications = <AppNotification>[incoming, ..._notifications];
      _incomingController.add(incoming);
    }
    notifyListeners();
  }

  void _startPolling() {
    _pollTimer?.cancel();
    if (!_isForeground) return;
    _pollTimer = Timer.periodic(pollInterval, (_) {
      if (!_started) return;
      unawaited(_fetch());
    });
  }

  Future<void> _fetch() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final items = await notificationsRepository.listMyNotifications();
      _notifications = items;
    } catch (error) {
      _errorMessage = '$error';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    WidgetsBinding.instance.removeObserver(this);
    session.removeListener(_onSessionChanged);
    _stopAndClear();
    _incomingController.close();
    super.dispose();
  }
}
