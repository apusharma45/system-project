import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';
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

      expect(find.byKey(const Key('appointments_header')), findsOneWidget);
      expect(find.text('View Details'), findsOneWidget);
      expect(find.byIcon(Icons.cancel_outlined), findsOneWidget);
      await tester.tap(find.byIcon(Icons.cancel_outlined));
      await tester.pumpAndSettle();

      expect(find.text('Appointment cancelled.'), findsOneWidget);
    },
  );

  testWidgets('appointments filter chips switch date-first categories', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final patched = makeTestDependenciesWithSession(
      session: deps.session,
      apiClient: deps.apiClient,
      appointmentsRepository: const _FilterAppointmentsRepository(),
    );
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: patched,
        child: const MaterialApp(home: Scaffold(body: MyAppointmentsPage())),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('appointments_filter_chips')), findsOneWidget);
    expect(find.text('Upcoming Visit'), findsOneWidget);
    expect(find.text('Cancelled Visit'), findsNothing);

    await tester.tap(find.text('Cancelled'));
    await tester.pumpAndSettle();
    expect(find.text('Cancelled Visit'), findsOneWidget);
    expect(find.text('Upcoming Visit'), findsNothing);

    await tester.tap(find.text('Previous'));
    await tester.pumpAndSettle();
    expect(find.text('Past Visit'), findsOneWidget);
  });
}

class _FilterAppointmentsRepository implements AppointmentsRepository {
  const _FilterAppointmentsRepository();

  @override
  Future<Appointment> cancelAppointment(String appointmentId) async {
    throw UnimplementedError();
  }

  @override
  Future<Appointment> createAppointment(CreateAppointmentRequest request) async {
    throw UnimplementedError();
  }

  @override
  Future<Appointment?> getAppointmentById(String appointmentId) async {
    return null;
  }

  @override
  Future<List<Appointment>> listMyAppointments() async {
    final now = DateTime.now();
    return <Appointment>[
      Appointment(
        id: 'a-upcoming',
        patientId: 'u1',
        doctorId: 'd1',
        status: AppointmentStatus.confirmed,
        reason: 'Upcoming Visit',
        preferredDateFrom: now.add(const Duration(days: 2)),
      ),
      Appointment(
        id: 'a-previous',
        patientId: 'u1',
        doctorId: 'd1',
        status: AppointmentStatus.closed,
        reason: 'Past Visit',
        preferredDateFrom: now.subtract(const Duration(days: 4)),
      ),
      Appointment(
        id: 'a-cancelled',
        patientId: 'u1',
        doctorId: 'd1',
        status: AppointmentStatus.cancelled,
        reason: 'Cancelled Visit',
        preferredDateFrom: now.add(const Duration(days: 1)),
      ),
    ];
  }
}
