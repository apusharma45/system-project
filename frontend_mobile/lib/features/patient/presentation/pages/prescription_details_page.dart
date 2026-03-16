import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/files/file_download_service.dart';
import '../../../../core/theme/app_tokens.dart';
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
  Future<_PrescriptionDetailsData?>? _future;
  bool _isDownloadingDocument = false;

  Future<void> _downloadDocument({
    required String url,
    required String fallbackName,
  }) async {
    if (_isDownloadingDocument) return;
    setState(() => _isDownloadingDocument = true);
    final messenger = ScaffoldMessenger.of(context);
    messenger.showSnackBar(
      const SnackBar(content: Text('Download started...')),
    );
    try {
      final path = await const FileDownloadService().downloadFile(
        url: url,
        fallbackFileName: fallbackName,
      );
      if (!mounted) return;
      messenger.showSnackBar(
        const SnackBar(content: Text('Downloaded successfully.')),
      );

      try {
        final opened = await launchUrl(
          Uri.file(path),
          mode: LaunchMode.externalApplication,
        );
        if (!opened && mounted) {
          messenger.showSnackBar(
            const SnackBar(content: Text('File saved in app storage.')),
          );
        }
      } catch (_) {
        if (!mounted) return;
        messenger.showSnackBar(
          const SnackBar(content: Text('File saved in app storage.')),
        );
      }
    } on FileDownloadException catch (error) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text(error.message)));
    } catch (_) {
      if (!mounted) return;
      messenger.showSnackBar(
        const SnackBar(content: Text('Unable to download document right now.')),
      );
    } finally {
      if (mounted) {
        setState(() => _isDownloadingDocument = false);
      }
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<_PrescriptionDetailsData?> _load() async {
    final id = RouteParam.parse(widget.prescriptionId)?.value;
    if (id == null) return null;

    final deps = AppScope.of(context);
    final repo = deps.prescriptionsRepository;
    Prescription? item = await repo.getPrescriptionById(id);

    if (item == null || item.id.isEmpty) {
      final list = await repo.listMyPrescriptions();
      for (final current in list) {
        if (current.id == id) {
          item = current;
          break;
        }
      }
    }

    if (item == null) return null;

    final appointment = await deps.appointmentsRepository.getAppointmentById(
      item.appointmentId,
    );

    return _PrescriptionDetailsData(
      prescription: item,
      appointment: appointment,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_PrescriptionDetailsData?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final data = snapshot.data;
        if (data == null) {
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              _CompactHeader(
                title: 'Prescription Details',
                backKey: const Key('prescription_details_back_button'),
                onBack: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go(AppRoutes.records);
                  }
                },
              ),
              const SizedBox(height: AppSpacing.md),
              const InvalidParamCard(entityName: 'prescription'),
            ],
          );
        }

        final item = data.prescription;
        final doctorName =
            data.appointment?.doctorSnapshot?.fullName ??
            data.appointment?.doctorSnapshot?.email ??
            'Doctor';
        final statusLabel = prescriptionStatusLabel(item.status);

        final isPdf =
            (item.documentMimeType ?? '').toLowerCase().contains('pdf') ||
            (item.documentUrl ?? '').toLowerCase().endsWith('.pdf');

        return ListView(
          key: const Key('prescription_details_list'),
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: <Widget>[
            _CompactHeader(
              title: 'Prescription Details',
              backKey: const Key('prescription_details_back_button'),
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go(AppRoutes.records);
                }
              },
            ),
            const SizedBox(height: AppSpacing.md),
            _DoctorContextCard(
              doctorName: doctorName,
              statusLabel: statusLabel,
              prescriptionId: item.id,
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: 'Medicines',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  if (item.medications.isEmpty)
                    const _MutedText('No medicine rows provided.')
                  else
                    ...item.medications.map(
                      (med) => Container(
                        margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: AppRadius.md,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: AppColors.greenLight,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(
                                    Icons.medication_outlined,
                                    color: AppColors.green,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.sm),
                                Expanded(
                                  child: Text(
                                    med.name,
                                    style: const TextStyle(
                                      fontFamily: AppTypography.figmaFamily,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: <Widget>[
                                      _MedicineMeta(
                                        label: 'Dosage',
                                        value: med.dosage ?? 'Not specified',
                                      ),
                                      const SizedBox(height: AppSpacing.xs),
                                      _MedicineMeta(
                                        label: 'Duration',
                                        value: med.duration ?? 'Not specified',
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.md),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: <Widget>[
                                      _MedicineMeta(
                                        label: 'Frequency',
                                        value: med.frequency ?? 'Not specified',
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: 'Instructions',
              child: Text(
                item.instructions?.trim().isNotEmpty == true
                    ? item.instructions!.trim()
                    : 'No instructions provided.',
                style: const TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  color: AppColors.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: "Doctor's Advice",
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F9FF),
                  borderRadius: AppRadius.md,
                  border: Border.all(color: const Color(0xFFDFEAFE)),
                ),
                child: Text(
                  item.notes.trim().isEmpty ? 'Not provided' : item.notes,
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    color: AppColors.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: 'Pharmacy & Document',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _InfoLine(
                    label: 'Pharmacy',
                    value: item.pharmacySnapshot?.name ?? 'Not assigned',
                  ),
                  _InfoLine(
                    label: 'Pharmacy phone',
                    value: item.pharmacySnapshot?.phone ?? 'Not provided',
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  if (item.documentUrl != null && item.documentUrl!.isNotEmpty)
                    FilledButton.tonalIcon(
                      onPressed: _isDownloadingDocument
                          ? null
                          : () => _downloadDocument(
                              url: item.documentUrl!,
                              fallbackName: 'prescription_${item.id}.pdf',
                            ),
                      icon: const Icon(Icons.download_rounded),
                      label: Text(
                        _isDownloadingDocument
                            ? 'Downloading...'
                            : (isPdf
                                  ? 'Download Prescription PDF'
                                  : 'Open Document'),
                      ),
                    )
                  else
                    const _MutedText('No document attached.'),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class _PrescriptionDetailsData {
  const _PrescriptionDetailsData({
    required this.prescription,
    required this.appointment,
  });

  final Prescription prescription;
  final Appointment? appointment;
}

class _CompactHeader extends StatelessWidget {
  const _CompactHeader({
    required this.title,
    required this.onBack,
    required this.backKey,
  });

  final String title;
  final VoidCallback onBack;
  final Key backKey;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        IconButton(
          key: backKey,
          onPressed: onBack,
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          tooltip: 'Back',
        ),
        const SizedBox(width: AppSpacing.xs),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}

class _DoctorContextCard extends StatelessWidget {
  const _DoctorContextCard({
    required this.doctorName,
    required this.statusLabel,
    required this.prescriptionId,
  });

  final String doctorName;
  final String statusLabel;
  final String prescriptionId;

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
      ),
      child: Row(
        children: <Widget>[
          const CircleAvatar(
            radius: 24,
            backgroundColor: Color(0x33FFFFFF),
            child: Icon(Icons.medical_services, color: Colors.white),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  doctorName,
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Prescription $prescriptionId',
                  style: const TextStyle(
                    fontFamily: AppTypography.figmaFamily,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Color(0xE6FFFFFF),
                  ),
                ),
              ],
            ),
          ),
          Container(
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
              statusLabel,
              style: const TextStyle(
                fontFamily: AppTypography.figmaFamily,
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FigmaCard extends StatelessWidget {
  const _FigmaCard({required this.child, this.title});

  final Widget child;
  final String? title;

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

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

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

class _MedicineMeta extends StatelessWidget {
  const _MedicineMeta({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          label,
          style: const TextStyle(
            fontFamily: AppTypography.figmaFamily,
            color: AppColors.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontFamily: AppTypography.figmaFamily,
            color: AppColors.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ],
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
        fontWeight: FontWeight.w500,
      ),
    );
  }
}
