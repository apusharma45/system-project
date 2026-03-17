import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/appointment_booking_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/my_appointments_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('booking requires reason when preferred time note is provided', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: AppointmentBookingPage(doctorId: 'd1')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextFormField).at(2), 'Evening');
    await tester.ensureVisible(find.text('Send Request'));
    await tester.tap(find.text('Send Request'));
    await tester.pumpAndSettle();

    expect(
      find.text('Reason is required when preferred time note is provided.'),
      findsOneWidget,
    );
  });

  testWidgets(
    'appointments page shows cancel action for cancellable statuses',
    (WidgetTester tester) async {
      final deps = await makeTestDependencies();
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: const MaterialApp(home: Scaffold(body: MyAppointmentsPage())),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.cancel_outlined), findsOneWidget);
      await tester.tap(find.byIcon(Icons.cancel_outlined));
      await tester.pumpAndSettle();

      expect(find.text('Appointment cancelled.'), findsOneWidget);
    },
  );
}
