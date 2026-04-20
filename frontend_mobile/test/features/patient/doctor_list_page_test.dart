import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('doctor list supports search filtering', (
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

    expect(find.text('Dr. Test'), findsOneWidget);
    expect(
      find.byKey(const Key('doctor_specialization_filters')),
      findsOneWidget,
    );

    await tester.enterText(
      find.byKey(const Key('doctor_search_input')),
      'neurology',
    );
    await tester.pumpAndSettle();

    expect(find.text('No doctors found.'), findsOneWidget);
  });

  testWidgets('doctor list actions navigate to details and booking', (
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

    await tester.tap(find.text('Details').first);
    await tester.pumpAndSettle();
    expect(find.text('Dr. Test'), findsOneWidget);
    expect(find.text('Qualifications'), findsOneWidget);

    router.go('/doctors');
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('doctor_card_open_d1')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('doctor_details_list')), findsOneWidget);
    expect(find.text('Dr. Test'), findsOneWidget);

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    await tester.tap(find.text('Book').first);
    await tester.pumpAndSettle();
    expect(find.text('Appointment Booking'), findsWidgets);
  });
}
