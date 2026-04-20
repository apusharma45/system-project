import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/doctor_details_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('doctor details renders profile sections with backend data', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: DoctorDetailsPage(doctorId: 'd1')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('doctor_details_back_button')), findsOneWidget);
    expect(find.text('Dr. Test'), findsOneWidget);
    expect(find.text('Cardiology'), findsOneWidget);
    expect(find.text('Qualifications'), findsOneWidget);
    expect(find.text('About'), findsOneWidget);
    expect(find.text('Clinic Information'), findsOneWidget);
    expect(find.text('Available Time Slots'), findsOneWidget);
    await tester.drag(
      find.byKey(const Key('doctor_details_list')),
      const Offset(0, -600),
    );
    await tester.pumpAndSettle();
    expect(find.text('Book Appointment'), findsOneWidget);
  });
}
