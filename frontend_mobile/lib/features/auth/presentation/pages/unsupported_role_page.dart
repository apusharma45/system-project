import 'package:flutter/material.dart';

import '../../../../app/app_scope.dart';

class UnsupportedRolePage extends StatelessWidget {
  const UnsupportedRolePage({super.key});

  @override
  Widget build(BuildContext context) {
    final session = AppScope.of(context).session;
    final role = session.user?.role.name.toUpperCase() ?? 'UNKNOWN';
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: Card(
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Unsupported role',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This mobile app currently supports PATIENT accounts only. Current role: $role',
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () => session.logout(),
                      child: const Text('Sign out'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
