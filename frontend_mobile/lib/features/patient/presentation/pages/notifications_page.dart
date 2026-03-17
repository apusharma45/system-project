import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../core/domain/models.dart';
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
      setState(() => _status = 'Failed to mark all read: $error');
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
      setState(() => _status = 'Failed to update notification: $error');
    }
  }

  void _openDeepLink(AppNotification item) {
    context.go(notificationDeepLink(item.type));
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
          return Center(
            child: Text(
              'Failed to load notifications: ${controller.errorMessage}',
            ),
          );
        }

        final all = controller.notifications;
        final list = _onlyUnread
            ? all.where((item) => !item.read).toList()
            : all;

        return ListView(
          padding: const EdgeInsets.all(16),
          children: <Widget>[
            Text(
              'Notifications',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              _connectionText(
                controller.connectionState,
                controller.isPollingFallback,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
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
            if (_status != null) ...<Widget>[
              const SizedBox(height: 8),
              Text(_status!),
            ],
            const SizedBox(height: 12),
            if (list.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No notifications found.'),
                ),
              ),
            ...list.map(
              (item) => Card(
                child: ListTile(
                  title: Text(notificationTypeLabel(item.type)),
                  subtitle: Text(item.message),
                  trailing: Wrap(
                    spacing: 6,
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
