import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/appointment_booking_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/appointment_details_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/doctor_details_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/prescription_details_page.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/report_details_page.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('detail pages show safe fallback for invalid params', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(home: DoctorDetailsPage(doctorId: '   ')),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Invalid doctor'), findsOneWidget);

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(home: AppointmentBookingPage(doctorId: null)),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Invalid doctor'), findsOneWidget);

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: AppointmentDetailsPage(appointmentId: ''),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Invalid appointment'), findsOneWidget);

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: PrescriptionDetailsPage(prescriptionId: null),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Invalid prescription'), findsOneWidget);

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(home: ReportDetailsPage(reportId: '  ')),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Invalid report'), findsOneWidget);
  });
}
