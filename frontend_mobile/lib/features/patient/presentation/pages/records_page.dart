import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
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
    return _RecordsData(prescriptions: prescriptions, labs: labs);
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

  @override
  Widget build(BuildContext context) {
    final state = GoRouterState.of(context);
    final tab = _activeTab(state);

    return FutureBuilder<_RecordsData>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text('Failed to load records: ${snapshot.error}'),
          );
        }

        final data = snapshot.data!;
        final reports = data.reportRecords;

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text('Records', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Text('Prescriptions, lab orders, and reports by tab.'),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: <Widget>[
                ChoiceChip(
                  label: Text('Prescriptions (${data.prescriptions.length})'),
                  selected: tab == _RecordsTab.prescriptions,
                  onSelected: (_) => _setTab(_RecordsTab.prescriptions),
                ),
                ChoiceChip(
                  label: Text('Labs (${data.labs.length})'),
                  selected: tab == _RecordsTab.labs,
                  onSelected: (_) => _setTab(_RecordsTab.labs),
                ),
                ChoiceChip(
                  label: Text('Reports (${reports.length})'),
                  selected: tab == _RecordsTab.reports,
                  onSelected: (_) => _setTab(_RecordsTab.reports),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (tab == _RecordsTab.prescriptions)
              ...data.prescriptions.map(
                (rx) => Card(
                  child: ListTile(
                    title: Text('Prescription ${rx.id}'),
                    subtitle: Text(prescriptionStatusLabel(rx.status)),
                    trailing: IconButton(
                      icon: const Icon(Icons.open_in_new),
                      onPressed: () => context.go('/prescriptions/${rx.id}'),
                    ),
                  ),
                ),
              ),
            if (tab == _RecordsTab.prescriptions && data.prescriptions.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No prescriptions found.'),
                ),
              ),
            if (tab == _RecordsTab.labs)
              ...data.labs.map(
                (lab) => Card(
                  child: ListTile(
                    title: Text('Lab Order ${lab.id}'),
                    subtitle: Text(labOrderStatusLabel(lab.status)),
                    trailing: IconButton(
                      icon: const Icon(Icons.calendar_today_outlined),
                      onPressed: () =>
                          context.go('/appointments/${lab.appointmentId}'),
                    ),
                  ),
                ),
              ),
            if (tab == _RecordsTab.labs && data.labs.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No lab orders found.'),
                ),
              ),
            if (tab == _RecordsTab.reports)
              ...reports.map(
                (item) => Card(
                  child: ListTile(
                    title: Text('Report ${item.report.id}'),
                    subtitle: Text('Lab order ${item.labOrder.id}'),
                    trailing: IconButton(
                      icon: const Icon(Icons.open_in_new),
                      onPressed: () => context.go('/reports/${item.report.id}'),
                    ),
                  ),
                ),
              ),
            if (tab == _RecordsTab.reports && reports.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No reports uploaded yet.'),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _RecordsData {
  const _RecordsData({required this.prescriptions, required this.labs});

  final List<Prescription> prescriptions;
  final List<LabOrder> labs;

  List<PatientReportRecord> get reportRecords {
    final records = <PatientReportRecord>[];
    for (final lab in labs) {
      for (final report in lab.reports) {
        records.add(PatientReportRecord(report: report, labOrder: lab));
      }
    }
    return records;
  }
}
