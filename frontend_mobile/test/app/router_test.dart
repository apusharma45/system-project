import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('all main and param routes render expected page headings', (
    WidgetTester tester,
  ) async {
    final routes = <String, String>{
      '/': 'Home',
      '/doctors': 'Doctors',
      '/doctors/d-1': 'Doctor Details',
      '/booking/d-1': 'Appointment Booking',
      '/appointments': 'My Appointments',
      '/appointments/a-1': 'Appointment Details',
      '/records': 'Records',
      '/prescriptions/p-1': 'Prescription Details',
      '/reports/r-1': 'Report Details',
      '/profile': 'Profile',
      '/notifications': 'Notifications',
    };

    for (final entry in routes.entries) {
      final deps = await makeTestDependencies();
      final router = AppRouter.buildTestRouter(initialLocation: entry.key);
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp.router(routerConfig: router),
        ),
      );
      await tester.pumpAndSettle();
      expect(
        find.text(entry.value),
        findsWidgets,
        reason: 'route ${entry.key}',
      );
      await tester.pumpWidget(const SizedBox.shrink());
      await tester.pumpAndSettle();
    }
  });
}
