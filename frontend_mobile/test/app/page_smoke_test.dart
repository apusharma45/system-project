import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/doctor_list_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/home_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/my_appointments_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/profile_page.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('core page shells render scaffold and heading text', (
    WidgetTester tester,
  ) async {
    final pages = <Widget>[
      const HomePage(),
      const DoctorListPage(),
      const MyAppointmentsPage(),
      const ProfilePage(),
    ];

    for (final page in pages) {
      final deps = await makeTestDependencies();
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp(home: Scaffold(body: page)),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.byType(ListView), findsOneWidget);
      if (page is HomePage) {
        expect(find.byKey(const Key('home-notification-icon')), findsOneWidget);
      } else {
        expect(find.byType(Card), findsWidgets);
      }
    }
  });
}
