import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/api/user_facing_error.dart';
import '../../../../core/domain/models.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/patient_ui.dart';
import '../../data/repositories/patient_repositories.dart';

typedef AvatarPicker = Future<AvatarUploadRequest?> Function();

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key, this.avatarPicker = _pickAvatarFromGallery});

  final AvatarPicker avatarPicker;

  static Future<AvatarUploadRequest?> _pickAvatarFromGallery() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1600,
      imageQuality: 90,
    );
    if (image == null) return null;
    return AvatarUploadRequest(
      bytes: await image.readAsBytes(),
      fileName: image.name,
      mimeType: image.mimeType ?? 'image/jpeg',
    );
  }

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _fullName = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _allergies = TextEditingController();
  final _chronic = TextEditingController();
  final _medications = TextEditingController();
  final _ecName = TextEditingController();
  final _ecPhone = TextEditingController();
  final _ecRelation = TextEditingController();
  final _passwordEmail = TextEditingController();
  final _passwordCode = TextEditingController();
  final _newPassword = TextEditingController();
  final _confirmPassword = TextEditingController();

  Future<PatientProfile>? _future;
  bool _saving = false;
  bool _avatarUpdating = false;
  bool _requestingPasswordCode = false;
  bool _changingPassword = false;
  String? _status;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= _load();
  }

  @override
  void dispose() {
    _fullName.dispose();
    _phone.dispose();
    _address.dispose();
    _allergies.dispose();
    _chronic.dispose();
    _medications.dispose();
    _ecName.dispose();
    _ecPhone.dispose();
    _ecRelation.dispose();
    _passwordEmail.dispose();
    _passwordCode.dispose();
    _newPassword.dispose();
    _confirmPassword.dispose();
    super.dispose();
  }

  PatientProfileRepository get _repo =>
      AppScope.of(context).patientProfileRepository;

  Future<PatientProfile> _load() async {
    final profile = await _repo.getMyProfile();
    _fullName.text = profile.fullName ?? '';
    _phone.text = profile.phone ?? '';
    _address.text = profile.address ?? '';
    _allergies.text = profile.allergies ?? '';
    _chronic.text = profile.chronicConditions ?? '';
    _medications.text = profile.currentMedications ?? '';
    _ecName.text = profile.emergencyContactName ?? '';
    _ecPhone.text = profile.emergencyContactPhone ?? '';
    _ecRelation.text = profile.emergencyContactRelation ?? '';
    _passwordEmail.text = profile.email;
    return profile;
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _saving = true;
      _status = null;
    });
    try {
      final updated = await _repo.updateMyProfile(
        UpdatePatientProfileRequest(
          fullName: _fullName.text.trim(),
          phone: _phone.text.trim(),
          address: _address.text.trim(),
          allergies: _allergies.text.trim(),
          chronicConditions: _chronic.text.trim(),
          currentMedications: _medications.text.trim(),
          emergencyContactName: _ecName.text.trim(),
          emergencyContactPhone: _ecPhone.text.trim(),
          emergencyContactRelation: _ecRelation.text.trim(),
        ),
      );
      setState(() {
        _future = Future.value(updated);
        _status = 'Profile updated successfully.';
      });
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to save profile. Please try again.',
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  Future<void> _uploadAvatar() async {
    final request = await widget.avatarPicker();
    if (request == null) return;
    setState(() {
      _avatarUpdating = true;
      _status = null;
    });
    try {
      final updated = await _repo.uploadMyAvatar(request);
      setState(() {
        _future = Future.value(updated);
        _status = 'Profile photo updated.';
      });
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to update profile photo.',
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _avatarUpdating = false);
      }
    }
  }

  Future<void> _removeAvatar() async {
    setState(() {
      _avatarUpdating = true;
      _status = null;
    });
    try {
      final updated = await _repo.removeMyAvatar();
      setState(() {
        _future = Future.value(updated);
        _status = 'Profile photo removed.';
      });
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to remove profile photo.',
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _avatarUpdating = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PatientProfile>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Text(
              userFacingErrorMessage(
                snapshot.error,
                fallback: 'Unable to load profile right now.',
              ),
            ),
          );
        }

        final profile = snapshot.data!;
        return SafeArea(
          child: ListView(
            key: const Key('profile_list'),
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: <Widget>[
              PatientGradientHeader(
                title: 'My Profile',
                subtitle: 'Keep your personal and health details up to date.',
                footer: _ProfileHeaderFooter(
                  profile: profile,
                  loading: _avatarUpdating,
                  onEditAvatar: () => _openAvatarActions(profile),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    PatientSectionCard(
                      child: _SectionFields(
                        title: 'Personal Info',
                        emphasized: true,
                        children: <Widget>[
                          TextFormField(
                            controller: _fullName,
                            decoration: const InputDecoration(
                              labelText: 'Full Name',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _phone,
                            decoration: const InputDecoration(
                              labelText: 'Phone',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _address,
                            decoration: const InputDecoration(
                              labelText: 'Address',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    PatientSectionCard(
                      child: _SectionFields(
                        title: 'Medical Info',
                        children: <Widget>[
                          TextFormField(
                            controller: _allergies,
                            decoration: const InputDecoration(
                              labelText: 'Allergies',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _chronic,
                            decoration: const InputDecoration(
                              labelText: 'Chronic Conditions',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _medications,
                            decoration: const InputDecoration(
                              labelText: 'Current Medications',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    PatientSectionCard(
                      child: _SectionFields(
                        title: 'Emergency Contact',
                        children: <Widget>[
                          TextFormField(
                            controller: _ecName,
                            decoration: const InputDecoration(
                              labelText: 'Emergency Contact Name',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _ecPhone,
                            decoration: const InputDecoration(
                              labelText: 'Emergency Contact Phone',
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          TextFormField(
                            controller: _ecRelation,
                            decoration: const InputDecoration(
                              labelText: 'Emergency Contact Relation',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    PatientSectionCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          const Text(
                            'Settings',
                            style: TextStyle(
                              fontFamily: AppTypography.figmaFamily,
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          _SettingsTile(
                            key: const Key('profile_settings_notifications'),
                            icon: Icons.notifications_outlined,
                            title: 'Notifications',
                            subtitle: 'View and manage your alerts',
                            onTap: () => context.push(AppRoutes.notifications),
                          ),
                          _SettingsTile(
                            key: const Key('profile_settings_help'),
                            icon: Icons.help_outline_rounded,
                            title: 'Help and Support',
                            subtitle: 'Get help with app usage',
                            onTap: _openHelpSupport,
                          ),
                          _SettingsTile(
                            key: const Key('profile_settings_security'),
                            icon: Icons.shield_outlined,
                            title: 'Security and Privacy',
                            subtitle: 'Change password and account access',
                            onTap: _openSecurityPrivacy,
                          ),
                          _SettingsTile(
                            key: const Key('profile_settings_logout'),
                            icon: Icons.logout_rounded,
                            title: 'Logout',
                            subtitle: 'Sign out from this device',
                            danger: true,
                            onTap: _logout,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    if (_status != null) ...<Widget>[
                      PatientStatusBanner(
                        message: _status!,
                        isError: _status!.startsWith('Failed'),
                      ),
                      const SizedBox(height: AppSpacing.md),
                    ],
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: _saving || _avatarUpdating ? null : _save,
                        style: FilledButton.styleFrom(
                          minimumSize: const Size.fromHeight(52),
                          backgroundColor: AppColors.primary,
                        ),
                        child: Text(_saving ? 'Saving...' : 'Save Profile'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _openHelpSupport() async {
    await showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) => const SafeArea(
        child: Padding(
          padding: EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Help and Support',
                style: TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: AppSpacing.sm),
              Text(
                'Contact support@medflow.com for account help or report app issues.',
                style: TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _openSecurityPrivacy() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: AppSpacing.lg,
          right: AppSpacing.lg,
          top: AppSpacing.md,
          bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.lg,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Text(
                'Security and Privacy',
                style: TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              const Text(
                'Change Password',
                style: TextStyle(
                  fontFamily: AppTypography.figmaFamily,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                key: const Key('settings_email_input'),
                controller: _passwordEmail,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  key: const Key('settings_request_code_button'),
                  onPressed: _requestingPasswordCode
                      ? null
                      : _requestPasswordCode,
                  child: Text(
                    _requestingPasswordCode
                        ? 'Requesting code...'
                        : 'Request Code',
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                key: const Key('settings_code_input'),
                controller: _passwordCode,
                decoration: const InputDecoration(
                  labelText: 'Reset Code',
                  prefixIcon: Icon(Icons.key_outlined),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                key: const Key('settings_new_password_input'),
                controller: _newPassword,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'New Password',
                  prefixIcon: Icon(Icons.lock_outline_rounded),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                key: const Key('settings_confirm_password_input'),
                controller: _confirmPassword,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirm Password',
                  prefixIcon: Icon(Icons.lock_outline_rounded),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  key: const Key('settings_change_password_button'),
                  onPressed: _changingPassword ? null : _changePassword,
                  child: Text(
                    _changingPassword
                        ? 'Changing password...'
                        : 'Change Password',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _requestPasswordCode() async {
    final email = _passwordEmail.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _status = 'Enter a valid email address');
      return;
    }
    setState(() {
      _requestingPasswordCode = true;
      _status = null;
    });
    try {
      await AppScope.of(context).authRepository.requestPasswordReset(
        ForgotPasswordRequest(email: email),
      );
      setState(() => _status = 'Reset code sent to your email.');
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to request code.',
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _requestingPasswordCode = false);
      }
    }
  }

  Future<void> _changePassword() async {
    final router = GoRouter.of(context);
    final deps = AppScope.of(context);
    final email = _passwordEmail.text.trim();
    final code = _passwordCode.text.trim();
    final pass = _newPassword.text;
    final confirm = _confirmPassword.text;
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _status = 'Enter a valid email address');
      return;
    }
    if (code.isEmpty) {
      setState(() => _status = 'Reset code is required');
      return;
    }
    if (pass.length < 6) {
      setState(() => _status = 'Password must be at least 6 characters');
      return;
    }
    if (pass != confirm) {
      setState(() => _status = 'Passwords do not match');
      return;
    }

    setState(() {
      _changingPassword = true;
      _status = null;
    });
    try {
      await deps.authRepository.resetPassword(
        ResetPasswordRequest(email: email, resetCode: code, newPassword: pass),
      );
      await deps.session.logout();
      if (!mounted) return;
      router.go(AppRoutes.login);
    } catch (error) {
      setState(
        () => _status = userFacingErrorMessage(
          error,
          fallback: 'Failed to change password.',
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _changingPassword = false);
      }
    }
  }

  Future<void> _logout() async {
    final router = GoRouter.of(context);
    final session = AppScope.of(context).session;
    await session.logout();
    if (!mounted) return;
    router.go(AppRoutes.login);
  }

  Future<void> _openAvatarActions(PatientProfile profile) async {
    if (_avatarUpdating) return;
    final action = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              ListTile(
                key: const Key('avatar_action_update'),
                leading: const Icon(Icons.photo_library_outlined),
                title: const Text('Update photo'),
                onTap: () => Navigator.of(context).pop('update'),
              ),
              ListTile(
                key: const Key('avatar_action_remove'),
                leading: const Icon(Icons.delete_outline),
                title: const Text('Remove photo'),
                enabled: profile.avatarUrl != null,
                onTap: profile.avatarUrl == null
                    ? null
                    : () => Navigator.of(context).pop('remove'),
              ),
              ListTile(
                key: const Key('avatar_action_cancel'),
                leading: const Icon(Icons.close),
                title: const Text('Cancel'),
                onTap: () => Navigator.of(context).pop('cancel'),
              ),
            ],
          ),
        );
      },
    );
    if (action == 'update') {
      await _uploadAvatar();
      return;
    }
    if (action == 'remove') {
      await _removeAvatar();
    }
  }
}

class _ProfileHeaderFooter extends StatelessWidget {
  const _ProfileHeaderFooter({
    required this.profile,
    required this.loading,
    required this.onEditAvatar,
  });

  final PatientProfile profile;
  final bool loading;
  final VoidCallback onEditAvatar;

  @override
  Widget build(BuildContext context) {
    final initial =
        ((profile.fullName ?? profile.email).trim().isEmpty
                ? 'P'
                : (profile.fullName ?? profile.email).trim().substring(0, 1))
            .toUpperCase();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Stack(
              clipBehavior: Clip.none,
              children: <Widget>[
                CircleAvatar(
                  radius: 32,
                  backgroundColor: const Color(0x1FFFFFFF),
                  child: CircleAvatar(
                    radius: 29,
                    backgroundColor: Colors.white,
                    backgroundImage: profile.avatarUrl == null
                        ? null
                        : NetworkImage(profile.avatarUrl!),
                    onBackgroundImageError: profile.avatarUrl == null
                        ? null
                        : (Object exception, StackTrace? stackTrace) {},
                    child: profile.avatarUrl == null
                        ? Text(
                            initial,
                            style: const TextStyle(
                              fontFamily: AppTypography.figmaFamily,
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                            ),
                          )
                        : null,
                  ),
                ),
                Positioned(
                  right: -4,
                  bottom: -4,
                  child: Material(
                    color: Colors.white,
                    shape: const CircleBorder(),
                    child: InkWell(
                      key: const Key('avatar_edit_button'),
                      customBorder: const CircleBorder(),
                      onTap: loading ? null : onEditAvatar,
                      child: Padding(
                        padding: const EdgeInsets.all(6),
                        child: Icon(
                          loading ? Icons.hourglass_top : Icons.edit_outlined,
                          size: 18,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    profile.fullName ?? 'Patient',
                    style: const TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    profile.email,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: AppTypography.figmaFamily,
                      fontSize: 12,
                      color: Color(0xE6FFFFFF),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        PatientTopChip(text: profile.role.name.toUpperCase()),
      ],
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.danger = false,
    super.key,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final color = danger ? AppColors.danger : AppColors.textPrimary;
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: color),
      title: Text(
        title,
        style: TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(
          fontFamily: AppTypography.figmaFamily,
          fontSize: 12,
        ),
      ),
      trailing: const Icon(Icons.chevron_right_rounded),
      onTap: onTap,
    );
  }
}

class _SectionFields extends StatelessWidget {
  const _SectionFields({
    required this.title,
    required this.children,
    this.emphasized = false,
  });

  final String title;
  final List<Widget> children;
  final bool emphasized;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: emphasized ? const Color(0xFFF3F8FF) : Colors.transparent,
        borderRadius: AppRadius.md,
        border: Border.all(
          color: emphasized ? const Color(0xFFCEE2FF) : Colors.transparent,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...children,
        ],
      ),
    );
  }
}
