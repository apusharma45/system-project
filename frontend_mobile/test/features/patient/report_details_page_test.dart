import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/report_details_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('report details resolves report id from lab reports', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: ReportDetailsPage(reportId: 'r1')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('report_details_back_button')), findsOneWidget);
    expect(find.textContaining('Report r1'), findsOneWidget);
    expect(find.textContaining('Lab Order: l1'), findsOneWidget);
    expect(find.text('Diagnostic Center'), findsOneWidget);
    expect(find.text('Report File'), findsOneWidget);
  });

  testWidgets('report details shows invalid fallback for unknown report id', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: ReportDetailsPage(reportId: 'missing')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Invalid report'), findsOneWidget);
  });
}
