import 'package:flutter/material.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../shared/widgets/invalid_param_card.dart';

class ReportDetailsPage extends StatefulWidget {
  const ReportDetailsPage({required this.reportId, super.key});

  final String? reportId;

  @override
  State<ReportDetailsPage> createState() => _ReportDetailsPageState();
}

class _ReportDetailsPageState extends State<ReportDetailsPage> {
  Future<PatientReportRecord?>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<PatientReportRecord?> _load() async {
    final id = RouteParam.parse(widget.reportId)?.value;
    if (id == null) return null;
    final labs = await AppScope.of(context).labsRepository.listMyLabOrders();
    for (final lab in labs) {
      for (final report in lab.reports) {
        if (report.id == id) {
          return PatientReportRecord(report: report, labOrder: lab);
        }
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PatientReportRecord?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final record = snapshot.data;
        if (record == null) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: const <Widget>[
              Text(
                'Report Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
              ),
              SizedBox(height: 8),
              Text('Lab report summary and downloadable files.'),
              SizedBox(height: 16),
              InvalidParamCard(entityName: 'report'),
            ],
          );
        }

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'Report Details',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text('Lab report summary and downloadable files.'),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text('Report ID: ${record.report.id}'),
                    Text('Lab Order ID: ${record.labOrder.id}'),
                    Text(
                      'Diagnostic: ${record.labOrder.diagnosticSnapshot?.name ?? 'Not provided'}',
                    ),
                    const SizedBox(height: 12),
                    SelectableText('Report file: ${record.report.fileUrl}'),
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
