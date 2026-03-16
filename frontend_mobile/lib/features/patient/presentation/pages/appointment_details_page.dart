import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
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
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              _CompactHeader(
                title: 'Appointment Details',
                backKey: const Key('appointment_details_back_button'),
                onBack: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go(AppRoutes.appointments);
                  }
                },
              ),
              const SizedBox(height: AppSpacing.md),
              const InvalidParamCard(entityName: 'appointment'),
            ],
          );
        }

        final appointment = data.appointment;
        final doctorName =
            appointment.doctorSnapshot?.fullName ??
            appointment.doctorSnapshot?.email ??
            'Doctor';
        final scheduled =
            appointment.preferredDateFrom ?? appointment.scheduledAt;
        final dateLabel = scheduled == null
            ? 'Date pending'
            : '${_month(scheduled.month)} ${scheduled.day}, ${scheduled.year}';
        final timeLabel =
            appointment.preferredTimeNote?.trim().isNotEmpty == true
            ? appointment.preferredTimeNote!.trim()
            : (appointment.scheduledAt == null
                  ? 'Time pending'
                  : _time(appointment.scheduledAt!));
        final reason = appointment.reason?.trim().isNotEmpty == true
            ? appointment.reason!.trim()
            : 'Consultation';

        return ListView(
          key: const Key('appointment_details_list'),
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: <Widget>[
            _CompactHeader(
              title: 'Appointment Details',
              backKey: const Key('appointment_details_back_button'),
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go(AppRoutes.appointments);
                }
              },
            ),
            const SizedBox(height: AppSpacing.md),
            _DoctorSummaryCard(
              doctorName: doctorName,
              statusLabel: appointmentStatusLabel(appointment.status),
              dateLabel: dateLabel,
              timeLabel: timeLabel,
              reason: reason,
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'Prescriptions (${data.prescriptions.length})',
              child: data.prescriptions.isEmpty
                  ? const _MutedText('No prescriptions for this appointment.')
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: data.prescriptions
                          .map(
                            (rx) => _LinkedRow(
                              text: rx.notes.isEmpty ? 'No notes' : rx.notes,
                              badge: prescriptionStatusLabel(rx.status),
                              onTap: () => context.push(
                                AppRoutes.prescriptionDetails(rx.id),
                              ),
                            ),
                          )
                          .toList(),
                    ),
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'Lab Orders (${data.labs.length})',
              child: data.labs.isEmpty
                  ? const _MutedText('No lab orders for this appointment.')
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: data.labs
                          .map(
                            (lab) => _LinkedRow(
                              text:
                                  lab.diagnosticSnapshot?.name ??
                                  'Diagnostic center',
                              badge: labOrderStatusLabel(lab.status),
                              onTap: () {
                                if (lab.reports.isNotEmpty) {
                                  context.push(
                                    AppRoutes.reportDetails(
                                      lab.reports.first.id,
                                    ),
                                  );
                                }
                              },
                            ),
                          )
                          .toList(),
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

class _LinkedRow extends StatelessWidget {
  const _LinkedRow({
    required this.text,
    required this.badge,
    required this.onTap,
  });

  final String text;
  final String badge;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadius.md,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              child: Text(
                text,
                style: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  color: AppColors.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.sm,
                vertical: AppSpacing.xs,
              ),
              decoration: BoxDecoration(
                color: AppColors.blueLight,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                badge,
                style: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  color: AppColors.primaryDark,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.xs),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppColors.textMuted,
              size: 18,
            ),
          ],
        ),
      ),
    );
  }
}

class _CompactHeader extends StatelessWidget {
  const _CompactHeader({
    required this.title,
    required this.onBack,
    required this.backKey,
  });

  final String title;
  final VoidCallback onBack;
  final Key backKey;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        IconButton(
          key: backKey,
          onPressed: onBack,
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          tooltip: 'Back',
        ),
        const SizedBox(width: AppSpacing.xs),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}

class _DoctorSummaryCard extends StatelessWidget {
  const _DoctorSummaryCard({
    required this.doctorName,
    required this.statusLabel,
    required this.dateLabel,
    required this.timeLabel,
    required this.reason,
  });

  final String doctorName;
  final String statusLabel;
  final String dateLabel;
  final String timeLabel;
  final String reason;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[AppColors.primary, AppColors.primaryDark],
        ),
        borderRadius: AppRadius.xl,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              const CircleAvatar(
                radius: 22,
                backgroundColor: Color(0x33FFFFFF),
                child: Icon(Icons.person, color: Colors.white),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  doctorName,
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xs,
                ),
                decoration: BoxDecoration(
                  color: const Color(0x1FFFFFFF),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(color: const Color(0x4DFFFFFF)),
                ),
                child: Text(
                  statusLabel,
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: <Widget>[
              const Icon(
                Icons.calendar_today_outlined,
                color: Colors.white,
                size: 16,
              ),
              const SizedBox(width: AppSpacing.xs),
              Expanded(
                child: Text(
                  dateLabel,
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const Icon(Icons.access_time_rounded, color: Colors.white, size: 16),
              const SizedBox(width: AppSpacing.xs),
              Text(
                timeLabel,
                style: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            reason,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              color: Color(0xE6FFFFFF),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.lg,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          child,
        ],
      ),
    );
  }
}

class _MutedText extends StatelessWidget {
  const _MutedText(this.value);

  final String value;

  @override
  Widget build(BuildContext context) {
    return Text(
      value,
      style: const TextStyle(
        fontFamily: AppTypography.figmaFamily,
        color: AppColors.textSecondary,
        fontSize: 13,
        fontWeight: FontWeight.w500,
      ),
    );
  }
}

String _month(int month) {
  const names = <String>[
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return names[(month - 1).clamp(0, 11)];
}

String _time(DateTime value) {
  final hour = value.hour % 12 == 0 ? 12 : value.hour % 12;
  final minute = value.minute.toString().padLeft(2, '0');
  final suffix = value.hour >= 12 ? 'PM' : 'AM';
  return '$hour:$minute $suffix';
}
