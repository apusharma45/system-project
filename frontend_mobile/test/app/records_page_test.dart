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

    expect(find.text('Diagnostic Report'), findsOneWidget);
    expect(find.byKey(const Key('records_back_button')), findsOneWidget);

    await tester.tap(find.text('Lab Orders'));
    await tester.pumpAndSettle();
    expect(find.text('Lab Tests Requested'), findsOneWidget);
    expect(find.text('City Lab'), findsOneWidget);
    expect(find.text('Tests not listed'), findsOneWidget);

    await tester.tap(find.text('Prescriptions'));
    await tester.pumpAndSettle();
    expect(find.text('Prescription'), findsOneWidget);
    expect(find.text('Doctor: Dr. Test'), findsOneWidget);
    expect(find.text('Prime Pharmacy'), findsOneWidget);
  });

  testWidgets('records page is scroll-safe on small viewport', (
    WidgetTester tester,
  ) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    await binding.setSurfaceSize(const Size(320, 560));
    addTearDown(() => binding.setSurfaceSize(null));

    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/records');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('records_list')), findsOneWidget);
    expect(find.byType(RefreshIndicator), findsOneWidget);
  });

  testWidgets('records back button falls back to home when no stack', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/records');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('records_back_button')));
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);
  });

  testWidgets('lab order card opens report details when report is available', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/records?tab=labs');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('records_lab_l1')));
    await tester.pumpAndSettle();

    expect(find.text('Report Details'), findsOneWidget);
  });
}
