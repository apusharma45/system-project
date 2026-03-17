import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

class FakeAppointmentsRepository implements AppointmentsRepository {
  @override
  Future<Appointment> cancelAppointment(String appointmentId) async {
    return Appointment(
      id: appointmentId,
      patientId: 'p1',
      doctorId: 'd1',
      status: AppointmentStatus.cancelled,
    );
  }

  @override
  Future<Appointment> createAppointment(
    CreateAppointmentRequest request,
  ) async {
    return Appointment(
      id: 'a1',
      patientId: 'p1',
      doctorId: request.doctorId,
      status: AppointmentStatus.requested,
    );
  }

  @override
  Future<Appointment?> getAppointmentById(String appointmentId) async {
    return Appointment(
      id: appointmentId,
      patientId: 'p1',
      doctorId: 'd1',
      status: AppointmentStatus.confirmed,
    );
  }

  @override
  Future<List<Appointment>> listMyAppointments() async {
    return const <Appointment>[];
  }
}

void main() {
  test('repository interfaces support expected method signatures', () async {
    final repo = FakeAppointmentsRepository();

    final created = await repo.createAppointment(
      const CreateAppointmentRequest(doctorId: 'd1', reason: 'checkup'),
    );
    expect(created.status, AppointmentStatus.requested);

    final cancelled = await repo.cancelAppointment('a1');
    expect(cancelled.status, AppointmentStatus.cancelled);

    final loaded = await repo.getAppointmentById('a1');
    expect(loaded, isNotNull);
    expect(loaded!.id, 'a1');
  });
}
