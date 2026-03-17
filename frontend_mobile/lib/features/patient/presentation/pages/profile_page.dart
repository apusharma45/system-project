import 'package:flutter/material.dart';

import '../../../../app/app_scope.dart';
import '../../../../core/domain/models.dart';
import '../../data/repositories/patient_repositories.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _fullName = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _allergies = TextEditingController();
  final _chronic = TextEditingController();
  final _medications = TextEditingController();
  final _ecName = TextEditingController();
  final _ecPhone = TextEditingController();
  final _ecRelation = TextEditingController();

  Future<PatientProfile>? _future;
  bool _saving = false;
  String? _status;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  @override
  void dispose() {
    _fullName.dispose();
    _phone.dispose();
    _address.dispose();
    _allergies.dispose();
    _chronic.dispose();
    _medications.dispose();
    _ecName.dispose();
    _ecPhone.dispose();
    _ecRelation.dispose();
    super.dispose();
  }

  Future<PatientProfile> _load() async {
    final profile = await AppScope.of(
      context,
    ).patientProfileRepository.getMyProfile();
    _fullName.text = profile.fullName ?? '';
    _phone.text = profile.phone ?? '';
    _address.text = profile.address ?? '';
    _allergies.text = profile.allergies ?? '';
    _chronic.text = profile.chronicConditions ?? '';
    _medications.text = profile.currentMedications ?? '';
    _ecName.text = profile.emergencyContactName ?? '';
    _ecPhone.text = profile.emergencyContactPhone ?? '';
    _ecRelation.text = profile.emergencyContactRelation ?? '';
    return profile;
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _saving = true;
      _status = null;
    });
    try {
      final updated = await AppScope.of(context).patientProfileRepository
          .updateMyProfile(
            UpdatePatientProfileRequest(
              fullName: _fullName.text.trim(),
              phone: _phone.text.trim(),
              address: _address.text.trim(),
              allergies: _allergies.text.trim(),
              chronicConditions: _chronic.text.trim(),
              currentMedications: _medications.text.trim(),
              emergencyContactName: _ecName.text.trim(),
              emergencyContactPhone: _ecPhone.text.trim(),
              emergencyContactRelation: _ecRelation.text.trim(),
            ),
          );
      setState(() {
        _future = Future.value(updated);
        _status = 'Profile updated successfully.';
      });
    } catch (error) {
      setState(() => _status = 'Failed to save profile: $error');
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PatientProfile>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text('Failed to load profile: ${snapshot.error}'),
          );
        }

        final profile = snapshot.data!;

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text('Profile', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Text(
              'Personal information, medical profile, and emergency contact.',
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text('Email: ${profile.email}'),
                      Text('Role: ${profile.role.name.toUpperCase()}'),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _fullName,
                        decoration: const InputDecoration(
                          labelText: 'Full Name',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _phone,
                        decoration: const InputDecoration(labelText: 'Phone'),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _address,
                        decoration: const InputDecoration(labelText: 'Address'),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _allergies,
                        decoration: const InputDecoration(
                          labelText: 'Allergies',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _chronic,
                        decoration: const InputDecoration(
                          labelText: 'Chronic Conditions',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _medications,
                        decoration: const InputDecoration(
                          labelText: 'Current Medications',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _ecName,
                        decoration: const InputDecoration(
                          labelText: 'Emergency Contact Name',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _ecPhone,
                        decoration: const InputDecoration(
                          labelText: 'Emergency Contact Phone',
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _ecRelation,
                        decoration: const InputDecoration(
                          labelText: 'Emergency Contact Relation',
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_status != null) Text(_status!),
                      const SizedBox(height: 10),
                      FilledButton(
                        onPressed: _saving ? null : _save,
                        child: Text(_saving ? 'Saving...' : 'Save Profile'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
