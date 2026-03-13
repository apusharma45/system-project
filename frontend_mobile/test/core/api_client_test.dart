import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:frontend_mobile/core/api/api_client.dart';

void main() {
  test('api client attaches bearer token and decodes response', () async {
    String? authHeader;
    final client = MockClient((request) async {
      authHeader = request.headers['Authorization'];
      return http.Response(jsonEncode(<String, dynamic>{'ok': true}), 200);
    });

    final api = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => 'token-123',
      httpClient: client,
    );
    final result = await api.getJson('/health/db');

    expect(authHeader, 'Bearer token-123');
    expect(result['ok'], true);
  });
}
