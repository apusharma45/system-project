import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/state/session_controller.dart';
import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../patient/data/repositories/patient_repositories.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  static const _genderFieldKey = Key('signup_gender_field');
  static const _dobFieldKey = Key('signup_dob_field');
  static const _submitButtonKey = Key('signup_submit_button');

  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _dobController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  PatientRegistrationGender? _gender = PatientRegistrationGender.male;
  String? _errorMessage;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final deps = AppScope.of(context);
    final session = deps.session;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: <Color>[
              AppColors.authBackgroundTop,
              AppColors.authBackgroundBottom,
            ],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final compact = constraints.maxWidth < 360;
              final horizontalPadding = compact ? AppSpacing.lg : AppSpacing.xl;
              final cardPadding = compact ? AppSpacing.lg : AppSpacing.xl;
              return SingleChildScrollView(
                padding: EdgeInsets.symmetric(
                  horizontal: horizontalPadding,
                  vertical: AppSpacing.lg,
                ),
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 460),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          const SizedBox(height: AppSpacing.md),
                          Row(
                            children: <Widget>[
                              Container(
                                width: 48,
                                height: 48,
                                decoration: const BoxDecoration(
                                  color: AppColors.authPrimaryButton,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.favorite_rounded,
                                  color: Colors.white,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Text(
                                      'MedFlow',
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontFamily: AppTypography.figmaFamily,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    SizedBox(height: 2),
                                    Text(
                                      'Patient care made simple',
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontFamily: AppTypography.figmaFamily,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppSpacing.xxl),
                          const Text(
                            'Create Account',
                            style: TextStyle(
                              fontFamily: AppTypography.figmaFamily,
                              fontSize: 32,
                              fontWeight: FontWeight.w700,
                              height: 1.1,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          const Text(
                            'Create your patient account to get started.',
                            style: TextStyle(
                              fontFamily: AppTypography.figmaFamily,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xl),
                          Container(
                            padding: EdgeInsets.all(cardPadding),
                            decoration: BoxDecoration(
                              color: AppColors.authSurface,
                              borderRadius: AppRadius.xl,
                              boxShadow: const <BoxShadow>[
                                BoxShadow(
                                  color: Color(0x1A144B8A),
                                  blurRadius: 26,
                                  offset: Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Form(
                              key: _formKey,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  const Text(
                                    'Patient Sign Up',
                                    style: TextStyle(
                                      fontFamily: AppTypography.figmaFamily,
                                      fontSize: 24,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: AppSpacing.xs),
                                  const Text(
                                    'All fields below are required.',
                                    style: TextStyle(
                                      fontFamily: AppTypography.figmaFamily,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.authHint,
                                    ),
                                  ),
                                  const SizedBox(height: AppSpacing.lg),
                                  _labeledInput(
                                    label: 'Full Name',
                                    child: TextFormField(
                                      controller: _fullNameController,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter full name',
                                        prefixIcon: const Icon(
                                          Icons.person_outline_rounded,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        if ((value ?? '').trim().length < 2) {
                                          return 'Full name must be at least 2 characters';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Email Address',
                                    child: TextFormField(
                                      controller: _emailController,
                                      keyboardType: TextInputType.emailAddress,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter your email',
                                        prefixIcon: const Icon(
                                          Icons.email_outlined,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        final v = (value ?? '').trim();
                                        if (v.isEmpty || !v.contains('@')) {
                                          return 'Enter a valid email address';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Password',
                                    child: TextFormField(
                                      controller: _passwordController,
                                      obscureText: _obscurePassword,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter password',
                                        prefixIcon: const Icon(
                                          Icons.lock_outline_rounded,
                                          size: 20,
                                        ),
                                        suffixIcon: IconButton(
                                          onPressed: () {
                                            setState(() {
                                              _obscurePassword =
                                                  !_obscurePassword;
                                            });
                                          },
                                          icon: Icon(
                                            _obscurePassword
                                                ? Icons.visibility_outlined
                                                : Icons.visibility_off_outlined,
                                          ),
                                        ),
                                      ),
                                      validator: (value) {
                                        if ((value ?? '').length < 6) {
                                          return 'Password must be at least 6 characters';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Confirm Password',
                                    child: TextFormField(
                                      controller: _confirmPasswordController,
                                      obscureText: _obscureConfirmPassword,
                                      decoration: _inputDecoration(
                                        hintText: 'Re-enter password',
                                        prefixIcon: const Icon(
                                          Icons.lock_outline_rounded,
                                          size: 20,
                                        ),
                                        suffixIcon: IconButton(
                                          onPressed: () {
                                            setState(() {
                                              _obscureConfirmPassword =
                                                  !_obscureConfirmPassword;
                                            });
                                          },
                                          icon: Icon(
                                            _obscureConfirmPassword
                                                ? Icons.visibility_outlined
                                                : Icons.visibility_off_outlined,
                                          ),
                                        ),
                                      ),
                                      validator: (value) {
                                        if (value != _passwordController.text) {
                                          return 'Passwords do not match';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Phone',
                                    child: TextFormField(
                                      controller: _phoneController,
                                      keyboardType: TextInputType.phone,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter phone',
                                        prefixIcon: const Icon(
                                          Icons.phone_outlined,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        if ((value ?? '').trim().length < 5) {
                                          return 'Phone is required';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Address',
                                    child: TextFormField(
                                      controller: _addressController,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter address',
                                        prefixIcon: const Icon(
                                          Icons.home_outlined,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        if ((value ?? '').trim().length < 5) {
                                          return 'Address is required';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'Gender',
                                    child:
                                        DropdownButtonFormField<
                                          PatientRegistrationGender
                                        >(
                                          key: _genderFieldKey,
                                          isExpanded: true,
                                          initialValue: _gender,
                                          decoration: _inputDecoration(
                                            hintText: 'Select gender',
                                            prefixIcon: const Icon(
                                              Icons.wc_rounded,
                                              size: 20,
                                            ),
                                          ),
                                          items: PatientRegistrationGender
                                              .values
                                              .map((value) {
                                                return DropdownMenuItem<
                                                  PatientRegistrationGender
                                                >(
                                                  value: value,
                                                  child: Text(
                                                    _genderLabel(value),
                                                    style: const TextStyle(
                                                      fontFamily: AppTypography
                                                          .figmaFamily,
                                                    ),
                                                  ),
                                                );
                                              })
                                              .toList(),
                                          onChanged: (value) {
                                            setState(() => _gender = value);
                                          },
                                          validator: (value) {
                                            if (value == null) {
                                              return 'Gender is required';
                                            }
                                            return null;
                                          },
                                        ),
                                  ),
                                  _labeledInput(
                                    label: 'Date of Birth',
                                    child: TextFormField(
                                      key: _dobFieldKey,
                                      controller: _dobController,
                                      keyboardType: TextInputType.datetime,
                                      decoration: _inputDecoration(
                                        hintText: 'YYYY-MM-DD',
                                        prefixIcon: const Icon(
                                          Icons.calendar_today_outlined,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        if (_parseDate(value) == null) {
                                          return 'Date of birth is required (YYYY-MM-DD)';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  if (_errorMessage != null)
                                    Padding(
                                      padding: const EdgeInsets.only(
                                        top: AppSpacing.sm,
                                      ),
                                      child: Text(
                                        _errorMessage!,
                                        style: const TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          color: AppColors.danger,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  const SizedBox(height: AppSpacing.lg),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 52,
                                    child: FilledButton(
                                      key: _submitButtonKey,
                                      style: FilledButton.styleFrom(
                                        backgroundColor:
                                            AppColors.authPrimaryButton,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            16,
                                          ),
                                        ),
                                        textStyle: const TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      onPressed:
                                          _isSubmitting ||
                                              session.status ==
                                                  AuthStatus.loading
                                          ? null
                                          : () async {
                                              final isValid =
                                                  _formKey.currentState
                                                      ?.validate() ??
                                                  false;
                                              if (!isValid) return;
                                              await _submit(context);
                                            },
                                      child: Text(
                                        _isSubmitting
                                            ? 'Creating...'
                                            : 'Create account',
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xl),
                          Center(
                            child: Wrap(
                              alignment: WrapAlignment.center,
                              children: <Widget>[
                                const Text(
                                  'Already have an account?',
                                  style: TextStyle(
                                    fontFamily: AppTypography.figmaFamily,
                                    fontSize: 14,
                                    color: AppColors.textSecondary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                TextButton(
                                  onPressed: () =>
                                      context.push(AppRoutes.login),
                                  style: TextButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 6,
                                      vertical: 0,
                                    ),
                                    minimumSize: Size.zero,
                                    tapTargetSize:
                                        MaterialTapTargetSize.shrinkWrap,
                                  ),
                                  child: const Text(
                                    'Sign in',
                                    style: TextStyle(
                                      fontFamily: AppTypography.figmaFamily,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.authLink,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: AppSpacing.lg),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Future<void> _submit(BuildContext context) async {
    final deps = AppScope.of(context);
    final authRepository = deps.authRepository;
    final session = deps.session;

    setState(() {
      _errorMessage = null;
      _isSubmitting = true;
    });

    try {
      final token = await authRepository.registerPatient(
        PatientSignUpRequest(
          fullName: _fullNameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text,
          phone: _phoneController.text.trim(),
          address: _addressController.text.trim(),
          gender: _gender!,
          dateOfBirth: _parseDate(_dobController.text)!,
        ),
      );
      await session.authenticateWithToken(token);
    } catch (error) {
      setState(() {
        _errorMessage = error is ApiException
            ? error.message
            : 'Signup failed. Please try again.';
      });
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  DateTime? _parseDate(String? value) {
    final input = (value ?? '').trim();
    if (input.isEmpty) return null;
    final match = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$').firstMatch(input);
    if (match == null) return null;
    final year = int.tryParse(match.group(1)!);
    final month = int.tryParse(match.group(2)!);
    final day = int.tryParse(match.group(3)!);
    if (year == null || month == null || day == null) return null;
    try {
      final parsed = DateTime(year, month, day);
      if (parsed.year != year || parsed.month != month || parsed.day != day) {
        return null;
      }
      if (parsed.isAfter(DateTime.now())) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  Widget _labeledInput({required String label, required Widget child}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            label,
            style: const TextStyle(
              fontFamily: AppTypography.figmaFamily,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          child,
        ],
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hintText,
    Widget? prefixIcon,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: const TextStyle(
        fontFamily: AppTypography.figmaFamily,
        color: AppColors.authHint,
        fontWeight: FontWeight.w500,
      ),
      prefixIcon: prefixIcon,
      suffixIcon: suffixIcon,
      filled: true,
      fillColor: AppColors.authInputFill,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: 16,
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.authInputBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.authInputBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(
          color: AppColors.authInputFocus,
          width: 1.4,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.danger),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.danger, width: 1.4),
      ),
    );
  }

  String _genderLabel(PatientRegistrationGender gender) {
    switch (gender) {
      case PatientRegistrationGender.male:
        return 'Male';
      case PatientRegistrationGender.female:
        return 'Female';
      case PatientRegistrationGender.other:
        return 'Other';
    }
  }
}
