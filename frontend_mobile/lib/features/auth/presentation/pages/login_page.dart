import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_scope.dart';
import '../../../../app/router/app_routes.dart';
import '../../../../app/state/session_controller.dart';
import '../../../../core/theme/app_tokens.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final session = AppScope.of(context).session;

    return AnimatedBuilder(
      animation: session,
      builder: (context, _) {
        final isLoading = session.status == AuthStatus.loading;
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
                  return SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.xl,
                      vertical: AppSpacing.lg,
                    ),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: constraints.maxHeight,
                      ),
                      child: Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 420),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              const SizedBox(height: AppSpacing.lg),
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
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          'MedFlow',
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontFamily:
                                                AppTypography.figmaFamily,
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
                                            fontFamily:
                                                AppTypography.figmaFamily,
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
                                'Welcome Back',
                                style: TextStyle(
                                  fontFamily: AppTypography.figmaFamily,
                                  fontSize: 34,
                                  fontWeight: FontWeight.w700,
                                  height: 1.12,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              const Text(
                                'Sign in to continue your care journey.',
                                style: TextStyle(
                                  fontFamily: AppTypography.figmaFamily,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xl),
                              Container(
                                padding: const EdgeInsets.all(AppSpacing.xl),
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
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      const Text(
                                        'Sign in',
                                        style: TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 24,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: AppSpacing.xs),
                                      const Text(
                                        'Use your patient account credentials.',
                                        style: TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                          color: AppColors.authHint,
                                        ),
                                      ),
                                      const SizedBox(height: AppSpacing.lg),
                                      const Text(
                                        'Email Address',
                                        style: TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: AppSpacing.sm),
                                      TextFormField(
                                        controller: _emailController,
                                        keyboardType:
                                            TextInputType.emailAddress,
                                        decoration: _inputDecoration(
                                          hintText: 'Enter your email',
                                          prefixIcon: const Icon(
                                            Icons.email_outlined,
                                            size: 20,
                                          ),
                                        ),
                                        validator: (value) {
                                          final v = value?.trim() ?? '';
                                          if (v.isEmpty || !v.contains('@')) {
                                            return 'Enter a valid email address';
                                          }
                                          return null;
                                        },
                                      ),
                                      const SizedBox(height: AppSpacing.md),
                                      const Text(
                                        'Password',
                                        style: TextStyle(
                                          fontFamily: AppTypography.figmaFamily,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: AppSpacing.sm),
                                      TextFormField(
                                        controller: _passwordController,
                                        obscureText: _obscurePassword,
                                        decoration: _inputDecoration(
                                          hintText: 'Enter your password',
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
                                                  : Icons
                                                        .visibility_off_outlined,
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
                                      const SizedBox(height: AppSpacing.sm),
                                      Align(
                                        alignment: Alignment.centerRight,
                                        child: TextButton(
                                          key: const Key('login_forgot_link'),
                                          onPressed: () => context.push(
                                            AppRoutes.forgotPassword,
                                          ),
                                          child: const Text(
                                            'Forgot password?',
                                            style: TextStyle(
                                              fontFamily:
                                                  AppTypography.figmaFamily,
                                              color: AppColors.authLink,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                      if (session.errorMessage != null)
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            bottom: AppSpacing.md,
                                          ),
                                          child: Text(
                                            session.errorMessage!,
                                            style: const TextStyle(
                                              fontFamily:
                                                  AppTypography.figmaFamily,
                                              color: AppColors.danger,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      SizedBox(
                                        width: double.infinity,
                                        height: 52,
                                        child: FilledButton(
                                          style: FilledButton.styleFrom(
                                            backgroundColor:
                                                AppColors.authPrimaryButton,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                            ),
                                            textStyle: const TextStyle(
                                              fontFamily:
                                                  AppTypography.figmaFamily,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                          onPressed: isLoading
                                              ? null
                                              : () async {
                                                  if (!_formKey.currentState!
                                                      .validate()) {
                                                    return;
                                                  }
                                                  await session.login(
                                                    _emailController.text
                                                        .trim(),
                                                    _passwordController.text,
                                                  );
                                                },
                                          child: Text(
                                            isLoading
                                                ? 'Signing in...'
                                                : 'Sign in',
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
                                  runAlignment: WrapAlignment.center,
                                  spacing: 2,
                                  runSpacing: 2,
                                  children: <Widget>[
                                    const Text(
                                      "Don't have an account?",
                                      style: TextStyle(
                                        fontFamily: AppTypography.figmaFamily,
                                        fontSize: 14,
                                        color: AppColors.textSecondary,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    TextButton(
                                      key: const Key('login_signup_link'),
                                      onPressed: () =>
                                          context.push(AppRoutes.signup),
                                      style: TextButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 4,
                                          vertical: 0,
                                        ),
                                        minimumSize: Size.zero,
                                        tapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      child: const Text(
                                        'Sign up',
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
      },
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
}
