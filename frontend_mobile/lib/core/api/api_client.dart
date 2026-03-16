import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import 'api_exception.dart';

typedef TokenProvider = String? Function();

class ApiClient {
  ApiClient({
    required this.baseUrl,
    required TokenProvider tokenProvider,
    http.Client? httpClient,
  }) : _tokenProvider = tokenProvider,
       _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final TokenProvider _tokenProvider;
  final http.Client _httpClient;

  Future<Map<String, dynamic>> getJson(String path) async {
    final response = await _request('GET', path);
    return _decodeObject(response);
  }

  Future<List<dynamic>> getList(String path) async {
    final response = await _request('GET', path);
    final decoded = jsonDecode(response.body);
    if (decoded is List<dynamic>) return decoded;
    throw const ApiException('Expected list response from server');
  }

  Future<Map<String, dynamic>> postJson(
    String path,
    Map<String, dynamic> payload,
  ) async {
    final response = await _request('POST', path, body: payload);
    return _decodeObject(response);
  }

  Future<Map<String, dynamic>> patchJson(
    String path, [
    Map<String, dynamic>? payload,
  ]) async {
    final response = await _request('PATCH', path, body: payload);
    return _decodeObject(response);
  }

  Future<Map<String, dynamic>> deleteJson(String path) async {
    final response = await _request('DELETE', path);
    return _decodeObject(response);
  }

  Future<Map<String, dynamic>> patchMultipartFile({
    required String path,
    required String fieldName,
    required Uint8List bytes,
    required String fileName,
    required String contentType,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final request = http.MultipartRequest('PATCH', uri);
    final token = _tokenProvider();
    if (token != null && token.isNotEmpty) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    final parts = contentType.split('/');
    final mediaType = parts.length == 2
        ? MediaType(parts.first, parts.last)
        : null;
    request.files.add(
      http.MultipartFile.fromBytes(
        fieldName,
        bytes,
        filename: fileName,
        contentType: mediaType,
      ),
    );

    http.StreamedResponse streamed;
    try {
      streamed = await _httpClient.send(request);
    } catch (error) {
      throw const ApiException(
        'Network error. Please check your connection and try again.',
      );
    }
    final response = await http.Response.fromStream(streamed);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return _decodeObject(response);
    }
    throw ApiException(
      _extractMessage(response.body),
      statusCode: response.statusCode,
    );
  }

  Future<http.Response> _request(
    String method,
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final token = _tokenProvider();
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    late final http.Response response;
    try {
      switch (method) {
        case 'GET':
          response = await _httpClient.get(uri, headers: headers);
          break;
        case 'POST':
          response = await _httpClient.post(
            uri,
            headers: headers,
            body: jsonEncode(body ?? <String, dynamic>{}),
          );
          break;
        case 'PATCH':
          response = await _httpClient.patch(
            uri,
            headers: headers,
            body: jsonEncode(body ?? <String, dynamic>{}),
          );
          break;
        case 'DELETE':
          response = await _httpClient.delete(uri, headers: headers);
          break;
        default:
          throw ApiException('Unsupported method: $method');
      }
    } catch (error) {
      throw const ApiException(
        'Network error. Please check your connection and try again.',
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response;
    }

    throw ApiException(
      _extractMessage(response.body),
      statusCode: response.statusCode,
    );
  }

  Map<String, dynamic> _decodeObject(http.Response response) {
    if (response.body.trim().isEmpty) return <String, dynamic>{};
    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) return decoded;
    throw const ApiException('Expected object response from server');
  }

  String _extractMessage(String body) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        final message = decoded['message'];
        if (message is String && message.trim().isNotEmpty) return message;
        if (message is List) {
          final joined = message.whereType<String>().join(', ');
          if (joined.isNotEmpty) return joined;
        }
      }
    } catch (_) {
      // fall back to generic message
    }
    return 'Request failed';
  }
}
