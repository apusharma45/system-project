import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/patient/domain/notification_deep_link.dart';
import '../app_scope.dart';
import 'app_routes.dart';

class PatientShell extends StatefulWidget {
  const PatientShell({required this.location, required this.child, super.key});

  final String location;
  final Widget child;

  @override
  State<PatientShell> createState() => _PatientShellState();
}

class _PatientShellState extends State<PatientShell> {
  StreamSubscription? _incomingSubscription;
  final List<String> _tabHistory = <String>[];
  bool _skipNextTabRecord = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _incomingSubscription?.cancel();
    final controller = AppScope.of(context).notificationsCenterController;
    _incomingSubscription = controller.incomingStream.listen((item) {
      if (!mounted) return;
      final messenger = ScaffoldMessenger.maybeOf(context);
      if (messenger == null) return;
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          content: Text(item.message),
          action: SnackBarAction(
            label: 'Open',
            onPressed: () {
              if (!mounted) return;
              context.push(notificationDeepLink(item.type));
            },
          ),
        ),
      );
    });
  }

  @override
  void dispose() {
    _incomingSubscription?.cancel();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant PatientShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    final oldRoot = _tabRootForLocation(oldWidget.location);
    final newRoot = _tabRootForLocation(widget.location);
    if (oldRoot != newRoot) {
      if (_skipNextTabRecord) {
        _skipNextTabRecord = false;
      } else if (_tabHistory.isEmpty || _tabHistory.last != oldRoot) {
        _tabHistory.add(oldRoot);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final deps = AppScope.of(context);
    final controller = deps.notificationsCenterController;
    return AnimatedBuilder(
      animation: Listenable.merge(<Listenable>[controller, deps.session]),
      builder: (context, child) {
        final sessionError = deps.session.errorMessage;
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) {
            if (didPop) return;
            final router = GoRouter.of(context);
            if (router.canPop()) {
              router.pop();
              return;
            }
            if (_tabHistory.isNotEmpty) {
              final previous = _tabHistory.removeLast();
              final current = _tabRootForLocation(widget.location);
              if (previous != current) {
                _skipNextTabRecord = true;
                context.go(previous);
              }
            }
          },
          child: Scaffold(
            body: SafeArea(
              child: Column(
                children: <Widget>[
                  if (sessionError != null)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(8),
                      color: Theme.of(context).colorScheme.errorContainer,
                      child: Text(
                        sessionError,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onErrorContainer,
                        ),
                      ),
                    ),
                  Expanded(child: widget.child),
                ],
              ),
            ),
            floatingActionButton:
                widget.location == AppRoutes.home ||
                    widget.location.startsWith(AppRoutes.notifications)
                ? null
                : FloatingActionButton(
                    key: const Key('fab-notifications'),
                    onPressed: () => _openNotifications(context),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: <Widget>[
                        const Icon(Icons.notifications_outlined),
                        if (controller.unreadCount > 0)
                          Positioned(
                            right: -6,
                            top: -6,
                            child: Container(
                              key: const Key('fab-notifications-badge'),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 5,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.error,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                controller.unreadCount > 99
                                    ? '99+'
                                    : '${controller.unreadCount}',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onError,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
            bottomNavigationBar: NavigationBar(
              selectedIndex: _selectedIndex,
              onDestinationSelected: (index) =>
                  _goTo(context, _items[index].path),
              destinations: _items
                  .map(
                    (item) => NavigationDestination(
                      icon: Icon(item.icon),
                      label: item.label,
                    ),
                  )
                  .toList(),
            ),
          ),
        );
      },
    );
  }

  int get _selectedIndex {
    final location = widget.location;
    if (location == AppRoutes.home) return 0;
    if (location.startsWith(AppRoutes.doctors) ||
        location.startsWith(AppRoutes.booking)) {
      return 1;
    }
    if (location.startsWith(AppRoutes.appointments)) return 2;
    if (location.startsWith(AppRoutes.records) ||
        location.startsWith(AppRoutes.prescriptions) ||
        location.startsWith(AppRoutes.reports)) {
      return 3;
    }
    if (location.startsWith(AppRoutes.profile)) return 4;
    return 0;
  }

  void _goTo(BuildContext context, String path) {
    if (path == widget.location) return;
    context.go(path);
  }

  void _openNotifications(BuildContext context) {
    context.push(AppRoutes.notifications);
  }

  String _tabRootForLocation(String location) {
    if (location == AppRoutes.home) return AppRoutes.home;
    if (location.startsWith(AppRoutes.doctors) ||
        location.startsWith(AppRoutes.booking)) {
      return AppRoutes.doctors;
    }
    if (location.startsWith(AppRoutes.appointments)) {
      return AppRoutes.appointments;
    }
    if (location.startsWith(AppRoutes.records) ||
        location.startsWith(AppRoutes.prescriptions) ||
        location.startsWith(AppRoutes.reports)) {
      return AppRoutes.records;
    }
    if (location.startsWith(AppRoutes.profile)) return AppRoutes.profile;
    return AppRoutes.home;
  }
}

class _ShellNavItem {
  const _ShellNavItem({
    required this.label,
    required this.path,
    required this.icon,
  });

  final String label;
  final String path;
  final IconData icon;
}

const List<_ShellNavItem> _items = <_ShellNavItem>[
  _ShellNavItem(label: 'Home', path: AppRoutes.home, icon: Icons.home_outlined),
  _ShellNavItem(
    label: 'Doctors',
    path: AppRoutes.doctors,
    icon: Icons.medical_services_outlined,
  ),
  _ShellNavItem(
    label: 'Appts',
    path: AppRoutes.appointments,
    icon: Icons.calendar_today_outlined,
  ),
  _ShellNavItem(
    label: 'Records',
    path: AppRoutes.records,
    icon: Icons.folder_outlined,
  ),
  _ShellNavItem(
    label: 'Profile',
    path: AppRoutes.profile,
    icon: Icons.person_outline,
  ),
];
