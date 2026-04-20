import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/route_params.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/files/file_download_service.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/invalid_param_card.dart';

class ReportDetailsPage extends StatefulWidget {
  const ReportDetailsPage({required this.reportId, super.key});

  final String? reportId;

  @override
  State<ReportDetailsPage> createState() => _ReportDetailsPageState();
}

class _ReportDetailsPageState extends State<ReportDetailsPage> {
  Future<PatientReportRecord?>? _future;
  bool _isDownloadingReport = false;

  Future<void> _downloadReportFile({
    required String url,
    required String fallbackName,
  }) async {
    if (_isDownloadingReport) return;
    setState(() => _isDownloadingReport = true);
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
        const SnackBar(content: Text('Unable to download report right now.')),
      );
    } finally {
      if (mounted) {
        setState(() => _isDownloadingReport = false);
      }
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  Future<PatientReportRecord?> _load() async {
    final id = RouteParam.parse(widget.reportId)?.value;
    if (id == null) return null;
    final labs = await AppScope.of(context).labsRepository.listMyLabOrders();
    for (final lab in labs) {
      for (final report in lab.reports) {
        if (report.id == id) {
          return PatientReportRecord(report: report, labOrder: lab);
        }
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PatientReportRecord?>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        final record = snapshot.data;
        if (record == null) {
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              _CompactHeader(
                title: 'Report Details',
                onBack: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/records?tab=reports');
                  }
                },
                backKey: const Key('report_details_back_button'),
              ),
              const SizedBox(height: AppSpacing.md),
              const InvalidParamCard(entityName: 'report'),
            ],
          );
        }

        final centerName =
            record.labOrder.diagnosticSnapshot?.name ?? 'Not provided';
        final centerAddress =
            record.labOrder.diagnosticSnapshot?.address ?? 'Not provided';
        final centerPhone =
            record.labOrder.diagnosticSnapshot?.phone ?? 'Not provided';

        return ListView(
          key: const Key('report_details_list'),
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: <Widget>[
            _CompactHeader(
              title: 'Report Details',
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/records?tab=reports');
                }
              },
              backKey: const Key('report_details_back_button'),
            ),
            const SizedBox(height: AppSpacing.md),
            _TopCard(
              reportId: record.report.id,
              labOrderId: record.labOrder.id,
              centerName: centerName,
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: 'Diagnostic Center',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _DetailRow(
                    icon: Icons.location_on_outlined,
                    value: centerName,
                  ),
                  _DetailRow(icon: Icons.map_outlined, value: centerAddress),
                  _DetailRow(icon: Icons.phone_outlined, value: centerPhone),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _FigmaCard(
              title: 'Report File',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  const Text(
                    'Use the button to open or download the report file.',
                    style: TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      color: AppColors.textSecondary,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  FilledButton.tonalIcon(
                    onPressed: _isDownloadingReport
                        ? null
                        : () => _downloadReportFile(
                            url: record.report.fileUrl,
                            fallbackName: 'report_${record.report.id}.pdf',
                          ),
                    icon: const Icon(Icons.download_rounded),
                    label: Text(
                      _isDownloadingReport
                          ? 'Downloading...'
                          : 'Download Report File',
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
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

class _TopCard extends StatelessWidget {
  const _TopCard({
    required this.reportId,
    required this.labOrderId,
    required this.centerName,
  });

  final String reportId;
  final String labOrderId;
  final String centerName;

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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Report $reportId',
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Lab Order: $labOrderId',
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Color(0xE6FFFFFF),
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            centerName,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xE6FFFFFF),
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.value});

  final IconData icon;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(top: 1),
            child: Icon(icon, size: 14, color: AppColors.textSecondary),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontFamily: AppTypography.figmaFamily,
                color: AppColors.textSecondary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
