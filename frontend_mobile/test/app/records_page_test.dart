import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('records page supports tab query selection', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(
      initialLocation: '/records?tab=reports',
    );

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.textContaining('Report r1'), findsOneWidget);

    await tester.tap(find.textContaining('Labs ('));
    await tester.pumpAndSettle();
    expect(find.textContaining('Lab Order l1'), findsOneWidget);

    await tester.tap(find.text('Prescriptions (1)'));
    await tester.pumpAndSettle();
    expect(find.textContaining('Prescription p1'), findsOneWidget);
  });
}
