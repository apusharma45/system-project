import 'dart:io';

import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

const storagePermissionPromptedKey = 'storage_permission_prompted';

abstract class StoragePermissionRequester {
  Future<bool> ensureStoragePermission();
}

class PermissionHandlerStoragePermissionRequester
    implements StoragePermissionRequester {
  const PermissionHandlerStoragePermissionRequester();

  @override
  Future<bool> ensureStoragePermission() async {
    if (!Platform.isAndroid) return true;

    final manageStatus = await Permission.manageExternalStorage.status;
    if (manageStatus.isGranted || manageStatus.isLimited) {
      return true;
    }

    final storageStatus = await Permission.storage.status;
    if (storageStatus.isGranted || storageStatus.isLimited) {
      return true;
    }

    final storageResult = await Permission.storage.request();
    if (storageResult.isGranted || storageResult.isLimited) {
      return true;
    }

    final manageResult = await Permission.manageExternalStorage.request();
    return manageResult.isGranted || manageResult.isLimited;
  }
}

class StoragePermissionCoordinator {
  StoragePermissionCoordinator({
    required SharedPreferences preferences,
    required StoragePermissionRequester requester,
  }) : _preferences = preferences,
       _requester = requester;

  final SharedPreferences _preferences;
  final StoragePermissionRequester _requester;

  Future<void> promptOnFirstLaunchIfNeeded() async {
    final alreadyPrompted = _preferences.getBool(storagePermissionPromptedKey);
    if (alreadyPrompted == true) return;

    await _requester.ensureStoragePermission();
    await _preferences.setBool(storagePermissionPromptedKey, true);
  }

  Future<bool> ensurePermissionForDownload() {
    return _requester.ensureStoragePermission();
  }
}
