import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/patient_ui.dart';

class DoctorListPage extends StatefulWidget {
  const DoctorListPage({super.key});

  @override
  State<DoctorListPage> createState() => _DoctorListPageState();
}

class _DoctorListPageState extends State<DoctorListPage> {
  Future<List<UserSummary>>? _future;
  String _query = '';
  String _selectedSpecialization = 'All';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= AppScope.of(context).doctorsRepository.listDoctors();
  }

  Future<void> _refresh() async {
    setState(() {
      _future = AppScope.of(context).doctorsRepository.listDoctors();
    });
    await _future;
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
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              const _Header(),
              const SizedBox(height: AppSpacing.lg),
              const PatientSectionCard(
                child: Text(
                  'Failed to load doctors. Pull to refresh and try again.',
                ),
              ),
            ],
          );
        }
        final doctors = snapshot.data ?? const <UserSummary>[];
        final specializations = <String>{
          for (final doctor in doctors)
            if ((doctor.specialization ?? '').trim().isNotEmpty)
              doctor.specialization!.trim(),
        }.toList()..sort();
        final filtered = doctors.where((d) {
          final q = _query.trim().toLowerCase();
          final specializationText = (d.specialization ?? '').trim();
          if (_selectedSpecialization != 'All' &&
              specializationText.toLowerCase() !=
                  _selectedSpecialization.toLowerCase()) {
            return false;
          }
          if (q.isEmpty) return true;
          final fullName = (d.fullName ?? '').toLowerCase();
          final specialization = specializationText.toLowerCase();
          return fullName.contains(q) ||
              d.email.toLowerCase().contains(q) ||
              specialization.contains(q);
        }).toList();

        final sections = <Widget>[
          const _Header(),
          const SizedBox(height: AppSpacing.md),
          TextField(
            key: const Key('doctor_search_input'),
            onChanged: (value) => setState(() => _query = value),
            decoration: InputDecoration(
              labelText: 'Search doctor',
              hintText: 'Name, specialization, or email',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppColors.border),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          SingleChildScrollView(
            key: const Key('doctor_specialization_filters'),
            scrollDirection: Axis.horizontal,
            child: Row(
              children: <Widget>[
                _SpecializationChip(
                  label: 'All',
                  selected: _selectedSpecialization == 'All',
                  onTap: () => setState(() => _selectedSpecialization = 'All'),
                ),
                ...specializations.map(
                  (specialization) => _SpecializationChip(
                    label: specialization,
                    selected: _selectedSpecialization == specialization,
                    onTap: () => setState(
                      () => _selectedSpecialization = specialization,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          if (filtered.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(AppSpacing.lg),
                child: Text('No doctors found.'),
              ),
            )
          else
            ...filtered.map(
              (doctor) => _DoctorCard(
                doctor: doctor,
                onDetails: () =>
                    context.push(AppRoutes.doctorDetails(doctor.id)),
                onBook: () =>
                    context.push(AppRoutes.bookingForDoctor(doctor.id)),
              ),
            ),
        ];

        return RefreshIndicator(
          onRefresh: _refresh,
          child: ListView(
            key: const Key('doctors_list'),
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: sections,
          ),
        );
      },
    );
  }
}

class _Header extends StatelessWidget {
  const _Header();

  @override
  Widget build(BuildContext context) {
    return const PatientGradientHeader(
      title: 'Doctors',
      subtitle: 'Search and browse available doctors by specialization.',
    );
  }
}

class _DoctorCard extends StatelessWidget {
  const _DoctorCard({
    required this.doctor,
    required this.onDetails,
    required this.onBook,
  });

  final UserSummary doctor;
  final VoidCallback onDetails;
  final VoidCallback onBook;

  @override
  Widget build(BuildContext context) {
    final fullName = doctor.fullName?.trim().isNotEmpty == true
        ? doctor.fullName!
        : doctor.email;
    final specialization = doctor.specialization ?? 'General Practice';
    final exp = doctor.yearsOfExperience;
    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: InkWell(
                    key: Key('doctor_card_open_${doctor.id}'),
                    borderRadius: AppRadius.md,
                    onTap: onDetails,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: AppColors.blueLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.person,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(
                                fullName,
                                style: const TextStyle(
                                  fontFamily: AppTypography.figmaFamily,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              Text(
                                specialization,
                                style: const TextStyle(
                                  fontFamily: AppTypography.figmaFamily,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (exp != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: AppSpacing.xs,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.greenLight,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '$exp yrs',
                      style: const TextStyle(
                        fontFamily: AppTypography.figmaFamily,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF2E7D32),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              doctor.email,
              style: const TextStyle(
                fontFamily: AppTypography.figmaFamily,
                fontSize: 12,
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            const Row(
              children: <Widget>[
                Icon(
                  Icons.access_time_rounded,
                  size: 14,
                  color: AppColors.textSecondary,
                ),
                SizedBox(width: AppSpacing.xs),
                Expanded(
                  child: Text(
                    'Mon, Wed, Fri: 9AM - 5PM',
                    style: TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: <Widget>[
                TextButton.icon(
                  onPressed: onDetails,
                  icon: const Icon(Icons.info_outline),
                  label: const Text('Details'),
                ),
                const Spacer(),
                FilledButton.icon(
                  onPressed: onBook,
                  icon: const Icon(Icons.event_available_outlined, size: 18),
                  label: const Text('Book'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SpecializationChip extends StatelessWidget {
  const _SpecializationChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: ChoiceChip(
        key: Key('doctor_filter_${label.toLowerCase()}'),
        label: Text(label),
        selected: selected,
        onSelected: (_) => onTap(),
      ),
    );
  }
}
