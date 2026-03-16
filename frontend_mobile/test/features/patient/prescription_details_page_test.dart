import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/prescription_details_page.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('prescription details renders medicine and pdf action', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(
          home: Scaffold(body: PrescriptionDetailsPage(prescriptionId: 'p1')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Prescription Details'), findsOneWidget);
    expect(
      find.byKey(const Key('prescription_details_back_button')),
      findsOneWidget,
    );
    expect(find.text('Dr. Test'), findsOneWidget);
    expect(find.text('Medicines'), findsOneWidget);
    expect(find.text('Atorvastatin'), findsOneWidget);
    expect(find.text("Doctor's Advice"), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Download Prescription PDF'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Download Prescription PDF'), findsOneWidget);
  });

  testWidgets(
    'prescription details shows invalid fallback for unknown prescription id',
    (WidgetTester tester) async {
      final deps = await makeTestDependencies();
      final patched = makeTestDependenciesWithSession(
        session: deps.session,
        apiClient: deps.apiClient,
        prescriptionsRepository: const _EmptyPrescriptionsRepository(),
      );
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: patched,
          child: const MaterialApp(
            home: Scaffold(
              body: PrescriptionDetailsPage(prescriptionId: 'missing'),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Invalid prescription'), findsOneWidget);
    },
  );
}

class _EmptyPrescriptionsRepository implements PrescriptionsRepository {
  const _EmptyPrescriptionsRepository();

  @override
  Future<Prescription?> getPrescriptionById(String prescriptionId) async =>
      null;

  @override
  Future<List<Prescription>> listMyPrescriptions() async =>
      const <Prescription>[];
}
