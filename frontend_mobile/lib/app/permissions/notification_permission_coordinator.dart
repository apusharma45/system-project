import 'dart:io';

import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

const notificationsPermissionPromptedKey = 'notifications_permission_prompted';

abstract class NotificationPermissionRequester {
  Future<bool> requestNotificationPermission();
}

class PermissionHandlerNotificationPermissionRequester
    implements NotificationPermissionRequester {
  const PermissionHandlerNotificationPermissionRequester();

  @override
  Future<bool> requestNotificationPermission() async {
    if (!Platform.isAndroid) return true;
    final status = await Permission.notification.status;
    if (status.isGranted ||
        status.isLimited ||
        status.isProvisional ||
        status.isRestricted) {
      return true;
    }
    final result = await Permission.notification.request();
    return result.isGranted || result.isLimited || result.isProvisional;
  }
}

class NotificationPermissionCoordinator {
  NotificationPermissionCoordinator({
    required SharedPreferences preferences,
    required NotificationPermissionRequester requester,
  }) : _preferences = preferences,
       _requester = requester;

  final SharedPreferences _preferences;
  final NotificationPermissionRequester _requester;

  Future<void> promptOnFirstLaunchIfNeeded() async {
    final alreadyPrompted = _preferences.getBool(
      notificationsPermissionPromptedKey,
    );
    if (alreadyPrompted == true) return;

    await _requester.requestNotificationPermission();
    await _preferences.setBool(notificationsPermissionPromptedKey, true);
  }
}
