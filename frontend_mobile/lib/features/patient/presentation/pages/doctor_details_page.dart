import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../shared/widgets/invalid_param_card.dart';

class DoctorDetailsPage extends StatefulWidget {
  const DoctorDetailsPage({required this.doctorId, super.key});

  final String? doctorId;

  @override
  State<DoctorDetailsPage> createState() => _DoctorDetailsPageState();
}

class _DoctorDetailsPageState extends State<DoctorDetailsPage> {
  Future<UserSummary?>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<UserSummary?> _load() async {
    final id = RouteParam.parse(widget.doctorId)?.value;
    if (id == null) return null;
    final doctors = await AppScope.of(context).doctorsRepository.listDoctors();
    for (final doctor in doctors) {
      if (doctor.id == id) return doctor;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserSummary?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final doctor = snapshot.data;
        if (doctor == null) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: const <Widget>[
              Text(
                'Doctor Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
              ),
              SizedBox(height: 8),
              Text('Doctor profile, availability, and clinic details.'),
              SizedBox(height: 16),
              InvalidParamCard(entityName: 'doctor'),
            ],
          );
        }

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'Doctor Details',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text('Doctor profile, availability, and clinic details.'),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      doctor.fullName?.trim().isNotEmpty == true
                          ? doctor.fullName!
                          : 'Doctor',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(doctor.email),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () =>
                          context.go(AppRoutes.bookingForDoctor(doctor.id)),
                      child: const Text('Book appointment'),
                    ),
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
