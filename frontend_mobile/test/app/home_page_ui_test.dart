import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/app_router.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

import '../helpers/test_dependencies.dart';

void main() {
  testWidgets('home renders figma header and quick action labels', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Welcome back,'), findsOneWidget);
    expect(find.byKey(const Key('home-notification-icon')), findsOneWidget);
    expect(find.text('Book Appointment'), findsOneWidget);
    expect(find.text('Find Doctor'), findsOneWidget);
    expect(find.text('My Appointments'), findsWidgets);
    expect(find.text('Reports & Rx'), findsOneWidget);
    expect(find.byKey(const Key('home-quick-actions')), findsOneWidget);
    expect(find.text('Upcoming Appointment'), findsOneWidget);
    expect(find.byIcon(Icons.chevron_right_rounded), findsWidgets);
  });

  testWidgets('home notification icon and section actions navigate correctly', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('home-notification-icon')));
    await tester.pumpAndSettle();
    expect(find.text('Notifications'), findsWidgets);

    router.go('/');
    await tester.pumpAndSettle();
    await tester.tap(find.text('View All').first);
    await tester.pumpAndSettle();
    expect(find.text('My Appointments'), findsOneWidget);
  });

  testWidgets('home hides notification FAB while non-home routes show it', (
    WidgetTester tester,
  ) async {
    final deps = await makeTestDependencies();
    final router = AppRouter.buildTestRouter(initialLocation: '/');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('fab-notifications')), findsNothing);

    router.go('/doctors');
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('fab-notifications')), findsOneWidget);
  });

  testWidgets('home fallback cards render when data is empty', (
    WidgetTester tester,
  ) async {
    final base = await makeTestDependencies();
    final deps = makeTestDependenciesWithSession(
      session: base.session,
      apiClient: base.apiClient,
      appointmentsRepository: const _EmptyAppointmentsRepository(),
      prescriptionsRepository: const _EmptyPrescriptionsRepository(),
      labsRepository: const _EmptyLabsRepository(),
      doctorsRepository: const _EmptyDoctorsRepository(),
    );
    final router = AppRouter.buildTestRouter(initialLocation: '/');

    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: MaterialApp.router(routerConfig: router),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('No upcoming appointments.'), findsOneWidget);
    expect(find.text('No prescriptions found.'), findsOneWidget);
    expect(find.text('No diagnostic reports available.'), findsOneWidget);
  });
}

class _EmptyDoctorsRepository implements DoctorsRepository {
  const _EmptyDoctorsRepository();

  @override
  Future<List<UserSummary>> listDoctors() async => const <UserSummary>[];

  @override
  Future<DoctorDetails?> getDoctorDetailsById(String doctorId) async => null;
}

class _EmptyAppointmentsRepository implements AppointmentsRepository {
  const _EmptyAppointmentsRepository();

  @override
  Future<Appointment> cancelAppointment(String appointmentId) async {
    throw UnimplementedError();
  }

  @override
  Future<Appointment> createAppointment(
    CreateAppointmentRequest request,
  ) async {
    throw UnimplementedError();
  }

  @override
  Future<Appointment?> getAppointmentById(String appointmentId) async => null;

  @override
  Future<List<Appointment>> listMyAppointments() async => const <Appointment>[];
}

class _EmptyLabsRepository implements LabsRepository {
  const _EmptyLabsRepository();

  @override
  Future<List<LabOrder>> listMyLabOrders() async => const <LabOrder>[];
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
