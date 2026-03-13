import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color primary = Color(0xFF1976D2);
  static const Color primaryDark = Color(0xFF1565C0);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textMuted = Color(0xFF9E9E9E);
  static const Color border = Color(0xFFE0E0E0);
  static const Color dividerLight = Color(0xFFF5F5F5);
  static const Color blueLight = Color(0xFFE3F2FD);
  static const Color green = Color(0xFF4CAF50);
  static const Color greenLight = Color(0xFFE8F5E9);
  static const Color amber = Color(0xFFFB8C00);
  static const Color amberLight = Color(0xFFFFF3E0);
  static const Color redLight = Color(0xFFFFEBEE);
  static const Color danger = Color(0xFFE53935);
}

class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
}

class AppRadius {
  static const BorderRadius md = BorderRadius.all(Radius.circular(12));
  static const BorderRadius lg = BorderRadius.all(Radius.circular(16));
}
