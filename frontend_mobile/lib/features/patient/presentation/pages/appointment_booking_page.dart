import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/api/user_facing_error.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../features/patient/data/repositories/patient_repositories.dart';
import '../../../../shared/widgets/invalid_param_card.dart';
import '../../../../shared/widgets/patient_ui.dart';

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
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: const <Widget>[
          Text(
            'Appointment Booking',
            style: TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: AppSpacing.sm),
          Text('Create a booking request with preferred schedule options.'),
          SizedBox(height: AppSpacing.lg),
          InvalidParamCard(entityName: 'doctor'),
        ],
      );
    }

    return ListView(
      key: const Key('booking_list'),
      padding: const EdgeInsets.all(AppSpacing.lg),
      children: <Widget>[
        PatientGradientHeader(
          title: 'Appointment Booking',
          subtitle: 'Create a booking request with preferred schedule options.',
          footer: PatientTopChip(text: 'Doctor ID: ${doctorParam.value}'),
        ),
        const SizedBox(height: AppSpacing.md),
        PatientSectionCard(
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const _FieldLabel('Preferred From (ISO, optional)'),
                TextFormField(
                  controller: _fromController,
                  decoration: const InputDecoration(
                    hintText: '2026-03-20T09:00:00',
                    prefixIcon: Icon(Icons.event_outlined),
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
                const SizedBox(height: AppSpacing.md),
                const _FieldLabel('Preferred To (ISO, optional)'),
                TextFormField(
                  controller: _toController,
                  decoration: const InputDecoration(
                    hintText: '2026-03-20T17:00:00',
                    prefixIcon: Icon(Icons.event_busy_outlined),
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
                const SizedBox(height: AppSpacing.md),
                const _FieldLabel('Preferred Time Note (optional)'),
                TextFormField(
                  controller: _timeNoteController,
                  decoration: const InputDecoration(
                    hintText: 'Morning / Evening / Any',
                    prefixIcon: Icon(Icons.access_time_rounded),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                const _FieldLabel('Reason'),
                TextFormField(
                  controller: _reasonController,
                  decoration: const InputDecoration(
                    hintText: 'Briefly describe your concern',
                    prefixIcon: Icon(Icons.notes_rounded),
                  ),
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
                const SizedBox(height: AppSpacing.lg),
                if (_status != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: PatientStatusBanner(
                      message: _status!,
                      isError: _status!.startsWith('Failed'),
                    ),
                  ),
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
                                  preferredTimeNote:
                                      _timeNoteController.text.trim(),
                                  reason: _reasonController.text.trim(),
                                ),
                              );
                              setState(
                                () =>
                                    _status =
                                        'Appointment requested: ${created.id}',
                              );
                              if (!mounted) {
                                return;
                              }
                              router.go(AppRoutes.appointments);
                            } catch (error) {
                              setState(
                                () => _status = userFacingErrorMessage(
                                  error,
                                  fallback:
                                      'Failed to create appointment. Please try again.',
                                ),
                              );
                            } finally {
                              if (mounted) {
                                setState(() => _submitting = false);
                              }
                            }
                          },
                    style: FilledButton.styleFrom(
                      minimumSize: const Size.fromHeight(52),
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(_submitting ? 'Submitting...' : 'Send Request'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Text(
        text,
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}
