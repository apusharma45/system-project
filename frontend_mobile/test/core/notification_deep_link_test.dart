import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/features/patient/domain/notification_deep_link.dart';

void main() {
  test('notification deep links map to expected routes', () {
    expect(
      notificationDeepLink(NotificationType.prescriptionReady),
      '/records?tab=prescriptions',
    );
    expect(
      notificationDeepLink(NotificationType.labResultUploaded),
      '/records?tab=reports',
    );
    expect(
      notificationDeepLink(NotificationType.labAssigned),
      '/records?tab=labs',
    );
    expect(
      notificationDeepLink(NotificationType.appointmentCalled),
      '/appointments',
    );
  });
}
