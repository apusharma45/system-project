import '../../../core/domain/enums.dart';

String notificationDeepLink(NotificationType type) {
  switch (type) {
    case NotificationType.prescriptionReady:
      return '/records?tab=prescriptions';
    case NotificationType.labResultUploaded:
      return '/records?tab=reports';
    case NotificationType.labAssigned:
      return '/records?tab=labs';
    case NotificationType.appointmentCalled:
      return '/appointments';
  }
}
