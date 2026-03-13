import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/domain/models.dart';

class DoctorListPage extends StatefulWidget {
  const DoctorListPage({super.key});

  @override
  State<DoctorListPage> createState() => _DoctorListPageState();
}

class _DoctorListPageState extends State<DoctorListPage> {
  Future<List<UserSummary>>? _future;
  String _query = '';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= AppScope.of(context).doctorsRepository.listDoctors();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<UserSummary>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text('Failed to load doctors: ${snapshot.error}'),
          );
        }
        final doctors = snapshot.data ?? const <UserSummary>[];
        final filtered = doctors.where((d) {
          final q = _query.trim().toLowerCase();
          if (q.isEmpty) return true;
          return (d.fullName ?? '').toLowerCase().contains(q) ||
              d.email.toLowerCase().contains(q);
        }).toList();

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text('Doctors', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Text(
              'Search and browse available doctors by specialization.',
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (value) => setState(() => _query = value),
              decoration: const InputDecoration(
                labelText: 'Search doctor',
                hintText: 'Name or email',
                prefixIcon: Icon(Icons.search),
              ),
            ),
            const SizedBox(height: 12),
            ...filtered.map(
              (doctor) => Card(
                child: ListTile(
                  title: Text(
                    doctor.fullName?.trim().isNotEmpty == true
                        ? doctor.fullName!
                        : doctor.email,
                  ),
                  subtitle: Text(doctor.email),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      IconButton(
                        onPressed: () =>
                            context.go(AppRoutes.doctorDetails(doctor.id)),
                        icon: const Icon(Icons.info_outline),
                      ),
                      IconButton(
                        onPressed: () =>
                            context.go(AppRoutes.bookingForDoctor(doctor.id)),
                        icon: const Icon(Icons.event_available_outlined),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if (filtered.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No doctors found.'),
                ),
              ),
          ],
        );
      },
    );
  }
}
