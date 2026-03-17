import 'package:flutter/material.dart';

import 'app_dependencies.dart';
import 'app_scope.dart';
import '../core/theme/app_theme.dart';
import 'router/app_router.dart';

class PatientApp extends StatefulWidget {
  const PatientApp({required this.dependencies, super.key});

  final AppDependencies dependencies;

  @override
  State<PatientApp> createState() => _PatientAppState();
}

class _PatientAppState extends State<PatientApp> {
  late final AppRouter _appRouter;

  @override
  void initState() {
    super.initState();
    _appRouter = AppRouter(widget.dependencies.session);
  }

  @override
  void dispose() {
    widget.dependencies.notificationsCenterController.dispose();
    widget.dependencies.notificationsRealtimeService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      dependencies: widget.dependencies,
      child: MaterialApp.router(
        title: 'Patient App',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        routerConfig: _appRouter.router,
      ),
    );
  }
}
