import 'package:flutter/material.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../shared/widgets/invalid_param_card.dart';
import '../../domain/status_label_mapper.dart';

class PrescriptionDetailsPage extends StatefulWidget {
  const PrescriptionDetailsPage({required this.prescriptionId, super.key});

  final String? prescriptionId;

  @override
  State<PrescriptionDetailsPage> createState() =>
      _PrescriptionDetailsPageState();
}

class _PrescriptionDetailsPageState extends State<PrescriptionDetailsPage> {
  Future<Prescription?>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<Prescription?> _load() async {
    final id = RouteParam.parse(widget.prescriptionId)?.value;
    if (id == null) return null;
    final repo = AppScope.of(context).prescriptionsRepository;
    final direct = await repo.getPrescriptionById(id);
    if (direct != null && direct.id.isNotEmpty) return direct;
    final list = await repo.listMyPrescriptions();
    for (final item in list) {
      if (item.id == id) return item;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Prescription?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final item = snapshot.data;
        if (item == null) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: const <Widget>[
              Text(
                'Prescription Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
              ),
              SizedBox(height: 8),
              Text('Medication details, advice, and pharmacy information.'),
              SizedBox(height: 16),
              InvalidParamCard(entityName: 'prescription'),
            ],
          );
        }

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'Prescription Details',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text('Medication details, advice, and pharmacy information.'),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text('ID: ${item.id}'),
                    Text('Status: ${prescriptionStatusLabel(item.status)}'),
                    Text(
                      'Notes: ${item.notes.isEmpty ? 'Not provided' : item.notes}',
                    ),
                    Text('Diagnosis: ${item.diagnosis ?? 'Not provided'}'),
                    Text(
                      'Instructions: ${item.instructions ?? 'Not provided'}',
                    ),
                    Text(
                      'Pharmacy: ${item.pharmacySnapshot?.name ?? 'Not assigned'}',
                    ),
                    Text(
                      'Phone: ${item.pharmacySnapshot?.phone ?? 'Not provided'}',
                    ),
                    const SizedBox(height: 12),
                    if (item.documentUrl != null &&
                        item.documentUrl!.isNotEmpty)
                      SelectableText('Document: ${item.documentUrl}')
                    else
                      const Text('No document attached.'),
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
