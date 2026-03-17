import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/domain/enums.dart';
import '../../../../core/domain/models.dart';
import '../../domain/status_label_mapper.dart';

class MyAppointmentsPage extends StatefulWidget {
  const MyAppointmentsPage({super.key});

  @override
  State<MyAppointmentsPage> createState() => _MyAppointmentsPageState();
}

class _MyAppointmentsPageState extends State<MyAppointmentsPage> {
  Future<List<Appointment>>? _future;
  String? _message;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<List<Appointment>> _load() {
    return AppScope.of(context).appointmentsRepository.listMyAppointments();
  }

  bool _canCancel(Appointment item) {
    return item.status == AppointmentStatus.requested ||
        item.status == AppointmentStatus.confirmed;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Appointment>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text('Failed to load appointments: ${snapshot.error}'),
          );
        }

        final appointments = snapshot.data ?? const <Appointment>[];
        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'My Appointments',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Track requested, confirmed, and completed appointments.',
            ),
            const SizedBox(height: 16),
            if (_message != null) Text(_message!),
            if (appointments.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No appointments yet.'),
                ),
              ),
            ...appointments.map((appointment) {
              final doctorName =
                  appointment.doctorSnapshot?.fullName ??
                  appointment.doctorSnapshot?.email ??
                  'Doctor';
              return Card(
                child: ListTile(
                  title: Text(doctorName),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Status: ${appointmentStatusLabel(appointment.status)}',
                      ),
                      if (appointment.reason != null &&
                          appointment.reason!.trim().isNotEmpty)
                        Text('Reason: ${appointment.reason}'),
                    ],
                  ),
                  trailing: Wrap(
                    spacing: 8,
                    children: <Widget>[
                      IconButton(
                        onPressed: () => context.go(
                          AppRoutes.appointmentDetails(appointment.id),
                        ),
                        icon: const Icon(Icons.open_in_new),
                      ),
                      if (_canCancel(appointment))
                        IconButton(
                          onPressed: () async {
                            try {
                              await AppScope.of(context).appointmentsRepository
                                  .cancelAppointment(appointment.id);
                              setState(() {
                                _future = _load();
                                _message = 'Appointment cancelled.';
                              });
                            } catch (error) {
                              setState(
                                () => _message = 'Cancel failed: $error',
                              );
                            }
                          },
                          icon: const Icon(Icons.cancel_outlined),
                        ),
                    ],
                  ),
                ),
              );
            }),
          ],
        );
      },
    );
  }
}
