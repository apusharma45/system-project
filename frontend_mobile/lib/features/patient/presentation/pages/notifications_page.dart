import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../core/api/user_facing_error.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/patient_ui.dart';
import '../../data/realtime/notifications_realtime_service.dart';
import '../../domain/notification_deep_link.dart';
import '../../domain/status_label_mapper.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool _onlyUnread = false;
  String? _status;
  bool _requestedInitialLoad = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final controller = AppScope.of(context).notificationsCenterController;
    if (!_requestedInitialLoad &&
        !controller.isLoading &&
        controller.notifications.isEmpty) {
      _requestedInitialLoad = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        controller.refresh();
      });
    }
  }

  Future<void> _markAllRead() async {
    final controller = AppScope.of(context).notificationsCenterController;
    try {
      await controller.markAllRead();
      setState(() {
        _status = 'All notifications marked as read.';
      });
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to mark all notifications as read.',
        ),
      );
    }
  }

  Future<void> _markRead(String id) async {
    final controller = AppScope.of(context).notificationsCenterController;
    try {
      await controller.markRead(id);
      setState(() {
        _status = 'Notification updated.';
      });
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to update notification.',
        ),
      );
    }
  }

  void _openDeepLink(AppNotification item) {
    context.push(notificationDeepLink(item.type));
  }

  @override
  Widget build(BuildContext context) {
    final controller = AppScope.of(context).notificationsCenterController;
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        if (controller.isLoading && controller.notifications.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }
        if (controller.errorMessage != null &&
            controller.notifications.isEmpty) {
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: const <Widget>[
              PatientGradientHeader(
                title: 'Notifications',
                subtitle: 'Realtime updates and important alerts.',
              ),
              SizedBox(height: AppSpacing.lg),
              PatientSectionCard(
                child: Text(
                  'Failed to load notifications. Pull to refresh and try again.',
                ),
              ),
            ],
          );
        }

        final all = controller.notifications;
        final list = _onlyUnread
            ? all.where((item) => !item.read).toList()
            : all;

        return ListView(
          key: const Key('notifications_list'),
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: <Widget>[
            PatientGradientHeader(
              title: 'Notifications',
              subtitle: _connectionText(
                controller.connectionState,
                controller.isPollingFallback,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            PatientSectionCard(
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: <Widget>[
                  FilterChip(
                    label: const Text('Unread only'),
                    selected: _onlyUnread,
                    onSelected: (value) => setState(() => _onlyUnread = value),
                  ),
                  OutlinedButton(
                    onPressed: controller.refresh,
                    child: const Text('Refresh'),
                  ),
                  FilledButton(
                    onPressed: _markAllRead,
                    child: const Text('Mark all read'),
                  ),
                ],
              ),
            ),
            if (_status != null) ...<Widget>[
              const SizedBox(height: AppSpacing.md),
              PatientStatusBanner(
                message: _status!,
                isError: _status!.startsWith('Failed'),
              ),
            ],
            const SizedBox(height: AppSpacing.md),
            if (list.isEmpty)
              const PatientSectionCard(child: Text('No notifications found.')),
            ...list.map(
              (item) => PatientSectionCard(
                key: Key('notification_${item.id}'),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: item.read
                            ? AppColors.border
                            : AppColors.blueLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        item.read
                            ? Icons.notifications_none_rounded
                            : Icons.notifications_active_rounded,
                        color: item.read
                            ? AppColors.textSecondary
                            : AppColors.primaryDark,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            notificationTypeLabel(item.type),
                            style: const TextStyle(
                              fontFamily: AppTypography.figmaFamily,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            item.message,
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
                    const SizedBox(width: AppSpacing.sm),
                    Column(
                      children: <Widget>[
                        if (!item.read)
                          IconButton(
                            onPressed: () => _markRead(item.id),
                            icon: const Icon(Icons.done),
                          ),
                        IconButton(
                          onPressed: () => _openDeepLink(item),
                          icon: const Icon(Icons.open_in_new),
                        ),
                      ],
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

  String _connectionText(
    NotificationsRealtimeConnectionState state,
    bool pollingFallback,
  ) {
    if (state == NotificationsRealtimeConnectionState.connected) {
      return 'Realtime connected.';
    }
    if (state == NotificationsRealtimeConnectionState.reconnecting) {
      return pollingFallback
          ? 'Realtime reconnecting. Polling fallback active.'
          : 'Realtime reconnecting.';
    }
    return pollingFallback
        ? 'Realtime disconnected. Polling fallback active.'
        : 'Realtime disconnected.';
  }
}
