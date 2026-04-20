import '../../../../core/domain/enums.dart';
import '../../../../core/domain/models.dart';
import 'enum_parsers.dart';

DateTime? _dateOrNull(Object? raw) {
  if (raw is! String || raw.trim().isEmpty) return null;
  return DateTime.tryParse(raw);
}

String? _stringOrNull(Object? raw) {
  if (raw is! String) return null;
  final value = raw.trim();
  return value.isEmpty ? null : value;
}

Map<String, dynamic> _asMap(Object? raw) {
  if (raw is Map<String, dynamic>) return raw;
  if (raw is Map) return raw.cast<String, dynamic>();
  return <String, dynamic>{};
}

CurrentUser mapCurrentUser(Map<String, dynamic> json) {
  return CurrentUser(
    userId: _stringOrNull(json['userId']) ?? '',
    email: _stringOrNull(json['email']) ?? '',
    role: parseUserRole(_stringOrNull(json['role']) ?? '') ?? UserRole.patient,
    fullName: _stringOrNull(json['fullName']),
    avatarUrl: _stringOrNull(json['avatarUrl']),
  );
}

UserSummary mapUserSummary(Map<String, dynamic> json) {
  final yearsRaw = json['yearsOfExperience'];
  return UserSummary(
    id: _stringOrNull(json['id']) ?? '',
    email: _stringOrNull(json['email']) ?? '',
    role: parseUserRole(_stringOrNull(json['role']) ?? '') ?? UserRole.doctor,
    fullName: _stringOrNull(json['fullName']),
    avatarUrl: _stringOrNull(json['avatarUrl']),
    specialization: _stringOrNull(json['specialization']),
    yearsOfExperience: yearsRaw is int ? yearsRaw : int.tryParse('$yearsRaw'),
  );
}

List<String> _stringListOrEmpty(Object? raw) {
  final list = (raw as List<dynamic>?) ?? const <dynamic>[];
  return list
      .map((item) => _stringOrNull(item))
      .whereType<String>()
      .toList();
}

DoctorAvailableTimeSlot? _mapDoctorSlot(Object? raw) {
  if (raw is String && raw.trim().isNotEmpty) {
    return DoctorAvailableTimeSlot(label: raw.trim());
  }
  final map = _asMap(raw);
  if (map.isEmpty) return null;
  final day = _stringOrNull(map['day']);
  final start = _stringOrNull(map['startTime']) ?? _stringOrNull(map['start']);
  final end = _stringOrNull(map['endTime']) ?? _stringOrNull(map['end']);
  final label =
      _stringOrNull(map['label']) ??
      [day, start, end].whereType<String>().join(' ');
  if (label.trim().isEmpty) return null;
  return DoctorAvailableTimeSlot(
    label: label.trim(),
    day: day,
    startTime: start,
    endTime: end,
  );
}

DoctorDetails mapDoctorDetails(Map<String, dynamic> json) {
  final payload = _asMap(json['doctor']).isNotEmpty ? _asMap(json['doctor']) : json;
  final yearsRaw = payload['yearsOfExperience'];
  final slotsRaw =
      (payload['availableTimeSlots'] as List<dynamic>?) ?? const <dynamic>[];
  final slots = slotsRaw
      .map(_mapDoctorSlot)
      .whereType<DoctorAvailableTimeSlot>()
      .toList();
  return DoctorDetails(
    id: _stringOrNull(payload['id']) ?? '',
    email: _stringOrNull(payload['email']) ?? '',
    role:
        parseUserRole(_stringOrNull(payload['role']) ?? '') ?? UserRole.doctor,
    fullName: _stringOrNull(payload['fullName']),
    avatarUrl: _stringOrNull(payload['avatarUrl']),
    specialization: _stringOrNull(payload['specialization']),
    yearsOfExperience: yearsRaw is int ? yearsRaw : int.tryParse('$yearsRaw'),
    degrees: _stringListOrEmpty(payload['degrees']),
    about: _stringOrNull(payload['about']),
    clinicName: _stringOrNull(payload['clinicName']),
    clinicAddress: _stringOrNull(payload['clinicAddress']),
    clinicPhone: _stringOrNull(payload['clinicPhone']),
    availableTimeSlots: slots,
  );
}

UserLite _mapUserLite(Object? raw) {
  final map = _asMap(raw);
  return UserLite(
    id: _stringOrNull(map['id']),
    fullName: _stringOrNull(map['fullName']),
    email: _stringOrNull(map['email']),
  );
}

Appointment mapAppointment(Map<String, dynamic> json) {
  return Appointment(
    id: _stringOrNull(json['id']) ?? '',
    patientId: _stringOrNull(json['patientId']) ?? '',
    doctorId: _stringOrNull(json['doctorId']) ?? '',
    status:
        parseAppointmentStatus(_stringOrNull(json['status']) ?? '') ??
        AppointmentStatus.requested,
    scheduledAt: _dateOrNull(json['scheduledAt']),
    reason: _stringOrNull(json['reason']),
    preferredDateFrom: _dateOrNull(json['preferredDateFrom']),
    preferredDateTo: _dateOrNull(json['preferredDateTo']),
    preferredTimeNote: _stringOrNull(json['preferredTimeNote']),
    requiresLab: json['requiresLab'] == true,
    labFlowLocked: json['labFlowLocked'] == true,
    doctorSnapshot: _mapUserLite(json['doctorSnapshot']),
    patientSnapshot: _mapUserLite(json['patientSnapshot']),
  );
}

LabReport _mapLabReport(Map<String, dynamic> json, {String? fallbackOrderId}) {
  return LabReport(
    id: _stringOrNull(json['id']) ?? '',
    labOrderId: _stringOrNull(json['labOrderId']) ?? fallbackOrderId ?? '',
    fileUrl: _stringOrNull(json['fileUrl']) ?? '',
  );
}

LabOrder mapLabOrder(Map<String, dynamic> json) {
  final orderId = _stringOrNull(json['id']) ?? '';
  final reportsRaw =
      (json['labReports'] as List<dynamic>?) ?? const <dynamic>[];
  final latest = json['latestReport'];
  final compat = json['labResult'];
  final reports = reportsRaw
      .map((item) => _mapLabReport(_asMap(item), fallbackOrderId: orderId))
      .where((item) => item.fileUrl.isNotEmpty)
      .toList();
  if (reports.isEmpty && latest != null) {
    reports.add(_mapLabReport(_asMap(latest), fallbackOrderId: orderId));
  }
  if (reports.isEmpty && compat != null) {
    reports.add(_mapLabReport(_asMap(compat), fallbackOrderId: orderId));
  }

  final testsRaw = (json['tests'] as List<dynamic>?) ?? const <dynamic>[];
  final tests = testsRaw.map((item) {
    final map = _asMap(item);
    final title = _stringOrNull(map['title']) ?? 'Test';
    final desc = _stringOrNull(map['description']);
    return desc == null ? title : '$title: $desc';
  }).toList();

  final diagnosticSnapshotRaw = _asMap(json['diagnosticSnapshot']);

  return LabOrder(
    id: orderId,
    appointmentId: _stringOrNull(json['appointmentId']) ?? '',
    diagnosticId: _stringOrNull(json['diagnosticId']) ?? '',
    status:
        parseLabOrderStatus(_stringOrNull(json['status']) ?? '') ??
        LabOrderStatus.created,
    tests: tests,
    reports: reports,
    diagnosticSnapshot: DiagnosticSnapshot(
      name: _stringOrNull(diagnosticSnapshotRaw['name']),
      address: _stringOrNull(diagnosticSnapshotRaw['address']),
      phone: _stringOrNull(diagnosticSnapshotRaw['phone']),
    ),
  );
}

Prescription mapPrescription(Map<String, dynamic> json) {
  final pharmacyRaw = _asMap(json['pharmacySnapshot']);
  final medsRaw = (json['medications'] as List<dynamic>?) ?? const <dynamic>[];
  final medications = medsRaw
      .map((item) {
        final map = _asMap(item);
        final name = _stringOrNull(map['name']);
        if (name == null) return null;
        return PrescriptionMedication(
          name: name,
          dosage: _stringOrNull(map['dosage']),
          frequency: _stringOrNull(map['frequency']),
          duration: _stringOrNull(map['duration']),
        );
      })
      .whereType<PrescriptionMedication>()
      .toList();
  return Prescription(
    id: _stringOrNull(json['id']) ?? '',
    appointmentId: _stringOrNull(json['appointmentId']) ?? '',
    doctorId: _stringOrNull(json['doctorId']) ?? '',
    pharmacyId: _stringOrNull(json['pharmacyId']) ?? '',
    notes: _stringOrNull(json['notes']) ?? '',
    status:
        parsePrescriptionStatus(_stringOrNull(json['status']) ?? '') ??
        PrescriptionStatus.draft,
    diagnosis: _stringOrNull(json['diagnosis']),
    instructions: _stringOrNull(json['instructions']),
    documentUrl: _stringOrNull(json['documentUrl']),
    documentMimeType: _stringOrNull(json['documentMimeType']),
    medications: medications,
    pharmacySnapshot: PharmacySnapshot(
      name:
          _stringOrNull(pharmacyRaw['name']) ??
          _stringOrNull(pharmacyRaw['pharmacyName']) ??
          _stringOrNull(pharmacyRaw['fullName']) ??
          _stringOrNull(pharmacyRaw['email']),
      address: _stringOrNull(pharmacyRaw['address']),
      phone: _stringOrNull(pharmacyRaw['phone']),
    ),
  );
}

AppNotification mapNotification(Map<String, dynamic> json) {
  return AppNotification(
    id: _stringOrNull(json['id']) ?? '',
    userId: _stringOrNull(json['userId']) ?? '',
    type:
        parseNotificationType(_stringOrNull(json['type']) ?? '') ??
        NotificationType.appointmentCalled,
    message: _stringOrNull(json['message']) ?? '',
    read: json['read'] == true,
    createdAt:
        _dateOrNull(json['createdAt']) ??
        DateTime.fromMillisecondsSinceEpoch(0),
  );
}

PatientProfile mapPatientProfile(Map<String, dynamic> json) {
  final patient = _asMap(json['patient']);
  final profile = _asMap(patient['profile']);
  return PatientProfile(
    id: _stringOrNull(patient['id']) ?? '',
    email: _stringOrNull(patient['email']) ?? '',
    role:
        parseUserRole(_stringOrNull(patient['role']) ?? '') ?? UserRole.patient,
    fullName: _stringOrNull(patient['fullName']),
    avatarUrl: _stringOrNull(patient['avatarUrl']),
    phone: _stringOrNull(patient['phone']) ?? _stringOrNull(profile['phone']),
    address:
        _stringOrNull(patient['address']) ?? _stringOrNull(profile['address']),
    allergies: _stringOrNull(profile['allergies']),
    chronicConditions: _stringOrNull(profile['chronicConditions']),
    currentMedications: _stringOrNull(profile['currentMedications']),
    emergencyContactName: _stringOrNull(profile['emergencyContactName']),
    emergencyContactPhone: _stringOrNull(profile['emergencyContactPhone']),
    emergencyContactRelation: _stringOrNull(
      profile['emergencyContactRelation'],
    ),
  );
}
