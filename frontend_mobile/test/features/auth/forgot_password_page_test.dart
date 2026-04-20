import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/app_scope.dart';
import 'package:frontend_mobile/app/router/app_router.dart';
import 'package:frontend_mobile/core/api/api_exception.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/auth/presentation/pages/forgot_password_page.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('renders hierarchy and required fields', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Reset Password'), findsOneWidget);
    expect(find.text('Email Address'), findsOneWidget);
    expect(find.text('Reset Code'), findsOneWidget);
    expect(find.text('New Password'), findsOneWidget);
    expect(find.text('Confirm New Password'), findsOneWidget);
    expect(find.text('Request reset code'), findsOneWidget);
    expect(find.text('Reset password'), findsOneWidget);
  });

  testWidgets('shows validation messages for invalid form', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(
      find.byKey(const Key('forgot_reset_password_button')),
    );
    await tester.tap(find.byKey(const Key('forgot_reset_password_button')));
    await tester.pumpAndSettle();

    expect(find.text('Enter a valid email address'), findsOneWidget);
    expect(find.text('Reset code is required'), findsOneWidget);
    expect(find.text('Password must be at least 6 characters'), findsOneWidget);
  });

  testWidgets('request code calls repository and shows success', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();
    final authRepo = _FakeForgotAuthRepository();

    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      authRepository: authRepo,
    );

    await tester.pumpWidget(
      AppScope(
        dependencies: patched,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextFormField).first,
      'patient@example.com',
    );
    await tester.tap(find.byKey(const Key('forgot_request_code_button')));
    await tester.pumpAndSettle();

    expect(authRepo.requestedEmail, 'patient@example.com');
    expect(find.text('Reset code sent. Check your email.'), findsOneWidget);
  });

  testWidgets('shows backend error when request code fails', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();
    final authRepo = _FakeForgotAuthRepository(
      requestError: const ApiException('Unable to send reset code'),
    );

    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      authRepository: authRepo,
    );

    await tester.pumpWidget(
      AppScope(
        dependencies: patched,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextFormField).first,
      'patient@example.com',
    );
    await tester.tap(find.byKey(const Key('forgot_request_code_button')));
    await tester.pumpAndSettle();

    expect(find.text('Unable to send reset code'), findsOneWidget);
  });

  testWidgets('reset password success routes to login', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();
    final authRepo = _FakeForgotAuthRepository();

    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      authRepository: authRepo,
    );
    final router = AppRouter(deps.session).router;

    await tester.pumpWidget(
      AppScope(
        dependencies: patched,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('login_forgot_link')));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextFormField).at(0),
      'patient@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(1), 'ABC123');
    await tester.enterText(find.byType(TextFormField).at(2), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(3), 'secret123');
    await tester.ensureVisible(
      find.byKey(const Key('forgot_reset_password_button')),
    );
    await tester.tap(find.byKey(const Key('forgot_reset_password_button')));
    await tester.pumpAndSettle();

    expect(authRepo.resetRequest, isNotNull);
    expect(authRepo.resetRequest!.email, 'patient@example.com');
    expect(authRepo.resetRequest!.resetCode, 'ABC123');
    expect(authRepo.resetRequest!.newPassword, 'secret123');
    expect(find.text('Welcome Back'), findsOneWidget);
  });

  testWidgets('shows backend error when reset fails', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await deps.session.bootstrap();
    final authRepo = _FakeForgotAuthRepository(
      resetError: const ApiException('Invalid reset code'),
    );

    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      authRepository: authRepo,
    );

    await tester.pumpWidget(
      AppScope(
        dependencies: patched,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextFormField).at(0),
      'patient@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(1), 'ABC123');
    await tester.enterText(find.byType(TextFormField).at(2), 'secret123');
    await tester.enterText(find.byType(TextFormField).at(3), 'secret123');
    await tester.ensureVisible(
      find.byKey(const Key('forgot_reset_password_button')),
    );
    await tester.tap(find.byKey(const Key('forgot_reset_password_button')));
    await tester.pumpAndSettle();

    expect(find.text('Invalid reset code'), findsOneWidget);
  });

  testWidgets('page is scroll-safe on small viewport', (
    WidgetTester tester,
  ) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    await binding.setSurfaceSize(const Size(320, 560));
    addTearDown(() => binding.setSurfaceSize(null));

    final deps = await makeTestDependencies();
    await deps.session.bootstrap();

    await tester.pumpWidget(
      AppScope(
        dependencies: deps,
        child: const MaterialApp(home: ForgotPasswordPage()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SingleChildScrollView), findsOneWidget);
  });
}

class _FakeForgotAuthRepository implements AuthRepository {
  _FakeForgotAuthRepository({this.resetError, this.requestError});

  final ApiException? resetError;
  final ApiException? requestError;
  String? requestedEmail;
  ResetPasswordRequest? resetRequest;

  @override
  Future<CurrentUser> getCurrentUser() async {
    return const CurrentUser(
      userId: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient',
    );
  }

  @override
  Future<String> registerPatient(PatientSignUpRequest request) async =>
      'unused';

  @override
  Future<void> requestPasswordReset(ForgotPasswordRequest request) async {
    if (requestError != null) throw requestError!;
    requestedEmail = request.email;
  }

  @override
  Future<void> resetPassword(ResetPasswordRequest request) async {
    if (resetError != null) throw resetError!;
    resetRequest = request;
  }
}
