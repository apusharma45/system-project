import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('back returns from pushed notifications to home', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);
    await tester.tap(find.byKey(const Key('home-notification-icon')));
    await tester.pumpAndSettle();
    expect(find.text('Notifications'), findsWidgets);

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(find.text('Home'), findsWidgets);
  });

  testWidgets('back returns from pushed doctor details to doctors list', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/doctors');
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Doctors'), findsWidgets);
    final detailsButton = find.text('Details').first;
    await tester.ensureVisible(detailsButton);
    await tester.tap(detailsButton);
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('doctor_details_list')), findsOneWidget);

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(find.text('Doctors'), findsWidgets);
  });
}
