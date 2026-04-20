import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/invalid_param_card.dart';

class DoctorDetailsPage extends StatefulWidget {
  const DoctorDetailsPage({required this.doctorId, super.key});

  final String? doctorId;

  @override
  State<DoctorDetailsPage> createState() => _DoctorDetailsPageState();
}

class _DoctorDetailsPageState extends State<DoctorDetailsPage> {
  Future<DoctorDetails?>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<DoctorDetails?> _load() async {
    final id = RouteParam.parse(widget.doctorId)?.value;
    if (id == null) return null;
    final repo = AppScope.of(context).doctorsRepository;
    try {
      final details = await repo.getDoctorDetailsById(id);
      if (details != null) return details;
    } catch (_) {
      // Fallback to list payload for compatibility if details endpoint fails.
    }
    final doctors = await repo.listDoctors();
    for (final doctor in doctors) {
      if (doctor.id == id) {
        return DoctorDetails(
          id: doctor.id,
          email: doctor.email,
          role: doctor.role,
          fullName: doctor.fullName,
          avatarUrl: doctor.avatarUrl,
          specialization: doctor.specialization,
          yearsOfExperience: doctor.yearsOfExperience,
        );
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<DoctorDetails?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final doctor = snapshot.data;
        if (doctor == null) {
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: const <Widget>[
              Text(
                'Doctor Details',
                style: TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: AppSpacing.sm),
              Text('Doctor profile, availability, and clinic details.'),
              SizedBox(height: AppSpacing.lg),
              InvalidParamCard(entityName: 'doctor'),
            ],
          );
        }

        final displayName = doctor.fullName?.trim().isNotEmpty == true
            ? doctor.fullName!.trim()
            : 'Doctor';
        final specialization = doctor.specialization ?? 'General Practice';

        return ListView(
          key: const Key('doctor_details_list'),
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: <Widget>[
            Align(
              alignment: Alignment.centerLeft,
              child: IconButton(
                key: const Key('doctor_details_back_button'),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go(AppRoutes.doctors);
                  }
                },
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                tooltip: 'Back',
              ),
            ),
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: <Color>[AppColors.primary, AppColors.primaryDark],
                ),
                borderRadius: AppRadius.xl,
              ),
              child: Row(
                children: <Widget>[
                  _Avatar(avatarUrl: doctor.avatarUrl),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          displayName,
                          style: const TextStyle(
                            fontFamily: AppTypography.figmaFamily,
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          specialization,
                          style: const TextStyle(
                            fontFamily: AppTypography.figmaFamily,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Color(0xE6FFFFFF),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Wrap(
                          spacing: AppSpacing.sm,
                          runSpacing: AppSpacing.sm,
                          children: <Widget>[
                            _TopChip(
                              text: doctor.yearsOfExperience != null
                                  ? '${doctor.yearsOfExperience} years exp'
                                  : 'Experience N/A',
                            ),
                            _TopChip(text: doctor.email),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'Qualifications',
              child: doctor.degrees.isEmpty
                  ? const _MutedText('No qualifications available.')
                  : Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: doctor.degrees
                          .map((degree) => _Tag(text: degree))
                          .toList(),
                    ),
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'About',
              child: Text(
                doctor.about?.trim().isNotEmpty == true
                    ? doctor.about!.trim()
                    : 'Profile summary is not available yet.',
                style: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  color: AppColors.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'Clinic Information',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _InfoRow(
                    label: 'Clinic',
                    value: doctor.clinicName ?? 'Not provided',
                  ),
                  _InfoRow(
                    label: 'Address',
                    value: doctor.clinicAddress ?? 'Not provided',
                  ),
                  _InfoRow(
                    label: 'Phone',
                    value: doctor.clinicPhone ?? 'Not provided',
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _SectionCard(
              title: 'Available Time Slots',
              child: doctor.availableTimeSlots.isEmpty
                  ? const _MutedText('No available slots published yet.')
                  : Wrap(
                      spacing: AppSpacing.sm,
                      runSpacing: AppSpacing.sm,
                      children: doctor.availableTimeSlots
                          .map((slot) => _Tag(text: slot.label))
                          .toList(),
                    ),
            ),
            const SizedBox(height: AppSpacing.lg),
            FilledButton(
              onPressed: () =>
                  context.push(AppRoutes.bookingForDoctor(doctor.id)),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(52),
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: AppRadius.md),
                textStyle: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
              child: const Text('Book Appointment'),
            ),
          ],
        );
      },
    );
  }
}

class _Avatar extends StatelessWidget {
  const _Avatar({required this.avatarUrl});

  final String? avatarUrl;

  @override
  Widget build(BuildContext context) {
    final hasImage = avatarUrl != null && avatarUrl!.trim().isNotEmpty;
    return Container(
      width: 62,
      height: 62,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: ClipOval(
        child: hasImage
            ? Image.network(
                avatarUrl!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _fallbackAvatar(),
              )
            : _fallbackAvatar(),
      ),
    );
  }

  Widget _fallbackAvatar() {
    return Container(
      color: const Color(0x33FFFFFF),
      alignment: Alignment.center,
      child: const Icon(Icons.person, color: Colors.white),
    );
  }
}

class _TopChip extends StatelessWidget {
  const _TopChip({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: const Color(0x1FFFFFFF),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0x4DFFFFFF)),
      ),
      child: Text(
        text,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child});

  final String title;
  final Widget child;

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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          child,
        ],
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: AppColors.blueLight,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: AppColors.primaryDark,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Text(
        '$label: $value',
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          color: AppColors.textSecondary,
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class _MutedText extends StatelessWidget {
  const _MutedText(this.value);

  final String value;

  @override
  Widget build(BuildContext context) {
    return Text(
      value,
      style: const TextStyle(
        fontFamily: AppTypography.figmaFamily,
        color: AppColors.textSecondary,
        fontSize: 13,
        fontWeight: FontWeight.w500,
      ),
    );
  }
}
