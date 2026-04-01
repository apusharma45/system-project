import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';
import 'package:frontend_mobile/app/state/session_controller.dart';
import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('profile page renders full settings menu items', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/profile');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.drag(
      find.byKey(const Key('profile_list')),
      const Offset(0, -700),
    );
    await tester.pumpAndSettle();

    expect(find.text('Notifications'), findsOneWidget);
    expect(find.text('Help and Support'), findsOneWidget);
    expect(find.text('Security and Privacy'), findsOneWidget);
    expect(find.text('Logout'), findsOneWidget);
  });

  testWidgets(
    'profile settings notifications item navigates to notifications',
    (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      final deps = await makeTestDependencies();
      final router = AppRouter.buildTestRouter(initialLocation: '/profile');
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp.router(routerConfig: router),
        ),
      );
      await tester.pumpAndSettle();

      await tester.drag(
        find.byKey(const Key('profile_list')),
        const Offset(0, -700),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('profile_settings_notifications')));
      await tester.pumpAndSettle();
      expect(find.text('Notifications'), findsWidgets);
    },
  );

  testWidgets('help and support opens modal content', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/profile');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.drag(
      find.byKey(const Key('profile_list')),
      const Offset(0, -700),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('profile_settings_help')));
    await tester.pumpAndSettle();
    expect(find.text('Help and Support'), findsWidgets);
    expect(find.textContaining('support@medflow.com'), findsOneWidget);
  });

  testWidgets('security and privacy password flow requests code and resets', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    final authSpy = _AuthRepositorySpy();
    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      authRepository: authSpy,
    );
    final router = AppRouter.buildTestRouter(initialLocation: '/profile');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: patched,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.drag(
      find.byKey(const Key('profile_list')),
      const Offset(0, -700),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('profile_settings_security')));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const Key('settings_email_input')),
      'patient@example.com',
    );
    await tester.tap(find.byKey(const Key('settings_request_code_button')));
    await tester.pumpAndSettle();
    expect(authSpy.requestCount, 1);

    await tester.enterText(
      find.byKey(const Key('settings_code_input')),
      '123456',
    );
    await tester.enterText(
      find.byKey(const Key('settings_new_password_input')),
      'newpass123',
    );
    await tester.enterText(
      find.byKey(const Key('settings_confirm_password_input')),
      'newpass123',
    );
    tester.testTextInput.hide();
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('settings_change_password_button')));
    await tester.pumpAndSettle();

    expect(authSpy.resetCount, 1);
    expect(deps.session.status, AuthStatus.unauthenticated);
    expect(find.text('Sign in'), findsWidgets);
  });

  testWidgets('logout tile signs out and routes to login', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    await deps.session.authenticateWithToken('fake-token');
    final router = AppRouter(deps.session).router;
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    router.go('/profile');
    await tester.pumpAndSettle();
    await tester.drag(
      find.byKey(const Key('profile_list')),
      const Offset(0, -700),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('profile_settings_logout')));
    await tester.pumpAndSettle();

    expect(deps.session.status, AuthStatus.unauthenticated);
    expect(find.text('Sign in'), findsWidgets);
  });
}

class _AuthRepositorySpy implements AuthRepository {
  int requestCount = 0;
  int resetCount = 0;

  @override
  Future<CurrentUser> getCurrentUser() async {
    return const CurrentUser(
      userId: 'u1',
      email: 'patient@example.com',
      role: UserRole.patient,
      fullName: 'Patient One',
    );
  }

  @override
  Future<String> registerPatient(PatientSignUpRequest request) async {
    return 'fake-token';
  }

  @override
  Future<void> requestPasswordReset(ForgotPasswordRequest request) async {
    requestCount += 1;
  }

  @override
  Future<void> resetPassword(ResetPasswordRequest request) async {
    resetCount += 1;
  }
}
