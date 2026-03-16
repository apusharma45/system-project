import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/api/user_facing_error.dart';
import '../../../../core/domain/enums.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/patient_ui.dart';
import '../../domain/status_label_mapper.dart';

class MyAppointmentsPage extends StatefulWidget {
  const MyAppointmentsPage({super.key});

  @override
  State<MyAppointmentsPage> createState() => _MyAppointmentsPageState();
}

class _MyAppointmentsPageState extends State<MyAppointmentsPage> {
  Future<List<Appointment>>? _future;
  String? _message;
  _AppointmentFilter _selectedFilter = _AppointmentFilter.upcoming;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<List<Appointment>> _load() {
    return AppScope.of(context).appointmentsRepository.listMyAppointments();
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
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
          return ListView(
            key: const Key('appointments_list'),
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              const _Header(totalCount: 0, pendingCount: 0),
              const SizedBox(height: AppSpacing.lg),
              const PatientSectionCard(
                child: Row(
                  children: <Widget>[
                    Icon(Icons.error_outline, color: AppColors.danger),
                    SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Text(
                        'Failed to load appointments. Pull to refresh and try again.',
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        }

        final appointments =
            List<Appointment>.from(snapshot.data ?? const <Appointment>[])
              ..sort((a, b) {
                final aDate =
                    a.preferredDateFrom ?? a.scheduledAt ?? DateTime(9999);
                final bDate =
                    b.preferredDateFrom ?? b.scheduledAt ?? DateTime(9999);
                return aDate.compareTo(bDate);
              });

        final pendingCount = appointments
            .where(
              (item) =>
                  item.status == AppointmentStatus.requested ||
                  item.status == AppointmentStatus.confirmed,
            )
            .length;
        final filteredAppointments = appointments
            .where((item) => _matchesFilter(item))
            .toList();

        final cards = <Widget>[
          _Header(totalCount: appointments.length, pendingCount: pendingCount),
          const SizedBox(height: AppSpacing.md),
          _FilterRow(
            selected: _selectedFilter,
            onChanged: (value) {
              setState(() {
                _selectedFilter = value;
              });
            },
          ),
          const SizedBox(height: AppSpacing.lg),
          if (_message != null)
            Container(
              margin: const EdgeInsets.only(bottom: AppSpacing.md),
              child: PatientStatusBanner(
                message: _message!,
                isError: _message!.startsWith('Cancel failed'),
              ),
            ),
          if (filteredAppointments.isEmpty)
            const _EmptyCard()
          else
            ...filteredAppointments.map((appointment) {
              final doctorName =
                  appointment.doctorSnapshot?.fullName ??
                  appointment.doctorSnapshot?.email ??
                  'Doctor';
              return _AppointmentCard(
                key: Key('appointment_card_${appointment.id}'),
                appointment: appointment,
                doctorName: doctorName,
                onOpen: () =>
                    context.push(AppRoutes.appointmentDetails(appointment.id)),
                onCancel: _canCancel(appointment)
                    ? () async {
                        try {
                          await AppScope.of(context).appointmentsRepository
                              .cancelAppointment(appointment.id);
                          setState(() {
                            _future = _load();
                            _message = 'Appointment cancelled.';
                          });
                        } catch (error) {
                          setState(
                            () => _message = userFacingErrorMessage(
                              error,
                              fallback:
                                  'Cancel failed. Please try again.',
                            ),
                          );
                        }
                      }
                    : null,
              );
            }),
        ];

        return RefreshIndicator(
          onRefresh: _refresh,
          child: ListView(
            key: const Key('appointments_list'),
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: cards,
          ),
        );
      },
    );
  }

  bool _matchesFilter(Appointment appointment) {
    final now = DateTime.now();
    final when =
        appointment.scheduledAt ??
        appointment.preferredDateFrom ??
        appointment.preferredDateTo;
    final isFutureOrNow = when == null || !when.isBefore(now);
    final isPast = when != null && when.isBefore(now);

    switch (_selectedFilter) {
      case _AppointmentFilter.upcoming:
        if (appointment.status == AppointmentStatus.cancelled) return false;
        if (appointment.status == AppointmentStatus.closed ||
            appointment.status == AppointmentStatus.examDone ||
            appointment.status == AppointmentStatus.inVisit) {
          return false;
        }
        return isFutureOrNow;
      case _AppointmentFilter.previous:
        if (appointment.status == AppointmentStatus.closed ||
            appointment.status == AppointmentStatus.examDone ||
            appointment.status == AppointmentStatus.inVisit) {
          return true;
        }
        return isPast && appointment.status != AppointmentStatus.cancelled;
      case _AppointmentFilter.cancelled:
        return appointment.status == AppointmentStatus.cancelled;
    }
  }
}

enum _AppointmentFilter { upcoming, previous, cancelled }

class _FilterRow extends StatelessWidget {
  const _FilterRow({required this.selected, required this.onChanged});

  final _AppointmentFilter selected;
  final ValueChanged<_AppointmentFilter> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('appointments_filter_chips'),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.lg,
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.all(AppSpacing.xs),
      child: Row(
        children: <Widget>[
          Expanded(
            child: _FilterChipButton(
              label: 'Upcoming',
              selected: selected == _AppointmentFilter.upcoming,
              onTap: () => onChanged(_AppointmentFilter.upcoming),
            ),
          ),
          const SizedBox(width: AppSpacing.xs),
          Expanded(
            child: _FilterChipButton(
              label: 'Previous',
              selected: selected == _AppointmentFilter.previous,
              onTap: () => onChanged(_AppointmentFilter.previous),
            ),
          ),
          const SizedBox(width: AppSpacing.xs),
          Expanded(
            child: _FilterChipButton(
              label: 'Cancelled',
              selected: selected == _AppointmentFilter.cancelled,
              onTap: () => onChanged(_AppointmentFilter.cancelled),
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChipButton extends StatelessWidget {
  const _FilterChipButton({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.primary : Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm,
            vertical: AppSpacing.sm,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: selected ? Colors.white : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.totalCount, required this.pendingCount});

  final int totalCount;
  final int pendingCount;

  @override
  Widget build(BuildContext context) {
    return PatientGradientHeader(
      key: const Key('appointments_header'),
      title: 'My Appointments',
      subtitle: 'Track requested, confirmed, and completed appointments.',
      footer: Wrap(
        spacing: AppSpacing.sm,
        runSpacing: AppSpacing.sm,
        children: <Widget>[
          PatientTopChip(text: 'Total: $totalCount'),
          PatientTopChip(text: 'Pending: $pendingCount'),
        ],
      ),
    );
  }
}

class _AppointmentCard extends StatelessWidget {
  const _AppointmentCard({
    required this.appointment,
    required this.doctorName,
    required this.onOpen,
    required this.onCancel,
    super.key,
  });

  final Appointment appointment;
  final String doctorName;
  final VoidCallback onOpen;
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    final scheduled = appointment.preferredDateFrom ?? appointment.scheduledAt;
    final dateLabel = scheduled == null
        ? 'Date pending'
        : '${_month(scheduled.month)} ${scheduled.day}, ${scheduled.year}';
    final timeLabel = appointment.preferredTimeNote?.trim().isNotEmpty == true
        ? appointment.preferredTimeNote!.trim()
        : (appointment.scheduledAt == null
              ? 'Time pending'
              : _time(appointment.scheduledAt!));
    final reason = appointment.reason?.trim().isNotEmpty == true
        ? appointment.reason!
        : 'General consultation';

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.lg,
        border: Border.all(color: AppColors.border),
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 14,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF3FF),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.medical_services,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      doctorName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: AppTypography.figmaFamily,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      reason,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: AppTypography.figmaFamily,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              _StatusPill(text: appointmentStatusLabel(appointment.status)),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: const Color(0xFFF7FAFF),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE3ECFA)),
            ),
            child: Row(
              children: <Widget>[
                const Icon(
                  Icons.calendar_today_outlined,
                  size: 16,
                  color: AppColors.textSecondary,
                ),
                const SizedBox(width: AppSpacing.xs),
                Expanded(
                  child: Text(
                    dateLabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      fontSize: 12,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                const Icon(
                  Icons.access_time_rounded,
                  size: 16,
                  color: AppColors.textSecondary,
                ),
                const SizedBox(width: AppSpacing.xs),
                Expanded(
                  child: Text(
                    timeLabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      fontSize: 12,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: <Widget>[
              OutlinedButton.icon(
                key: Key('appointment_details_btn_${appointment.id}'),
                onPressed: onOpen,
                icon: const Icon(Icons.open_in_new_rounded, size: 18),
                label: const Text('View Details'),
              ),
              if (onCancel != null) ...<Widget>[
                const Spacer(),
                FilledButton.tonalIcon(
                  key: Key('appointment_cancel_btn_${appointment.id}'),
                  onPressed: onCancel,
                  icon: const Icon(Icons.cancel_outlined, size: 18),
                  label: const Text('Cancel'),
                  style: FilledButton.styleFrom(
                    foregroundColor: const Color(0xFFB71C1C),
                    backgroundColor: const Color(0xFFFFEBEE),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: AppColors.blueLight,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: AppColors.primaryDark,
        ),
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard();

  @override
  Widget build(BuildContext context) {
    return const PatientSectionCard(
      child: Column(
        children: <Widget>[
          Icon(Icons.event_busy_outlined, size: 30, color: AppColors.textMuted),
          SizedBox(height: AppSpacing.sm),
          Text(
            'No appointments yet.',
            style: TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: AppSpacing.xs),
          Text(
            'Your requested and confirmed appointments will appear here.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
        ],
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
