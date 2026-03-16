import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/appointment_details_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('appointment details renders summary and linked sections', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: AppointmentDetailsPage(appointmentId: 'a1')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Appointment Details'), findsWidgets);
    expect(find.byKey(const Key('appointment_details_back_button')), findsOneWidget);
    expect(find.text('Dr. Test'), findsOneWidget);
    expect(find.textContaining('Prescriptions (1)'), findsOneWidget);
    expect(find.textContaining('Lab Orders (1)'), findsOneWidget);
  });
}
