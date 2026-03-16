import 'package:flutter/material.dart';

import '../../core/theme/app_tokens.dart';

class PatientGradientHeader extends StatelessWidget {
  const PatientGradientHeader({
    required this.title,
    required this.subtitle,
    this.footer,
    super.key,
  });

  final String title;
  final String subtitle;
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[AppColors.primary, AppColors.primaryDark],
        ),
        borderRadius: AppRadius.xl,
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x221565C0),
            blurRadius: 22,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            subtitle,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xE6FFFFFF),
            ),
          ),
          if (footer != null) ...<Widget>[
            const SizedBox(height: AppSpacing.sm),
            footer!,
          ],
        ],
      ),
    );
  }
}

class PatientSectionCard extends StatelessWidget {
  const PatientSectionCard({
    required this.child,
    this.title,
    super.key,
  });

  final String? title;
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
          if (title != null) ...<Widget>[
            Text(
              title!,
              style: const TextStyle(
                fontFamily: AppTypography.figmaFamily,
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
          ],
          child,
        ],
      ),
    );
  }
}

class PatientStatusBanner extends StatelessWidget {
  const PatientStatusBanner({
    required this.message,
    required this.isError,
    super.key,
  });

  final String message;
  final bool isError;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isError ? AppColors.redLight : AppColors.greenLight,
        borderRadius: AppRadius.md,
      ),
      child: Text(message),
    );
  }
}

class PatientTopChip extends StatelessWidget {
  const PatientTopChip({required this.text, super.key});

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
