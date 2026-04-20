import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:frontend_mobile/app/app_scope.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/core/api/api_exception.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/auth/presentation/pages/sign_up_page.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('renders signup hierarchy and core fields', (
    WidgetTester tester,
  ) async {
    final dependencies = await makeTestDependencies();
    await dependencies.session.bootstrap();

    await tester.pumpWidget(
      AppScope(
        dependencies: dependencies,
        child: const MaterialApp(home: SignUpPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Create Account'), findsOneWidget);
    expect(find.text('Patient Sign Up'), findsOneWidget);
    expect(find.text('Full Name'), findsOneWidget);
    expect(find.text('Email Address'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Confirm Password'), findsOneWidget);
    expect(find.text('Phone'), findsOneWidget);
    expect(find.text('Address'), findsOneWidget);
    expect(find.text('Gender'), findsOneWidget);
    expect(find.text('Date of Birth'), findsOneWidget);
    expect(find.text('Create account'), findsOneWidget);
    expect(find.text('Already have an account?'), findsOneWidget);
  });

  testWidgets('shows validation errors when required fields are missing', (
    WidgetTester tester,
  ) async {
    final dependencies = await makeTestDependencies();
    await dependencies.session.bootstrap();

    await tester.pumpWidget(
      AppScope(
        dependencies: dependencies,
        child: const MaterialApp(home: SignUpPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byType(FilledButton));
    await tester.ensureVisible(find.byKey(const Key('signup_submit_button')));
    await tester.tap(find.byKey(const Key('signup_submit_button')));
    await tester.pumpAndSettle();

    expect(
      find.text('Full name must be at least 2 characters'),
      findsOneWidget,
    );
    expect(find.text('Enter a valid email address'), findsOneWidget);
    expect(find.text('Password must be at least 6 characters'), findsOneWidget);
    expect(find.text('Phone is required'), findsOneWidget);
    expect(find.text('Address is required'), findsOneWidget);
  });

  testWidgets('successful signup submits and authenticates session', (
    WidgetTester tester,
  ) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;
    final client = MockClient((request) async {
      if (request.url.path.endsWith('/users/me')) {
        return http.Response('''
{
  "userId": "u-signup",
  "email": "new.patient@example.com",
  "role": "PATIENT",
  "fullName": "New Patient"
}
''', 200);
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
    final authRepo = _CapturingAuthRepository(
      token: 'signup-token',
      user: const CurrentUser(
        userId: 'u-signup',
        email: 'new.patient@example.com',
        role: UserRole.patient,
        fullName: 'New Patient',
      ),
    );
    final deps = makeTestDependenciesWithSession(
      session: session,
      apiClient: api,
      authRepository: authRepo,
    );

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: SignUpPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextFormField).at(0), 'New Patient');
    await tester.enterText(
      find.byType(TextFormField).at(1),
      'new.patient@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(2), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(3), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(4), '+15550001234');
    await tester.enterText(find.byType(TextFormField).at(5), 'Dhaka');

    await tester.enterText(
      find.byKey(const Key('signup_dob_field')),
      '2000-01-01',
    );

    await tester.ensureVisible(find.byKey(const Key('signup_submit_button')));
    await tester.tap(find.byKey(const Key('signup_submit_button')));
    await tester.pumpAndSettle();

    expect(authRepo.lastRequest, isNotNull);
    expect(authRepo.lastRequest!.fullName, 'New Patient');
    expect(authRepo.lastRequest!.email, 'new.patient@example.com');
    expect(authRepo.lastRequest!.gender, PatientRegistrationGender.male);
    expect(authRepo.lastRequest!.dateOfBirth, DateTime(2000, 1, 1));
    expect(session.status, AuthStatus.authenticated);
    expect(session.user?.email, 'new.patient@example.com');
  });

  testWidgets('shows backend error when register fails', (
    WidgetTester tester,
  ) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final prefs = await SharedPreferences.getInstance();
    late final SessionController session;

    final client = MockClient((request) async => http.Response('{}', 200));

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
      authRepository: _CapturingAuthRepository(
        error: const ApiException('Email already used'),
      ),
    );

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: SignUpPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextFormField).at(0), 'New Patient');
    await tester.enterText(
      find.byType(TextFormField).at(1),
      'new.patient@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(2), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(3), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(4), '+15550001234');
    await tester.enterText(find.byType(TextFormField).at(5), 'Dhaka');

    await tester.enterText(
      find.byKey(const Key('signup_dob_field')),
      '2000-01-01',
    );

    await tester.ensureVisible(find.byKey(const Key('signup_submit_button')));
    await tester.tap(find.byKey(const Key('signup_submit_button')));
    await tester.pumpAndSettle();

    expect(find.text('Email already used'), findsOneWidget);
  });

  testWidgets('signup is scroll-safe on small viewports', (
    WidgetTester tester,
  ) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    await binding.setSurfaceSize(const Size(320, 560));
    addTearDown(() => binding.setSurfaceSize(null));

    final dependencies = await makeTestDependencies();
    await dependencies.session.bootstrap();
    await tester.pumpWidget(
      AppScope(
        dependencies: dependencies,
        child: const MaterialApp(home: SignUpPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SingleChildScrollView), findsOneWidget);
  });
}

class _CapturingAuthRepository implements AuthRepository {
  _CapturingAuthRepository({
    this.token,
    this.error,
    this.user = const CurrentUser(
      userId: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient',
    ),
  });

  final String? token;
  final ApiException? error;
  final CurrentUser user;
  PatientSignUpRequest? lastRequest;

  @override
  Future<CurrentUser> getCurrentUser() async => user;

  @override
  Future<String> registerPatient(PatientSignUpRequest request) async {
    lastRequest = request;
    if (error != null) throw error!;
    return token ?? 'token';
  }

  @override
  Future<void> requestPasswordReset(ForgotPasswordRequest request) async {}

  @override
  Future<void> resetPassword(ResetPasswordRequest request) async {}
}
