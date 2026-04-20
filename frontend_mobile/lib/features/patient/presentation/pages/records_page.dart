import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../core/domain/models.dart';
import '../../domain/status_label_mapper.dart';

class RecordsPage extends StatefulWidget {
  const RecordsPage({super.key});

  @override
  State<RecordsPage> createState() => _RecordsPageState();
}

enum _RecordsTab { prescriptions, labs, reports }

class _RecordsPageState extends State<RecordsPage> {
  Future<_RecordsData>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<_RecordsData> _load() async {
    final deps = AppScope.of(context);
    final prescriptions = await deps.prescriptionsRepository
        .listMyPrescriptions();
    final labs = await deps.labsRepository.listMyLabOrders();
    final appointments = await deps.appointmentsRepository.listMyAppointments();
    return _RecordsData(
      prescriptions: prescriptions,
      labs: labs,
      appointments: appointments,
    );
  }

  _RecordsTab _activeTab(GoRouterState state) {
    final raw = state.uri.queryParameters['tab'];
    if (raw == 'labs') return _RecordsTab.labs;
    if (raw == 'reports') return _RecordsTab.reports;
    return _RecordsTab.prescriptions;
  }

  void _setTab(_RecordsTab tab) {
    final q = switch (tab) {
      _RecordsTab.prescriptions => 'prescriptions',
      _RecordsTab.labs => 'labs',
      _RecordsTab.reports => 'reports',
    };
    context.go('/records?tab=$q');
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final state = GoRouterState.of(context);
    final tab = _activeTab(state);

    return FutureBuilder<_RecordsData>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(
            child: CircularProgressIndicator(key: Key('records_loading')),
          );
        }
        if (snapshot.hasError) {
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              _RecordsHeader(
                tab: tab,
                onTabChanged: _setTab,
                onBack: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/');
                  }
                },
              ),
              const SizedBox(height: AppSpacing.lg),
              Container(
                key: const Key('records_error'),
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: AppRadius.lg,
                  border: Border.all(color: AppColors.redLight),
                ),
                child: Text(
                  'Failed to load records. Pull to refresh and try again.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            ],
          );
        }

        final data = snapshot.data!;
        final reports = data.sortedReports;

        final children = <Widget>[
          _RecordsHeader(
            tab: tab,
            onTabChanged: _setTab,
            onBack: () {
              if (context.canPop()) {
                context.pop();
              } else {
                context.go('/');
              }
            },
          ),
          const SizedBox(height: AppSpacing.lg),
          if (tab == _RecordsTab.prescriptions)
            ...data.sortedPrescriptions.map(
              (rx) => _RecordsCard(
                key: Key('records_prescription_${rx.id}'),
                icon: Icons.receipt_long_outlined,
                iconBackground: AppColors.blueLight,
                iconColor: AppColors.primaryDark,
                title: 'Prescription',
                details: <_RecordDetail>[
                  _RecordDetail(
                    icon: Icons.person_outline_rounded,
                    value: data.doctorForPrescription(rx),
                  ),
                  _RecordDetail(
                    icon: Icons.medication_liquid_outlined,
                    value: rx.medications.isEmpty
                        ? 'Medicines not listed'
                        : '${rx.medications.length} medicine${rx.medications.length > 1 ? 's' : ''}',
                  ),
                  _RecordDetail(
                    icon: Icons.location_on_outlined,
                    value: rx.pharmacySnapshot?.name ?? 'Pharmacy not assigned',
                  ),
                  _RecordDetail(
                    icon: Icons.phone_outlined,
                    value: rx.pharmacySnapshot?.phone ?? 'Phone not provided',
                  ),
                ],
                badgeText: prescriptionStatusLabel(rx.status),
                onTap: () => context.push('/prescriptions/${rx.id}'),
              ),
            ),
          if (tab == _RecordsTab.labs)
            ...data.sortedLabs.map(
              (lab) => _RecordsCard(
                key: Key('records_lab_${lab.id}'),
                icon: Icons.biotech_outlined,
                iconBackground: const Color(0xFFE9F7EF),
                iconColor: const Color(0xFF2E7D32),
                title: 'Lab Tests Requested',
                details: <_RecordDetail>[
                  _RecordDetail(
                    icon: Icons.location_on_outlined,
                    value: lab.diagnosticSnapshot?.name ?? 'Center not assigned',
                  ),
                  _RecordDetail(
                    icon: Icons.phone_outlined,
                    value: lab.diagnosticSnapshot?.phone ?? 'Phone not provided',
                  ),
                  _RecordDetail(
                    icon: Icons.map_outlined,
                    value:
                        lab.diagnosticSnapshot?.address ?? 'Address not provided',
                  ),
                  _RecordDetail(
                    icon: Icons.science_outlined,
                    value: lab.tests.isNotEmpty
                        ? lab.tests.join(', ')
                        : 'Tests not listed',
                  ),
                ],
                badgeText: labOrderStatusLabel(lab.status),
                onTap: lab.reports.isNotEmpty
                    ? () => context.push('/reports/${lab.reports.first.id}')
                    : null,
              ),
            ),
          if (tab == _RecordsTab.reports)
            ...reports.map(
              (record) => _RecordsCard(
                key: Key('records_report_${record.report.id}'),
                icon: Icons.description_outlined,
                iconBackground: const Color(0xFFFFF3E0),
                iconColor: AppColors.amber,
                title: 'Diagnostic Report',
                details: <_RecordDetail>[
                  _RecordDetail(
                    icon: Icons.location_on_outlined,
                    value:
                        record.labOrder.diagnosticSnapshot?.name ??
                        'Center not assigned',
                  ),
                  _RecordDetail(
                    icon: Icons.phone_outlined,
                    value:
                        record.labOrder.diagnosticSnapshot?.phone ??
                        'Phone not provided',
                  ),
                  const _RecordDetail(
                    icon: Icons.download_outlined,
                    value: 'File available',
                  ),
                ],
                badgeText: 'Ready',
                onTap: () => context.push('/reports/${record.report.id}'),
              ),
            ),
          if (tab == _RecordsTab.prescriptions &&
              data.sortedPrescriptions.isEmpty)
            const _EmptyRecordsCard(
              message: 'No prescriptions found yet.',
              icon: Icons.receipt_long_outlined,
            ),
          if (tab == _RecordsTab.labs && data.sortedLabs.isEmpty)
            const _EmptyRecordsCard(
              message: 'No lab orders found yet.',
              icon: Icons.biotech_outlined,
            ),
          if (tab == _RecordsTab.reports && reports.isEmpty)
            const _EmptyRecordsCard(
              message: 'No reports uploaded yet.',
              icon: Icons.description_outlined,
            ),
        ];

        return RefreshIndicator(
          onRefresh: _refresh,
          child: ListView(
            key: const Key('records_list'),
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: children,
          ),
        );
      },
    );
  }
}

class _RecordsData {
  const _RecordsData({
    required this.prescriptions,
    required this.labs,
    required this.appointments,
  });

  final List<Prescription> prescriptions;
  final List<LabOrder> labs;
  final List<Appointment> appointments;

  List<Prescription> get sortedPrescriptions {
    final copy = List<Prescription>.from(prescriptions);
    copy.sort((a, b) => b.id.compareTo(a.id));
    return copy;
  }

  List<LabOrder> get sortedLabs {
    final copy = List<LabOrder>.from(labs);
    copy.sort((a, b) => b.id.compareTo(a.id));
    return copy;
  }

  List<PatientReportRecord> get sortedReports {
    final records = <PatientReportRecord>[];
    for (final lab in sortedLabs) {
      for (final report in lab.reports) {
        records.add(PatientReportRecord(report: report, labOrder: lab));
      }
    }
    records.sort((a, b) => b.report.id.compareTo(a.report.id));
    return records;
  }

  String doctorForPrescription(Prescription rx) {
    for (final appointment in appointments) {
      if (appointment.id == rx.appointmentId) {
        final fullName = appointment.doctorSnapshot?.fullName?.trim();
        if (fullName != null && fullName.isNotEmpty) {
          return 'Doctor: $fullName';
        }
        final email = appointment.doctorSnapshot?.email?.trim();
        if (email != null && email.isNotEmpty) {
          return 'Doctor: $email';
        }
      }
    }
    return 'Doctor not available';
  }
}

class _RecordsHeader extends StatelessWidget {
  const _RecordsHeader({
    required this.tab,
    required this.onTabChanged,
    required this.onBack,
  });

  final _RecordsTab tab;
  final ValueChanged<_RecordsTab> onTabChanged;
  final VoidCallback onBack;

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
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x221565C0),
            blurRadius: 22,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              IconButton(
                key: const Key('records_back_button'),
                onPressed: onBack,
                icon: const Icon(
                  Icons.arrow_back_ios_new_rounded,
                  color: Colors.white,
                ),
                tooltip: 'Back',
              ),
              const SizedBox(width: AppSpacing.xs),
              const Expanded(
                child: Text(
                  'Medical Records',
                  style: TextStyle(
                    color: Colors.white,
                    fontFamily: AppTypography.figmaFamily,
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          const Text(
            'Prescriptions, diagnostics, and reports in one place.',
            style: TextStyle(
              color: Color(0xE6FFFFFF),
              fontFamily: AppTypography.figmaFamily,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: <Widget>[
              _TabPill(
                label: 'Prescriptions',
                selected: tab == _RecordsTab.prescriptions,
                onTap: () => onTabChanged(_RecordsTab.prescriptions),
              ),
              _TabPill(
                label: 'Lab Orders',
                selected: tab == _RecordsTab.labs,
                onTap: () => onTabChanged(_RecordsTab.labs),
              ),
              _TabPill(
                label: 'Reports',
                selected: tab == _RecordsTab.reports,
                onTap: () => onTabChanged(_RecordsTab.reports),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _TabPill extends StatelessWidget {
  const _TabPill({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: selected ? Colors.white : const Color(0x1FFFFFFF),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: selected ? Colors.white : const Color(0x4DFFFFFF),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? AppColors.primaryDark : Colors.white,
            fontFamily: AppTypography.figmaFamily,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _RecordsCard extends StatelessWidget {
  const _RecordsCard({
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.title,
    required this.details,
    required this.badgeText,
    required this.onTap,
    super.key,
  });

  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final String title;
  final List<_RecordDetail> details;
  final String badgeText;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Material(
        color: Colors.white,
        borderRadius: AppRadius.lg,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadius.lg,
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              borderRadius: AppRadius.lg,
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: <Widget>[
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: iconBackground,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: iconColor),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        title,
                        style: const TextStyle(
                          fontFamily: AppTypography.figmaFamily,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      ...details.map(
                        (detail) => Padding(
                          padding: const EdgeInsets.only(bottom: 2),
                          child: Row(
                            children: <Widget>[
                              Icon(
                                detail.icon,
                                size: 14,
                                color: AppColors.textSecondary,
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  detail.value,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontFamily: AppTypography.figmaFamily,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
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
                        badgeText,
                        style: const TextStyle(
                          fontFamily: AppTypography.figmaFamily,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ),
                    if (onTap == null) ...<Widget>[
                      const SizedBox(height: AppSpacing.xs),
                      const Text(
                        'No report yet',
                        style: TextStyle(
                          fontFamily: AppTypography.figmaFamily,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RecordDetail {
  const _RecordDetail({required this.icon, required this.value});

  final IconData icon;
  final String value;
}

class _EmptyRecordsCard extends StatelessWidget {
  const _EmptyRecordsCard({required this.message, required this.icon});

  final String message;
  final IconData icon;

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
        children: <Widget>[
          Icon(icon, color: AppColors.textMuted),
          const SizedBox(height: AppSpacing.sm),
          Text(
            message,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
