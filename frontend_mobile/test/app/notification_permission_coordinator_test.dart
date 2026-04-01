import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/permissions/notification_permission_coordinator.dart';

void main() {
  test('prompts once and persists prompt flag', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    final requester = _SpyRequester();
    final coordinator = NotificationPermissionCoordinator(
      preferences: prefs,
      requester: requester,
    );

    await coordinator.promptOnFirstLaunchIfNeeded();
    await coordinator.promptOnFirstLaunchIfNeeded();

    expect(requester.calls, 1);
    expect(prefs.getBool(notificationsPermissionPromptedKey), isTrue);
  });
}

class _SpyRequester implements NotificationPermissionRequester {
  int calls = 0;

  @override
  Future<bool> requestNotificationPermission() async {
    calls += 1;
    return false;
  }
}
