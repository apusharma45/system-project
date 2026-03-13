import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import 'helpers/test_dependencies.dart';

void main() {
  testWidgets('bottom navigation routes between primary tabs', (
    WidgetTester tester,
  ) async {
    final router = AppRouter.buildTestRouter();
    final deps = await makeTestDependencies();

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);

    await tester.tap(find.byIcon(Icons.medical_services_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Doctors'), findsWidgets);

    await tester.tap(find.byIcon(Icons.calendar_today_outlined));
    await tester.pumpAndSettle();
    expect(find.text('My Appointments'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.folder_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Records'), findsWidgets);

    await tester.tap(find.byIcon(Icons.person_outline));
    await tester.pumpAndSettle();
    expect(find.text('Profile'), findsWidgets);
  });

  testWidgets('floating notifications action navigates to notifications page', (
    WidgetTester tester,
  ) async {
    final router = AppRouter.buildTestRouter(initialLocation: '/doctors');
    final deps = await makeTestDependencies();

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('fab-notifications')), findsOneWidget);
    await tester.tap(find.byKey(const Key('fab-notifications')));
    await tester.pumpAndSettle();

    expect(find.text('Notifications'), findsWidgets);
  });
}
