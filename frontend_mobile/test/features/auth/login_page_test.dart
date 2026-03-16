import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/app_scope.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/features/auth/presentation/pages/login_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('renders figma-style login hierarchy and actions', (
    WidgetTester tester,
  ) async {
    final dependencies = await makeTestDependencies();

    await tester.pumpWidget(
      AppScope(
        dependencies: dependencies,
        child: const MaterialApp(home: LoginPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Sign in to continue your care journey.'), findsOneWidget);
    expect(find.text('Email Address'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Sign in'), findsWidgets);
    expect(find.text("Don't have an account?"), findsOneWidget);
    expect(find.text('Sign up'), findsOneWidget);
    expect(find.text('Forgot password?'), findsOneWidget);
  });

  testWidgets('shows validation and API error states', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;
    final client = MockClient((request) async {
      if (request.url.path.endsWith('/auth/login')) {
        return http.Response(
          jsonEncode(<String, dynamic>{'message': 'Invalid credentials'}),
          401,
        );
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
    final deps = makeTestDependenciesWithSession(session: session, apiClient: api);

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: LoginPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byType(FilledButton));
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();
    expect(find.text('Enter a valid email address'), findsOneWidget);
    expect(find.text('Password must be at least 6 characters'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField).first, 'patient@example.com');
    await tester.enterText(find.byType(TextFormField).last, 'secret123');
    await tester.ensureVisible(find.byType(FilledButton));
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();

    expect(find.text('Invalid credentials'), findsOneWidget);
  });

  testWidgets('shows loading state while login request is in flight', (
    WidgetTester tester,
  ) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;
    final completer = Completer<http.Response>();
    final client = MockClient((request) async {
      if (request.url.path.endsWith('/auth/login')) {
        return completer.future;
      }
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
      return http.Response('{}', 200);
    });
    final api = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => session.token,
      httpClient: client,
    );
    session = SessionController(apiClient: api, preferences: prefs);
    await session.bootstrap();
    final deps = makeTestDependenciesWithSession(session: session, apiClient: api);

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: LoginPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextFormField).first, 'patient@example.com');
    await tester.enterText(find.byType(TextFormField).last, 'secret123');
    await tester.ensureVisible(find.byType(FilledButton));
    await tester.tap(find.byType(FilledButton));
    await tester.pump();

    expect(find.text('Signing in...'), findsOneWidget);

    completer.complete(
      http.Response(jsonEncode(<String, dynamic>{'access_token': 'abc'}), 200),
    );
    await tester.pumpAndSettle();
  });

  testWidgets('is scroll-safe on small viewports', (WidgetTester tester) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    await binding.setSurfaceSize(const Size(320, 560));
    addTearDown(() => binding.setSurfaceSize(null));

    final dependencies = await makeTestDependencies();
    await tester.pumpWidget(
      AppScope(
        dependencies: dependencies,
        child: const MaterialApp(home: LoginPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SingleChildScrollView), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
