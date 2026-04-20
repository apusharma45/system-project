import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/features/patient/data/repositories/api_patient_repositories.dart';

void main() {
  test('doctors and appointments repositories map backend payloads', () async {
    final client = MockClient((request) async {
      final path = request.url.path;
      if (path.endsWith('/users/doctors')) {
        return http.Response(
          jsonEncode([
            {
              'id': 'd1',
              'email': 'doctor@example.com',
              'role': 'DOCTOR',
              'fullName': 'Dr. One',
            },
          ]),
          200,
        );
      }
      if (path.endsWith('/appointments/me')) {
        return http.Response(
          jsonEncode([
            {
              'id': 'a1',
              'patientId': 'p1',
              'doctorId': 'd1',
              'status': 'CONFIRMED',
              'reason': 'Headache',
              'doctorSnapshot': {
                'fullName': 'Dr. One',
                'email': 'doctor@example.com',
              },
            },
          ]),
          200,
        );
      }
      if (path.endsWith('/users/doctors/d1')) {
        return http.Response(
          jsonEncode({
            'doctor': {
              'id': 'd1',
              'email': 'doctor@example.com',
              'role': 'DOCTOR',
              'fullName': 'Dr. One',
              'specialization': 'Cardiology',
              'yearsOfExperience': 12,
              'degrees': ['MBBS', 'MD'],
              'about': 'Heart specialist',
              'clinicName': 'Heart Care',
              'clinicAddress': 'Main Road',
              'clinicPhone': '+15550001111',
              'availableTimeSlots': [
                {
                  'day': 'Mon',
                  'startTime': '10:00 AM',
                  'endTime': '12:00 PM',
                },
              ],
            },
          }),
          200,
        );
      }
      return http.Response('{}', 200);
    });

    final api = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => 'token',
      httpClient: client,
    );

    final doctorsRepo = ApiDoctorsRepository(apiClient: api);
    final appointmentsRepo = ApiAppointmentsRepository(apiClient: api);

    final doctors = await doctorsRepo.listDoctors();
    final appointments = await appointmentsRepo.listMyAppointments();
    final doctorDetails = await doctorsRepo.getDoctorDetailsById('d1');

    expect(doctors.first.fullName, 'Dr. One');
    expect(appointments.first.reason, 'Headache');
    expect(appointments.first.doctorSnapshot?.fullName, 'Dr. One');
    expect(doctorDetails?.specialization, 'Cardiology');
    expect(doctorDetails?.availableTimeSlots.first.label, 'Mon 10:00 AM 12:00 PM');
  });
}
