import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../patient/data/repositories/patient_repositories.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  static const _requestCodeKey = Key('forgot_request_code_button');
  static const _resetPasswordKey = Key('forgot_reset_password_button');

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;
  bool _requestingCode = false;
  bool _resettingPassword = false;
  String? _errorMessage;
  String? _successMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final deps = AppScope.of(context);

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
              final horizontalPadding = compact
                  ? AppSpacing.lg
                  : AppSpacing.xl;
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
                            'Reset Password',
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
                            'Request a reset code and set a new password.',
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
                                  const SizedBox(height: AppSpacing.sm),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton(
                                      key: _requestCodeKey,
                                      onPressed: _requestingCode
                                          ? null
                                          : () async {
                                              final email = _emailController.text
                                                  .trim();
                                              if (email.isEmpty ||
                                                  !email.contains('@')) {
                                                setState(() {
                                                  _errorMessage =
                                                      'Enter a valid email address';
                                                  _successMessage = null;
                                                });
                                                return;
                                              }
                                              setState(() {
                                                _requestingCode = true;
                                                _errorMessage = null;
                                                _successMessage = null;
                                              });
                                              try {
                                                await deps.authRepository
                                                    .requestPasswordReset(
                                                      ForgotPasswordRequest(
                                                        email: email,
                                                      ),
                                                    );
                                                setState(() {
                                                  _successMessage =
                                                      'Reset code sent. Check your email.';
                                                });
                                              } catch (error) {
                                                setState(() {
                                                  _errorMessage = error
                                                          is ApiException
                                                      ? error.message
                                                      : 'Failed to request reset code';
                                                });
                                              } finally {
                                                if (mounted) {
                                                  setState(() {
                                                    _requestingCode = false;
                                                  });
                                                }
                                              }
                                            },
                                      child: Text(
                                        _requestingCode
                                            ? 'Requesting code...'
                                            : 'Request reset code',
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: AppSpacing.lg),
                                  _labeledInput(
                                    label: 'Reset Code',
                                    child: TextFormField(
                                      controller: _codeController,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter reset code',
                                        prefixIcon: const Icon(
                                          Icons.key_outlined,
                                          size: 20,
                                        ),
                                      ),
                                      validator: (value) {
                                        if ((value ?? '').trim().isEmpty) {
                                          return 'Reset code is required';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                  _labeledInput(
                                    label: 'New Password',
                                    child: TextFormField(
                                      controller: _newPasswordController,
                                      obscureText: _obscureNewPassword,
                                      decoration: _inputDecoration(
                                        hintText: 'Enter new password',
                                        prefixIcon: const Icon(
                                          Icons.lock_outline_rounded,
                                          size: 20,
                                        ),
                                        suffixIcon: IconButton(
                                          onPressed: () {
                                            setState(() {
                                              _obscureNewPassword =
                                                  !_obscureNewPassword;
                                            });
                                          },
                                          icon: Icon(
                                            _obscureNewPassword
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
                                    label: 'Confirm New Password',
                                    child: TextFormField(
                                      controller: _confirmPasswordController,
                                      obscureText: _obscureConfirmPassword,
                                      decoration: _inputDecoration(
                                        hintText: 'Re-enter new password',
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
                                        if (value !=
                                            _newPasswordController.text) {
                                          return 'Passwords do not match';
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
                                  if (_successMessage != null)
                                    Padding(
                                      padding: const EdgeInsets.only(
                                        top: AppSpacing.sm,
                                      ),
                                      child: Text(
                                        _successMessage!,
                                        style: const TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          color: AppColors.green,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  const SizedBox(height: AppSpacing.lg),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 52,
                                    child: FilledButton(
                                      key: _resetPasswordKey,
                                      style: FilledButton.styleFrom(
                                        backgroundColor:
                                            AppColors.authPrimaryButton,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(16),
                                        ),
                                        textStyle: const TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      onPressed: _resettingPassword
                                          ? null
                                          : () async {
                                              final isValid =
                                                  _formKey.currentState
                                                      ?.validate() ??
                                                  false;
                                              if (!isValid) return;
                                              setState(() {
                                                _resettingPassword = true;
                                                _errorMessage = null;
                                                _successMessage = null;
                                              });
                                              try {
                                                await deps.authRepository
                                                    .resetPassword(
                                                      ResetPasswordRequest(
                                                        email:
                                                            _emailController.text
                                                                .trim(),
                                                        resetCode:
                                                            _codeController.text
                                                                .trim(),
                                                        newPassword:
                                                            _newPasswordController
                                                                .text,
                                                      ),
                                                    );
                                                if (!mounted) return;
                                                GoRouter.of(
                                                  this.context,
                                                ).go(AppRoutes.login);
                                              } catch (error) {
                                                setState(() {
                                                  _errorMessage = error
                                                          is ApiException
                                                      ? error.message
                                                      : 'Failed to reset password';
                                                });
                                              } finally {
                                                if (mounted) {
                                                  setState(
                                                    () =>
                                                        _resettingPassword = false,
                                                  );
                                                }
                                              }
                                            },
                                      child: Text(
                                        _resettingPassword
                                            ? 'Resetting...'
                                            : 'Reset password',
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
                                  'Remember your password?',
                                  style: TextStyle(
                                    fontFamily: AppTypography.figmaFamily,
                                    fontSize: 14,
                                    color: AppColors.textSecondary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                TextButton(
                                  onPressed: () => context.go(AppRoutes.login),
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
        borderSide: const BorderSide(color: AppColors.authInputFocus, width: 1.4),
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
}
