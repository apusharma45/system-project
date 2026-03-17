import 'package:flutter/widgets.dart';

import 'app_dependencies.dart';

class AppScope extends InheritedWidget {
  const AppScope({required super.child, required this.dependencies, super.key});

  final AppDependencies dependencies;

  static AppDependencies of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    if (scope == null) {
      throw StateError('AppScope not found in widget tree');
    }
    return scope.dependencies;
  }

  @override
  bool updateShouldNotify(AppScope oldWidget) {
    return oldWidget.dependencies != dependencies;
  }
}
