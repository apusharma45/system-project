import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/api/user_facing_error.dart';
import '../../../../core/domain/enums.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../domain/status_label_mapper.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Future<_HomeData>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<_HomeData> _load() async {
    final deps = AppScope.of(context);
    final appointments = await deps.appointmentsRepository.listMyAppointments();
    final prescriptions = await deps.prescriptionsRepository
        .listMyPrescriptions();
    final labs = await deps.labsRepository.listMyLabOrders();
    final doctors = await deps.doctorsRepository.listDoctors();
    return _HomeData(
      appointments: appointments,
      prescriptions: prescriptions,
      labs: labs,
      doctors: doctors,
    );
  }

  @override
  Widget build(BuildContext context) {
    final deps = AppScope.of(context);
    return FutureBuilder<_HomeData>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text(
              userFacingErrorMessage(
                snapshot.error,
                fallback: 'Unable to load dashboard right now.',
              ),
            ),
          );
        }

        final data = snapshot.data!;
        final now = DateTime.now();
        final sortedAppointments = List<Appointment>.from(data.appointments)
          ..sort((a, b) {
            final ad = a.preferredDateFrom ?? a.scheduledAt ?? DateTime(9999);
            final bd = b.preferredDateFrom ?? b.scheduledAt ?? DateTime(9999);
            return ad.compareTo(bd);
          });
        final upcoming = sortedAppointments.where((a) {
          final isActive =
              a.status == AppointmentStatus.requested ||
              a.status == AppointmentStatus.confirmed;
          final when = a.preferredDateFrom ?? a.scheduledAt;
          if (when == null) return isActive;
          return isActive &&
              !when.isBefore(DateTime(now.year, now.month, now.day));
        }).toList();

        final upcomingAppointment = upcoming.isNotEmpty ? upcoming.first : null;
        final recentPrescription = data.prescriptions.isNotEmpty
            ? data.prescriptions.first
            : null;

        PatientReportRecord? latestReport;
        for (final lab in data.labs) {
          for (final report in lab.reports) {
            latestReport ??= PatientReportRecord(report: report, labOrder: lab);
          }
        }

        final user = deps.session.user;
        final userName = (user?.fullName?.trim().isNotEmpty ?? false)
            ? user!.fullName!.trim()
            : 'Patient';

        return ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            _Header(
              userName: userName,
              avatarUrl: user?.avatarUrl,
              unreadCount: deps.notificationsCenterController.unreadCount,
              onBook: () => context.go(AppRoutes.doctors),
              onFindDoctor: () => context.go(AppRoutes.doctors),
              onAppointments: () => context.go(AppRoutes.appointments),
              onRecords: () => context.go(AppRoutes.records),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _SectionHeader(
                    title: 'Upcoming Appointment',
                    actionLabel: 'View All',
                    onAction: () => context.go(AppRoutes.appointments),
                  ),
                  if (upcomingAppointment == null)
                    const _EmptyCard(text: 'No upcoming appointments.')
                  else
                    _UpcomingAppointmentCard(
                      appointment: upcomingAppointment,
                      doctorName: _doctorNameForAppointment(
                        upcomingAppointment,
                        data.doctors,
                      ),
                      onTap: () => context.push(
                        AppRoutes.appointmentDetails(upcomingAppointment.id),
                      ),
                    ),
                  const SizedBox(height: 20),
                  _SectionHeader(
                    title: 'Recent Prescription',
                    actionLabel: 'View All',
                    onAction: () => context.go(AppRoutes.records),
                  ),
                  if (recentPrescription == null)
                    const _EmptyCard(text: 'No prescriptions found.')
                  else
                    _PrescriptionCard(
                      prescription: recentPrescription,
                      doctorName: _doctorNameForPrescription(
                        recentPrescription,
                        data.doctors,
                      ),
                      onTap: () => context.push(
                        AppRoutes.prescriptionDetails(recentPrescription.id),
                      ),
                    ),
                  const SizedBox(height: 20),
                  _SectionHeader(
                    title: 'Latest Diagnostic Report',
                    actionLabel: 'View All',
                    onAction: () => context.go(AppRoutes.records),
                  ),
                  if (latestReport == null)
                    const _EmptyCard(text: 'No diagnostic reports available.')
                  else ...<Widget>[
                    Builder(
                      builder: (context) {
                        final report = latestReport;
                        return _ReportCard(
                          latestReport: report!,
                          onTap: () => context.push(
                            AppRoutes.reportDetails(report.report.id),
                          ),
                        );
                      },
                    ),
                  ],
                  const SizedBox(height: 20),
                  const _SectionHeader(title: 'Medicine Reminders'),
                  const _ReminderCard(),
                  const SizedBox(height: 20),
                  const _SectionHeader(title: 'Coming Soon'),
                  const _ComingSoonCard(),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  String _doctorNameForAppointment(
    Appointment appointment,
    List<UserSummary> doctors,
  ) {
    final snap = appointment.doctorSnapshot?.fullName;
    if (snap != null && snap.trim().isNotEmpty) return snap.trim();
    for (final doctor in doctors) {
      if (doctor.id == appointment.doctorId) {
        return doctor.fullName ?? 'Doctor';
      }
    }
    return 'Doctor';
  }

  String _doctorNameForPrescription(
    Prescription prescription,
    List<UserSummary> doctors,
  ) {
    for (final doctor in doctors) {
      if (doctor.id == prescription.doctorId) {
        return doctor.fullName ?? 'Doctor';
      }
    }
    return 'Doctor';
  }
}

class _HomeData {
  const _HomeData({
    required this.appointments,
    required this.prescriptions,
    required this.labs,
    required this.doctors,
  });

  final List<Appointment> appointments;
  final List<Prescription> prescriptions;
  final List<LabOrder> labs;
  final List<UserSummary> doctors;
}

class _Header extends StatelessWidget {
  const _Header({
    required this.userName,
    required this.avatarUrl,
    required this.unreadCount,
    required this.onBook,
    required this.onFindDoctor,
    required this.onAppointments,
    required this.onRecords,
  });

  final String userName;
  final String? avatarUrl;
  final int unreadCount;
  final VoidCallback onBook;
  final VoidCallback onFindDoctor;
  final VoidCallback onAppointments;
  final VoidCallback onRecords;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[AppColors.primary, AppColors.primaryDark],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
      child: Column(
        children: <Widget>[
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              _Avatar(avatarUrl: avatarUrl),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Welcome back,',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.white.withValues(alpha: 0.85),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      userName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                key: const Key('home-notification-icon'),
                onPressed: () => context.push(AppRoutes.notifications),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.white.withValues(alpha: 0.14),
                  foregroundColor: Colors.white,
                ),
                icon: Stack(
                  clipBehavior: Clip.none,
                  children: <Widget>[
                    const Icon(Icons.notifications_none_rounded),
                    if (unreadCount > 0)
                      Positioned(
                        right: -2,
                        top: -2,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(99),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _QuickActions(
            onBook: onBook,
            onFindDoctor: onFindDoctor,
            onAppointments: onAppointments,
            onRecords: onRecords,
          ),
        ],
      ),
    );
  }
}

class _Avatar extends StatelessWidget {
  const _Avatar({required this.avatarUrl});

  final String? avatarUrl;

  @override
  Widget build(BuildContext context) {
    final hasNetwork = avatarUrl != null && avatarUrl!.trim().isNotEmpty;
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: hasNetwork
            ? Image.network(
                avatarUrl!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _fallbackAvatar(),
              )
            : _fallbackAvatar(),
      ),
    );
  }

  Widget _fallbackAvatar() {
    return Container(
      color: Colors.white.withValues(alpha: 0.15),
      alignment: Alignment.center,
      child: const Icon(Icons.person, color: Colors.white),
    );
  }
}

class _QuickActions extends StatelessWidget {
  const _QuickActions({
    required this.onBook,
    required this.onFindDoctor,
    required this.onAppointments,
    required this.onRecords,
  });

  final VoidCallback onBook;
  final VoidCallback onFindDoctor;
  final VoidCallback onAppointments;
  final VoidCallback onRecords;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final narrow = width < 370;
    final iconSize = narrow ? 20.0 : 22.0;
    final circleSize = narrow ? 40.0 : 42.0;
    final verticalPadding = narrow ? 8.0 : 10.0;
    final labelFontSize = narrow ? 10.0 : 11.0;
    final aspectRatio = narrow ? 0.74 : 0.82;

    final actions = <_ActionItem>[
      _ActionItem(
        label: 'Book Appointment',
        icon: Icons.calendar_month_rounded,
        color: AppColors.primary,
        onTap: onBook,
      ),
      _ActionItem(
        label: 'Find Doctor',
        icon: Icons.search_rounded,
        color: AppColors.green,
        onTap: onFindDoctor,
      ),
      _ActionItem(
        label: 'My Appointments',
        icon: Icons.event_note_rounded,
        color: AppColors.amber,
        onTap: onAppointments,
      ),
      _ActionItem(
        label: 'Reports & Rx',
        icon: Icons.description_rounded,
        color: AppColors.danger,
        onTap: onRecords,
      ),
    ];

    return Container(
      key: const Key('home-quick-actions'),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: actions.length,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 10,
          mainAxisSpacing: 0,
          childAspectRatio: aspectRatio,
        ),
        itemBuilder: (context, index) {
          final item = actions[index];
          return InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: item.onTap,
            child: Ink(
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.16),
                borderRadius: BorderRadius.circular(16),
              ),
              padding: EdgeInsets.symmetric(
                horizontal: 6,
                vertical: verticalPadding,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Container(
                    width: circleSize,
                    height: circleSize,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.93),
                      borderRadius: BorderRadius.circular(circleSize / 2),
                    ),
                    child: Icon(item.icon, color: item.color, size: iconSize),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.label,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Colors.white,
                      fontSize: labelFontSize,
                      height: 1.2,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ActionItem {
  const _ActionItem({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, this.actionLabel, this.onAction});

  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: <Widget>[
          Expanded(
            child: Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          if (actionLabel != null && onAction != null)
            TextButton.icon(
              onPressed: onAction,
              iconAlignment: IconAlignment.end,
              icon: const Icon(Icons.chevron_right_rounded, size: 18),
              label: Text(actionLabel!),
            ),
        ],
      ),
    );
  }
}

class _UpcomingAppointmentCard extends StatelessWidget {
  const _UpcomingAppointmentCard({
    required this.appointment,
    required this.doctorName,
    required this.onTap,
  });

  final Appointment appointment;
  final String doctorName;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final date = appointment.preferredDateFrom ?? appointment.scheduledAt;
    final dateText = date == null
        ? 'Date not set'
        : '${_month(date.month)} ${date.day}, ${date.year}';
    final timeText = appointment.preferredTimeNote?.trim().isNotEmpty == true
        ? appointment.preferredTimeNote!.trim()
        : (appointment.scheduledAt != null
              ? _time(appointment.scheduledAt!)
              : 'Time not set');
    return _HomeCard(
      onTap: onTap,
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.blueLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.person, color: AppColors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      doctorName,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      appointment.reason?.trim().isNotEmpty == true
                          ? appointment.reason!
                          : 'Consultation',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    _StatusPill(
                      label: appointmentStatusLabel(appointment.status),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(height: 1, color: AppColors.dividerLight),
          const SizedBox(height: 10),
          Row(
            children: <Widget>[
              const Icon(
                Icons.calendar_today_outlined,
                size: 16,
                color: AppColors.textSecondary,
              ),
              const SizedBox(width: 6),
              Text(
                dateText,
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(width: 14),
              const Icon(
                Icons.access_time_rounded,
                size: 16,
                color: AppColors.textSecondary,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  timeText,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PrescriptionCard extends StatelessWidget {
  const _PrescriptionCard({
    required this.prescription,
    required this.doctorName,
    required this.onTap,
  });

  final Prescription prescription;
  final String doctorName;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.greenLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.medication_rounded, color: AppColors.green),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        doctorName,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    _StatusPill(
                      label: prescriptionStatusLabel(prescription.status),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  prescription.notes.trim().isEmpty
                      ? 'No notes available'
                      : prescription.notes.trim(),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  const _ReportCard({required this.latestReport, required this.onTap});

  final PatientReportRecord latestReport;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.amberLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.monitor_heart_rounded,
              color: AppColors.amber,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Lab Report',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  latestReport.labOrder.diagnosticSnapshot?.name ??
                      'Diagnostic Center',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'Report ID: ${latestReport.report.id}',
                  style: Theme.of(
                    context,
                  ).textTheme.labelSmall?.copyWith(color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ReminderCard extends StatelessWidget {
  const _ReminderCard();

  @override
  Widget build(BuildContext context) {
    return const _HomeCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          _TintIcon(
            icon: Icons.schedule_rounded,
            bg: AppColors.blueLight,
            color: AppColors.primary,
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text('Atorvastatin 20mg'),
                SizedBox(height: 2),
                Text('1 tablet - Take at bedtime'),
                SizedBox(height: 10),
                Text('Next dose: Today, 9:00 PM'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ComingSoonCard extends StatelessWidget {
  const _ComingSoonCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: <Color>[AppColors.blueLight, AppColors.greenLight],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFB3E5FC)),
      ),
      padding: const EdgeInsets.all(16),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          _TintIcon(
            icon: Icons.auto_awesome_rounded,
            bg: Colors.white70,
            color: AppColors.primary,
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text('Ask Doctor Feature'),
                SizedBox(height: 2),
                Text('Get quick medical advice from our doctors via chat'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TintIcon extends StatelessWidget {
  const _TintIcon({required this.icon, required this.bg, required this.color});

  final IconData icon;
  final Color bg;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: color),
    );
  }
}

class _HomeCard extends StatelessWidget {
  const _HomeCard({required this.child, this.onTap});

  final Widget child;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          padding: const EdgeInsets.all(14),
          child: child,
        ),
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return _HomeCard(
      child: Text(
        text,
        style: Theme.of(
          context,
        ).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.blueLight,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          color: AppColors.primary,
          fontWeight: FontWeight.w700,
        ),
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
