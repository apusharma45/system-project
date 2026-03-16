import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/core/domain/enums.dart';
import 'package:frontend_mobile/core/domain/models.dart';
import 'package:frontend_mobile/features/patient/data/repositories/patient_repositories.dart';
import 'package:frontend_mobile/features/patient/presentation/pages/profile_page.dart';

import '../../helpers/test_dependencies.dart';

void main() {
  testWidgets(
    'profile page renders personal priority and supports save/upload/remove',
    (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      final baseDeps = await makeTestDependencies();
      final profileRepo = _ProfileRepositorySpy();
      final deps = makeTestDependenciesWithSession(
        session: baseDeps.session,
        apiClient: baseDeps.apiClient,
        patientProfileRepository: profileRepo,
      );
      await tester.pumpWidget(
        wrapWithScope(
          dependencies: deps,
          child: MaterialApp(
            home: Scaffold(
              body: ProfilePage(
                avatarPicker: () async => AvatarUploadRequest(
                  bytes: Uint8List.fromList(const <int>[1, 2, 3]),
                  fileName: 'avatar.png',
                  mimeType: 'image/png',
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('My Profile'), findsOneWidget);
      expect(find.text('Personal Info'), findsOneWidget);
      expect(find.text('Medical Info'), findsOneWidget);
      expect(find.text('Emergency Contact'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);

      await tester.tap(find.byKey(const Key('avatar_edit_button')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('avatar_action_update')));
      await tester.pumpAndSettle();
      expect(profileRepo.uploadCount, 1);
      expect(find.text('Profile photo updated.'), findsOneWidget);

      await tester.tap(find.byKey(const Key('avatar_edit_button')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('avatar_action_remove')));
      await tester.pumpAndSettle();
      expect(profileRepo.removeCount, 1);
      expect(find.text('Profile photo removed.'), findsOneWidget);

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Full Name'),
        'Updated Patient',
      );
      final saveButton = find.widgetWithText(FilledButton, 'Save Profile');
      await tester.tap(saveButton);
      await tester.pumpAndSettle();
      expect(find.text('Profile updated successfully.'), findsOneWidget);
      expect(profileRepo.saveCount, 1);

      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('profile page stays scroll-safe on compact viewport', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(360, 640);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final deps = await makeTestDependencies();
    await tester.pumpWidget(
      wrapWithScope(
        dependencies: deps,
        child: const MaterialApp(home: Scaffold(body: ProfilePage())),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('profile_list')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

class _ProfileRepositorySpy implements PatientProfileRepository {
  int saveCount = 0;
  int uploadCount = 0;
  int removeCount = 0;
  PatientProfile _profile = const PatientProfile(
    id: 'u1',
    email: 'patient@example.com',
    role: UserRole.patient,
    fullName: 'Patient One',
    phone: '+15550001111',
    address: 'Demo Address',
    allergies: 'None',
    chronicConditions: 'None',
    currentMedications: 'None',
    emergencyContactName: 'Contact',
    emergencyContactPhone: '+15550002222',
    emergencyContactRelation: 'Sibling',
  );

  @override
  Future<PatientProfile> getMyProfile() async => _profile;

  @override
  Future<PatientProfile> removeMyAvatar() async {
    removeCount += 1;
    _profile = PatientProfile(
      id: _profile.id,
      email: _profile.email,
      role: _profile.role,
      fullName: _profile.fullName,
      phone: _profile.phone,
      address: _profile.address,
      allergies: _profile.allergies,
      chronicConditions: _profile.chronicConditions,
      currentMedications: _profile.currentMedications,
      emergencyContactName: _profile.emergencyContactName,
      emergencyContactPhone: _profile.emergencyContactPhone,
      emergencyContactRelation: _profile.emergencyContactRelation,
    );
    return _profile;
  }

  @override
  Future<PatientProfile> updateMyProfile(
    UpdatePatientProfileRequest request,
  ) async {
    saveCount += 1;
    _profile = PatientProfile(
      id: _profile.id,
      email: _profile.email,
      role: _profile.role,
      fullName: request.fullName ?? _profile.fullName,
      avatarUrl: _profile.avatarUrl,
      phone: request.phone ?? _profile.phone,
      address: request.address ?? _profile.address,
      allergies: request.allergies ?? _profile.allergies,
      chronicConditions:
          request.chronicConditions ?? _profile.chronicConditions,
      currentMedications:
          request.currentMedications ?? _profile.currentMedications,
      emergencyContactName:
          request.emergencyContactName ?? _profile.emergencyContactName,
      emergencyContactPhone:
          request.emergencyContactPhone ?? _profile.emergencyContactPhone,
      emergencyContactRelation:
          request.emergencyContactRelation ?? _profile.emergencyContactRelation,
    );
    return _profile;
  }

  @override
  Future<PatientProfile> uploadMyAvatar(AvatarUploadRequest request) async {
    uploadCount += 1;
    _profile = PatientProfile(
      id: _profile.id,
      email: _profile.email,
      role: _profile.role,
      fullName: _profile.fullName,
      avatarUrl: 'https://example.com/avatar.png',
      phone: _profile.phone,
      address: _profile.address,
      allergies: _profile.allergies,
      chronicConditions: _profile.chronicConditions,
      currentMedications: _profile.currentMedications,
      emergencyContactName: _profile.emergencyContactName,
      emergencyContactPhone: _profile.emergencyContactPhone,
      emergencyContactRelation: _profile.emergencyContactRelation,
    );
    return _profile;
  }
}
