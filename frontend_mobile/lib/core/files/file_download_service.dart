import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

import '../../app/permissions/storage_permission_coordinator.dart';

class FileDownloadService {
  const FileDownloadService({
    this.storagePermissionRequester =
        const PermissionHandlerStoragePermissionRequester(),
  });

  final StoragePermissionRequester storagePermissionRequester;

  Future<String> downloadFile({
    required String url,
    required String fallbackFileName,
  }) async {
    final uri = Uri.tryParse(url);
    if (uri == null) {
      throw const FileDownloadException('Invalid download URL.');
    }

    final hasPermission = await storagePermissionRequester
        .ensureStoragePermission();
    if (!hasPermission) {
      throw const FileDownloadException(
        'Storage permission is required to download files.',
      );
    }

    final request = http.Request('GET', uri);
    final response = await http.Client().send(request);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw FileDownloadException(
        'Download failed with status ${response.statusCode}.',
      );
    }

    final bytes = await response.stream.toBytes();
    final fileName = _resolveFileName(uri, fallbackFileName);
    final downloadDir = await _resolveDownloadDirectory();
    if (!downloadDir.existsSync()) {
      await downloadDir.create(recursive: true);
    }

    final file = File('${downloadDir.path}${Platform.pathSeparator}$fileName');
    await file.writeAsBytes(bytes, flush: true);
    return file.path;
  }

  Future<Directory> _resolveDownloadDirectory() async {
    if (Platform.isAndroid) {
      final externalDir = await getExternalStorageDirectory();
      if (externalDir == null) {
        throw const FileDownloadException(
          'Unable to access Android download storage.',
        );
      }

      final normalized = externalDir.path.replaceAll('\\', '/');
      final androidDataMarker = '/Android/data/';
      final markerIndex = normalized.indexOf(androidDataMarker);
      final sharedRoot = markerIndex >= 0
          ? normalized.substring(0, markerIndex)
          : normalized;

      return Directory(
        '$sharedRoot${Platform.pathSeparator}Download${Platform.pathSeparator}MedFlow',
      );
    }

    final root = await getApplicationDocumentsDirectory();
    return Directory('${root.path}${Platform.pathSeparator}downloads');
  }

  String _resolveFileName(Uri uri, String fallback) {
    final last = uri.pathSegments.isNotEmpty ? uri.pathSegments.last : '';
    if (last.trim().isNotEmpty && last.contains('.')) {
      return last;
    }
    return fallback;
  }
}

class FileDownloadException implements Exception {
  const FileDownloadException(this.message);

  final String message;

  @override
  String toString() => message;
}
