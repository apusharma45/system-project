import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/unsupported_role_page.dart';
import '../../features/patient/presentation/pages/appointment_booking_page.dart';
import '../../features/patient/presentation/pages/appointment_details_page.dart';
import '../../features/patient/presentation/pages/doctor_details_page.dart';
import '../../features/patient/presentation/pages/doctor_list_page.dart';
import '../../features/patient/presentation/pages/home_page.dart';
import '../../features/patient/presentation/pages/my_appointments_page.dart';
import '../../features/patient/presentation/pages/notifications_page.dart';
import '../../features/patient/presentation/pages/prescription_details_page.dart';
import '../../features/patient/presentation/pages/profile_page.dart';
import '../../features/patient/presentation/pages/records_page.dart';
import '../../features/patient/presentation/pages/report_details_page.dart';
import '../state/session_controller.dart';
import 'app_routes.dart';
import 'patient_shell.dart';

class AppRouter {
  AppRouter(this._session);

  final SessionController _session;

  late final GoRouter router = GoRouter(
    refreshListenable: _session,
    routes: _allRoutes,
    redirect: _redirect,
  );

  static GoRouter buildTestRouter({String? initialLocation}) {
    return GoRouter(initialLocation: initialLocation, routes: _allRoutes);
  }

  static final List<RouteBase> _allRoutes = <RouteBase>[
    GoRoute(
      path: '/loading',
      builder: (context, state) => const _LoadingPage(),
    ),
    GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
    GoRoute(
      path: '/unsupported-role',
      builder: (context, state) => const UnsupportedRolePage(),
    ),
    ShellRoute(
      builder: (BuildContext context, GoRouterState state, Widget child) {
        return PatientShell(location: state.uri.path, child: child);
      },
      routes: <RouteBase>[
        GoRoute(
          path: AppRoutes.home,
          builder: (context, state) => const HomePage(),
        ),
        GoRoute(
          path: AppRoutes.doctors,
          builder: (context, state) => const DoctorListPage(),
        ),
        GoRoute(
          path: '/doctors/:doctorId',
          builder: (context, state) =>
              DoctorDetailsPage(doctorId: state.pathParameters['doctorId']),
        ),
        GoRoute(
          path: '/booking/:doctorId',
          builder: (context, state) => AppointmentBookingPage(
            doctorId: state.pathParameters['doctorId'],
          ),
        ),
        GoRoute(
          path: AppRoutes.appointments,
          builder: (context, state) => const MyAppointmentsPage(),
        ),
        GoRoute(
          path: '/appointments/:appointmentId',
          builder: (context, state) => AppointmentDetailsPage(
            appointmentId: state.pathParameters['appointmentId'],
          ),
        ),
        GoRoute(
          path: AppRoutes.records,
          builder: (context, state) => const RecordsPage(),
        ),
        GoRoute(
          path: '/prescriptions/:prescriptionId',
          builder: (context, state) => PrescriptionDetailsPage(
            prescriptionId: state.pathParameters['prescriptionId'],
          ),
        ),
        GoRoute(
          path: '/reports/:reportId',
          builder: (context, state) =>
              ReportDetailsPage(reportId: state.pathParameters['reportId']),
        ),
        GoRoute(
          path: AppRoutes.profile,
          builder: (context, state) => const ProfilePage(),
        ),
        GoRoute(
          path: AppRoutes.notifications,
          builder: (context, state) => const NotificationsPage(),
        ),
      ],
    ),
  ];

  String? _redirect(BuildContext context, GoRouterState state) {
    final path = state.uri.path;
    final isLoading = _session.status == AuthStatus.loading;
    final isAuthed = _session.status == AuthStatus.authenticated;
    final isPatient = _session.user?.role.name == 'patient';

    if (isLoading) {
      return path == '/loading' ? null : '/loading';
    }
    if (!isAuthed) {
      return path == '/login' ? null : '/login';
    }
    if (!isPatient) {
      return path == '/unsupported-role' ? null : '/unsupported-role';
    }
    if (path == '/login' || path == '/unsupported-role' || path == '/loading') {
      return AppRoutes.home;
    }
    return null;
  }
}

class _LoadingPage extends StatelessWidget {
  const _LoadingPage();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
