import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/app_scope.dart';
import 'package:frontend_mobile/app/router/app_router.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('unauthenticated session redirects to login', (
    WidgetTester tester,
  ) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;
    final client = MockClient((request) async {
      return http.Response('{}', 200);
    });
    final api = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => session.token,
      httpClient: client,
    );
    session = SessionController(apiClient: api, preferences: prefs);
    await session.bootstrap();

    final deps = makeTestDependenciesWithSession(
      session: session,
      apiClient: api,
    );
    final router = AppRouter(session).router;

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Sign in'), findsWidgets);
  });

  testWidgets('authenticated patient lands on home', (
    WidgetTester tester,
  ) async {
    SharedPreferences.setMockInitialValues(<String, Object>{
      'session_token': 'abc',
    });
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;
    final client = MockClient((request) async {
      if (request.url.path.endsWith('/users/me')) {
        return http.Response(
          jsonEncode(<String, dynamic>{
            'userId': 'u1',
            'email': 'patient@example.com',
            'role': 'PATIENT',
            'fullName': 'Patient One',
          }),
          200,
        );
      }
      if (request.url.path.endsWith('/appointments/me')) {
        return http.Response('[]', 200);
      }
      if (request.url.path.endsWith('/notifications/me')) {
        return http.Response('[]', 200);
      }
      return http.Response('{}', 200);
    });
    final api = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => session.token,
      httpClient: client,
    );
    session = SessionController(apiClient: api, preferences: prefs);
    await session.bootstrap();

    final deps = makeTestDependenciesWithSession(
      session: session,
      apiClient: api,
    );
    final router = AppRouter(session).router;

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);
  });
}
