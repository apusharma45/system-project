import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../features/patient/data/repositories/patient_repositories.dart';
import '../../../../shared/widgets/invalid_param_card.dart';

class AppointmentBookingPage extends StatefulWidget {
  const AppointmentBookingPage({required this.doctorId, super.key});

  final String? doctorId;

  @override
  State<AppointmentBookingPage> createState() => _AppointmentBookingPageState();
}

class _AppointmentBookingPageState extends State<AppointmentBookingPage> {
  final _formKey = GlobalKey<FormState>();
  final _fromController = TextEditingController();
  final _toController = TextEditingController();
  final _timeNoteController = TextEditingController();
  final _reasonController = TextEditingController();

  bool _submitting = false;
  String? _status;

  @override
  void dispose() {
    _fromController.dispose();
    _toController.dispose();
    _timeNoteController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  DateTime? _parseDate(String raw) {
    if (raw.trim().isEmpty) return null;
    return DateTime.tryParse(raw.trim());
  }

  @override
  Widget build(BuildContext context) {
    final doctorParam = RouteParam.parse(widget.doctorId);
    if (doctorParam == null) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: const <Widget>[
          Text(
            'Appointment Booking',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
          ),
          SizedBox(height: 8),
          Text('Create a booking request with preferred schedule options.'),
          SizedBox(height: 16),
          InvalidParamCard(entityName: 'doctor'),
        ],
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: <Widget>[
        Text(
          'Appointment Booking',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        const SizedBox(height: 8),
        const Text('Create a booking request with preferred schedule options.'),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text('Doctor ID: ${doctorParam.value}'),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _fromController,
                    decoration: const InputDecoration(
                      labelText: 'Preferred From (ISO, optional)',
                      hintText: '2026-03-20T09:00:00',
                    ),
                    validator: (value) {
                      if ((value ?? '').trim().isEmpty) {
                        return null;
                      }
                      if (_parseDate(value!) == null) {
                        return 'Use ISO datetime format';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _toController,
                    decoration: const InputDecoration(
                      labelText: 'Preferred To (ISO, optional)',
                      hintText: '2026-03-20T17:00:00',
                    ),
                    validator: (value) {
                      if ((value ?? '').trim().isEmpty) {
                        return null;
                      }
                      if (_parseDate(value!) == null) {
                        return 'Use ISO datetime format';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _timeNoteController,
                    decoration: const InputDecoration(
                      labelText: 'Preferred Time Note (optional)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _reasonController,
                    decoration: const InputDecoration(labelText: 'Reason'),
                    minLines: 2,
                    maxLines: 4,
                    validator: (value) {
                      final note = _timeNoteController.text.trim();
                      final reason = (value ?? '').trim();
                      if (note.isNotEmpty && reason.isEmpty) {
                        return 'Reason is required when preferred time note is provided.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  if (_status != null) Text(_status!),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _submitting
                          ? null
                          : () async {
                              if (!_formKey.currentState!.validate()) {
                                return;
                              }
                              final router = GoRouter.of(context);
                              setState(() {
                                _submitting = true;
                                _status = null;
                              });
                              try {
                                final repo = AppScope.of(
                                  context,
                                ).appointmentsRepository;
                                final created = await repo.createAppointment(
                                  CreateAppointmentRequest(
                                    doctorId: doctorParam.value,
                                    preferredDateFrom: _parseDate(
                                      _fromController.text,
                                    ),
                                    preferredDateTo: _parseDate(
                                      _toController.text,
                                    ),
                                    preferredTimeNote: _timeNoteController.text
                                        .trim(),
                                    reason: _reasonController.text.trim(),
                                  ),
                                );
                                setState(
                                  () => _status =
                                      'Appointment requested: ${created.id}',
                                );
                                if (!mounted) {
                                  return;
                                }
                                router.go(AppRoutes.appointments);
                              } catch (error) {
                                setState(
                                  () => _status =
                                      'Failed to create appointment: $error',
                                );
                              } finally {
                                if (mounted) {
                                  setState(() => _submitting = false);
                                }
                              }
                            },
                      child: Text(
                        _submitting ? 'Submitting...' : 'Send Request',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
