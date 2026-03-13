class AppRoutes {
  static const String home = '/';
  static const String doctors = '/doctors';
  static const String booking = '/booking';
  static const String appointments = '/appointments';
  static const String records = '/records';
  static const String profile = '/profile';
  static const String notifications = '/notifications';
  static const String prescriptions = '/prescriptions';
  static const String reports = '/reports';

  static String doctorDetails(String doctorId) => '$doctors/$doctorId';
  static String bookingForDoctor(String doctorId) => '$booking/$doctorId';
  static String appointmentDetails(String appointmentId) =>
      '$appointments/$appointmentId';
  static String prescriptionDetails(String prescriptionId) =>
      '$prescriptions/$prescriptionId';
  static String reportDetails(String reportId) => '$reports/$reportId';
}
