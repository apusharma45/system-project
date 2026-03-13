import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets(
    'notifications page supports filter/actions/deep-link navigation',
    (WidgetTester tester) async {
      final deps = await makeTestDependencies();
      final router = AppRouter.buildTestRouter(
        initialLocation: '/notifications',
      );

      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp.router(routerConfig: router),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Notifications'), findsWidgets);

      await tester.tap(find.text('Unread only'));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.done).first);
      await tester.pumpAndSettle();
      expect(find.text('Notification updated.'), findsOneWidget);

      final markAll = find.text('Mark all read');
      await tester.ensureVisible(markAll);
      await tester.tap(markAll);
      await tester.pumpAndSettle();
      expect(find.text('All notifications marked as read.'), findsOneWidget);

      await tester.tap(find.text('Unread only'));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.open_in_new).first);
      await tester.pumpAndSettle();

      expect(find.text('My Appointments'), findsOneWidget);
    },
  );
}
