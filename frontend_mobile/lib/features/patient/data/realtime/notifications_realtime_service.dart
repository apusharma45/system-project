import 'dart:async';

import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../../core/domain/models.dart';
import '../mappers/enum_parsers.dart';
import '../mappers/patient_json_mapper.dart';

enum NotificationsRealtimeConnectionState {
  connected,
  reconnecting,
  disconnected,
}

class NotificationsRealtimeEvent {
  const NotificationsRealtimeEvent({
    required this.eventName,
    this.notification,
    this.requiresRefresh = false,
  });

  final String eventName;
  final AppNotification? notification;
  final bool requiresRefresh;
}

abstract class NotificationsRealtimeService {
  Stream<NotificationsRealtimeConnectionState> get connectionStateStream;
  Stream<NotificationsRealtimeEvent> get eventStream;

  void start({required String wsBaseUrl, required String token});

  void stop();
  void dispose();
}

class SocketIoNotificationsRealtimeService
    implements NotificationsRealtimeService {
  SocketIoNotificationsRealtimeService();

  static const List<String> _eventNames = <String>[
    'appointment.called',
    'lab.assigned',
    'lab.result_uploaded',
    'prescription.ready',
  ];

  final StreamController<NotificationsRealtimeConnectionState>
  _connectionController =
      StreamController<NotificationsRealtimeConnectionState>.broadcast();
  final StreamController<NotificationsRealtimeEvent> _eventController =
      StreamController<NotificationsRealtimeEvent>.broadcast();

  io.Socket? _socket;
  String? _activeUrl;
  String? _activeToken;

  @override
  Stream<NotificationsRealtimeConnectionState> get connectionStateStream =>
      _connectionController.stream;

  @override
  Stream<NotificationsRealtimeEvent> get eventStream => _eventController.stream;

  @override
  void start({required String wsBaseUrl, required String token}) {
    if (_activeUrl == wsBaseUrl &&
        _activeToken == token &&
        _socket?.connected == true) {
      return;
    }

    stop();
    _activeUrl = wsBaseUrl;
    _activeToken = token;

    final socket = io.io(
      '$wsBaseUrl/notifications',
      io.OptionBuilder()
          .setTransports(<String>['websocket'])
          .enableReconnection()
          .setReconnectionAttempts(5)
          .setReconnectionDelay(2000)
          .setAuth(<String, dynamic>{'token': token})
          .build(),
    );

    socket.onConnect((_) {
      _connectionController.add(NotificationsRealtimeConnectionState.connected);
    });
    socket.onReconnect((_) {
      _connectionController.add(NotificationsRealtimeConnectionState.connected);
    });
    socket.onReconnectAttempt((_) {
      _connectionController.add(
        NotificationsRealtimeConnectionState.reconnecting,
      );
    });
    socket.onConnectError((_) {
      _connectionController.add(
        NotificationsRealtimeConnectionState.disconnected,
      );
    });
    socket.onDisconnect((_) {
      _connectionController.add(
        NotificationsRealtimeConnectionState.disconnected,
      );
    });

    for (final eventName in _eventNames) {
      socket.on(eventName, (payload) {
        _eventController.add(parseRealtimePayload(eventName, payload));
      });
    }

    _socket = socket;
    _socket?.connect();
  }

  @override
  void stop() {
    _activeUrl = null;
    _activeToken = null;
    _socket?.dispose();
    _socket?.disconnect();
    _socket = null;
    _connectionController.add(
      NotificationsRealtimeConnectionState.disconnected,
    );
  }

  @override
  void dispose() {
    stop();
    _connectionController.close();
    _eventController.close();
  }
}

NotificationsRealtimeEvent parseRealtimePayload(
  String eventName,
  dynamic payload,
) {
  Map<String, dynamic>? candidate;

  if (payload is Map<String, dynamic>) {
    final nested = payload['notification'];
    if (nested is Map<String, dynamic>) {
      candidate = nested;
    } else {
      candidate = payload;
    }
  } else if (payload is Map) {
    final castPayload = payload.cast<String, dynamic>();
    final nested = castPayload['notification'];
    if (nested is Map) {
      candidate = nested.cast<String, dynamic>();
    } else {
      candidate = castPayload;
    }
  }

  if (candidate == null) {
    return NotificationsRealtimeEvent(
      eventName: eventName,
      requiresRefresh: true,
    );
  }

  final rawType = candidate['type'];
  if (rawType is! String || parseNotificationType(rawType) == null) {
    return NotificationsRealtimeEvent(
      eventName: eventName,
      requiresRefresh: true,
    );
  }

  try {
    final notification = mapNotification(candidate);
    return NotificationsRealtimeEvent(
      eventName: eventName,
      notification: notification,
    );
  } catch (_) {
    return NotificationsRealtimeEvent(
      eventName: eventName,
      requiresRefresh: true,
    );
  }
}
