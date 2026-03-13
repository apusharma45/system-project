import 'package:flutter/material.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../shared/widgets/invalid_param_card.dart';
import '../../domain/status_label_mapper.dart';

class AppointmentDetailsPage extends StatefulWidget {
  const AppointmentDetailsPage({required this.appointmentId, super.key});

  final String? appointmentId;

  @override
  State<AppointmentDetailsPage> createState() => _AppointmentDetailsPageState();
}

class _AppointmentDetailsPageState extends State<AppointmentDetailsPage> {
  Future<_DetailsData?>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<_DetailsData?> _load() async {
    final id = RouteParam.parse(widget.appointmentId)?.value;
    if (id == null) return null;

    final deps = AppScope.of(context);
    final appointments = await deps.appointmentsRepository.listMyAppointments();
    final prescriptions = await deps.prescriptionsRepository
        .listMyPrescriptions();
    final labs = await deps.labsRepository.listMyLabOrders();

    Appointment? appointment;
    for (final item in appointments) {
      if (item.id == id) {
        appointment = item;
        break;
      }
    }
    if (appointment == null) return null;

    final prescriptionForAppointment = prescriptions
        .where((item) => item.appointmentId == id)
        .toList();
    final labsForAppointment = labs
        .where((item) => item.appointmentId == id)
        .toList();

    return _DetailsData(
      appointment: appointment,
      prescriptions: prescriptionForAppointment,
      labs: labsForAppointment,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_DetailsData?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final data = snapshot.data;
        if (data == null) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: const <Widget>[
              Text(
                'Appointment Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
              ),
              SizedBox(height: 8),
              Text('Visit overview, prescriptions, lab orders, and reports.'),
              SizedBox(height: 16),
              InvalidParamCard(entityName: 'appointment'),
            ],
          );
        }

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'Appointment Details',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Visit overview, prescriptions, lab orders, and reports.',
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Status: ${appointmentStatusLabel(data.appointment.status)}',
                    ),
                    if (data.appointment.reason != null &&
                        data.appointment.reason!.trim().isNotEmpty)
                      Text('Reason: ${data.appointment.reason}'),
                    Text(
                      'Doctor: ${data.appointment.doctorSnapshot?.fullName ?? data.appointment.doctorSnapshot?.email ?? 'Not provided'}',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Prescriptions (${data.prescriptions.length})',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    if (data.prescriptions.isEmpty)
                      const Text('No prescriptions for this appointment.')
                    else
                      ...data.prescriptions.map(
                        (rx) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Text(
                            '${prescriptionStatusLabel(rx.status)} - ${rx.notes.isEmpty ? 'No notes' : rx.notes}',
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Lab Orders (${data.labs.length})',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    if (data.labs.isEmpty)
                      const Text('No lab orders for this appointment.')
                    else
                      ...data.labs.map(
                        (lab) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Text(
                            '${labOrderStatusLabel(lab.status)} - ${lab.diagnosticSnapshot?.name ?? 'Diagnostic center'}',
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _DetailsData {
  const _DetailsData({
    required this.appointment,
    required this.prescriptions,
    required this.labs,
  });

  final Appointment appointment;
  final List<Prescription> prescriptions;
  final List<LabOrder> labs;
}
