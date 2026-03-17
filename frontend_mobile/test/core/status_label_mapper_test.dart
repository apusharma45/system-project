import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/features/patient/domain/status_label_mapper.dart';

void main() {
  test('backend enum string parsing supports known values', () {
    expect(appointmentStatusLabelFromRaw('REQUESTED'), 'Requested');
    expect(appointmentStatusLabelFromRaw('IN_VISIT'), 'In Visit');
    expect(
      notificationTypeLabelFromRaw('LAB_RESULT_UPLOADED'),
      'Lab Result Uploaded',
    );
  });

  test('unknown backend enum value gets readable fallback label', () {
    expect(
      appointmentStatusLabelFromRaw('DONE_UNKNOWN'),
      'Unknown (DONE_UNKNOWN)',
    );
    expect(
      notificationTypeLabelFromRaw('APPOINTMENT_CONFIRMED'),
      'Unknown (APPOINTMENT_CONFIRMED)',
    );
  });
}
