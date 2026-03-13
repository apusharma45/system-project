import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/presentation/pages/profile_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets('profile page loads and saves editable fields', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(home: Scaffold(body: ProfilePage())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Full Name'),
      'Updated Patient',
    );
    final saveButton = find.widgetWithText(FilledButton, 'Save Profile');
    await tester.tap(saveButton);
    await tester.pumpAndSettle();

    expect(find.text('Profile updated successfully.'), findsOneWidget);
  });
}
