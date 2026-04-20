import 'package:flutter/material.dart';

import '../../core/theme/app_tokens.dart';

class InvalidParamCard extends StatelessWidget {
  const InvalidParamCard({required this.entityName, super.key});

  final String entityName;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Invalid $entityName',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'The selected $entityName is missing or invalid. Return and choose a valid item.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
