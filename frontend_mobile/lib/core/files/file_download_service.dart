import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

class FileDownloadService {
  const FileDownloadService();

  Future<String> downloadFile({
    required String url,
    required String fallbackFileName,
  }) async {
    final uri = Uri.tryParse(url);
    if (uri == null) {
      throw const FileDownloadException('Invalid download URL.');
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
    final root = await getApplicationDocumentsDirectory();
    final downloadDir = Directory('${root.path}${Platform.pathSeparator}downloads');
    if (!downloadDir.existsSync()) {
      downloadDir.createSync(recursive: true);
    }

    final file = File('${downloadDir.path}${Platform.pathSeparator}$fileName');
    await file.writeAsBytes(bytes, flush: true);
    return file.path;
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
