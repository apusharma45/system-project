import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:frontend_mobile/core/api/api_client.dart';
import 'package:frontend_mobile/features/patient/data/repositories/api_patient_repositories.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';

void main() {
  test('patient profile repository maps get and patch payloads', () async {
    Map<String, dynamic>? patchPayload;
    String? multipartContentType;
    final client = MockClient((request) async {
      final path = request.url.path;
      if (path.endsWith('/patients/me/profile') && request.method == 'GET') {
        return http.Response(
          jsonEncode({
            'patient': {
              'id': 'u1',
              'email': 'patient@example.com',
              'role': 'PATIENT',
              'fullName': 'Patient One',
              'profile': {'allergies': 'Pollen'},
            },
          }),
          200,
        );
      }
      if (path.endsWith('/patients/me/profile') && request.method == 'PATCH') {
        patchPayload = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({
            'patient': {
              'id': 'u1',
              'email': 'patient@example.com',
              'role': 'PATIENT',
              'fullName': patchPayload?['fullName'] ?? 'Patient One',
              'phone': patchPayload?['phone'],
              'profile': {'allergies': patchPayload?['allergies']},
            },
          }),
          200,
        );
      }
      if (path.endsWith('/users/me/avatar') && request.method == 'PATCH') {
        multipartContentType = request.headers['content-type'];
        return http.Response(
          jsonEncode({
            'user': {'id': 'u1', 'avatarUrl': 'https://example.com/avatar.png'},
          }),
          200,
        );
      }
      if (path.endsWith('/users/me/avatar') && request.method == 'DELETE') {
        return http.Response(
          jsonEncode({
            'user': {'id': 'u1', 'avatarUrl': null},
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

    final repo = ApiPatientProfileRepository(apiClient: api);
    final profile = await repo.getMyProfile();
    expect(profile.allergies, 'Pollen');

    final updated = await repo.updateMyProfile(
      const UpdatePatientProfileRequest(
        fullName: 'Updated Name',
        phone: '+1555',
        allergies: 'Dust',
      ),
    );

    expect(patchPayload?['fullName'], 'Updated Name');
    expect(updated.fullName, 'Updated Name');

    final withAvatar = await repo.uploadMyAvatar(
      AvatarUploadRequest(
        bytes: Uint8List.fromList(const <int>[1, 2, 3, 4]),
        fileName: 'avatar.png',
        mimeType: 'image/png',
      ),
    );
    expect(multipartContentType, contains('multipart/form-data'));
    expect(withAvatar.email, 'patient@example.com');

    final withoutAvatar = await repo.removeMyAvatar();
    expect(withoutAvatar.avatarUrl, isNull);
  });
}
