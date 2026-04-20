import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/features/patient/data/repositories/api_patient_repositories.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

void main() {
  test('registerPatient maps patient payload to backend contract', () async {
    Map<String, dynamic>? capturedPayload;

    final client = MockClient((request) async {
      capturedPayload = jsonDecode(request.body) as Map<String, dynamic>;
      return http.Response(
        jsonEncode(<String, dynamic>{'access_token': 'registered-token'}),
        201,
      );
    });
    final apiClient = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => null,
      httpClient: client,
    );
    final repository = ApiAuthRepository(apiClient: apiClient);

    final token = await repository.registerPatient(
      PatientSignUpRequest(
        fullName: 'New Patient',
        email: 'new.patient@example.com',
        password: 'secret123',
        phone: '+15550001234',
        address: 'Dhaka',
        gender: PatientRegistrationGender.female,
        dateOfBirth: DateTime(2000, 1, 1),
      ),
    );

    expect(token, 'registered-token');
    expect(capturedPayload, isNotNull);
    expect(capturedPayload!['fullName'], 'New Patient');
    expect(capturedPayload!['email'], 'new.patient@example.com');
    expect(capturedPayload!['password'], 'secret123');
    expect(capturedPayload!['phone'], '+15550001234');
    expect(capturedPayload!['address'], 'Dhaka');
    expect(capturedPayload!['role'], 'PATIENT');
    expect(capturedPayload!['patientProfile']['gender'], 'FEMALE');
    expect(capturedPayload!['patientProfile']['dateOfBirth'], '2000-01-01');
  });

  test('requestPasswordReset maps email payload and endpoint', () async {
    String? requestPath;
    Map<String, dynamic>? payload;

    final client = MockClient((request) async {
      requestPath = request.url.path;
      payload = jsonDecode(request.body) as Map<String, dynamic>;
      return http.Response('{}', 200);
    });
    final apiClient = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => null,
      httpClient: client,
    );
    final repository = ApiAuthRepository(apiClient: apiClient);

    await repository.requestPasswordReset(
      const ForgotPasswordRequest(email: 'patient@example.com'),
    );

    expect(requestPath, '/auth/forgot-password');
    expect(payload, <String, dynamic>{'email': 'patient@example.com'});
  });

  test('resetPassword maps payload and endpoint', () async {
    String? requestPath;
    Map<String, dynamic>? payload;

    final client = MockClient((request) async {
      requestPath = request.url.path;
      payload = jsonDecode(request.body) as Map<String, dynamic>;
      return http.Response('{}', 200);
    });
    final apiClient = ApiClient(
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => null,
      httpClient: client,
    );
    final repository = ApiAuthRepository(apiClient: apiClient);

    await repository.resetPassword(
      const ResetPasswordRequest(
        email: 'patient@example.com',
        resetCode: 'ABC123',
        newPassword: 'secret123',
      ),
    );

    expect(requestPath, '/auth/reset-password');
    expect(payload, <String, dynamic>{
      'email': 'patient@example.com',
      'resetCode': 'ABC123',
      'newPassword': 'secret123',
    });
  });
}
