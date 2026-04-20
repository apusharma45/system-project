import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/data/realtime/notifications_realtime_service.dart';

void main() {
  test('realtime payload parser maps nested notification payload', () {
    final event = parseRealtimePayload('appointment.called', <String, dynamic>{
      'notification': <String, dynamic>{
        'id': 'n1',
        'userId': 'u1',
        'type': 'APPOINTMENT_CALLED',
        'message': 'Called now',
        'read': false,
        'createdAt': '2026-03-13T10:00:00.000Z',
      },
    });

    expect(event.requiresRefresh, false);
    expect(event.notification?.id, 'n1');
  });

  test('realtime payload parser maps direct notification object', () {
    final event = parseRealtimePayload('lab.assigned', <String, dynamic>{
      'id': 'n2',
      'userId': 'u1',
      'type': 'LAB_ASSIGNED',
      'message': 'Lab assigned',
      'read': false,
      'createdAt': '2026-03-13T10:00:00.000Z',
    });

    expect(event.requiresRefresh, false);
    expect(event.notification?.id, 'n2');
  });

  test('realtime payload parser requests refresh for invalid payload', () {
    final event = parseRealtimePayload(
      'lab.result_uploaded',
      'invalid-payload',
    );
    expect(event.notification, isNull);
    expect(event.requiresRefresh, true);
  });

  test(
    'realtime payload parser requests refresh for unknown notification type',
    () {
      final event = parseRealtimePayload(
        'prescription.ready',
        <String, dynamic>{
          'notification': <String, dynamic>{
            'id': 'n4',
            'userId': 'u1',
            'type': 'UNKNOWN_TYPE',
            'message': 'Unknown',
            'read': false,
            'createdAt': '2026-03-13T10:00:00.000Z',
          },
        },
      );

      expect(event.notification, isNull);
      expect(event.requiresRefresh, true);
    },
  );
}
