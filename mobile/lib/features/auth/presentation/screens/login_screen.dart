import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/widgets/custom_button.dart';
import '../../data/auth_repository.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  Future<void> _login(String email, String password) async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await ref.read(authRepositoryProvider).login(email, password);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login Successful! Redirecting...')),
        );
        // Use GoRouter to navigate
        GoRouter.of(context).go('/dashboard');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                // Logo / Branding
                Center(
                  child: Container(
                    height: 80,
                    width: 80,
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.school,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                ).animate().scale(duration: 500.ms, curve: Curves.easeOutBack),
                const SizedBox(height: 24),
                Text(
                  "Welcome Back",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1E293B),
                  ),
                ).animate().fadeIn().moveY(begin: 10, end: 0),
                const SizedBox(height: 8),
                Text(
                  "Sign in to continue learning",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    color: const Color(0xFF64748B),
                  ),
                ).animate().fadeIn(delay: 100.ms).moveY(begin: 10, end: 0),
                const SizedBox(height: 48),

                // Form Fields
                AppTextField(
                  label: "Email Address",
                  hint: "name@example.com",
                  controller: _emailController,
                  prefixIcon: Icons.email_outlined,
                  validator: (v) => v!.isEmpty ? "Email is required" : null,
                ).animate().fadeIn(delay: 200.ms).moveX(begin: -10, end: 0),
                const SizedBox(height: 20),
                AppTextField(
                  label: "Password",
                  hint: "Enter your password",
                  isPassword: true,
                  controller: _passwordController,
                  prefixIcon: Icons.lock_outline,
                  validator: (v) => v!.isEmpty ? "Password is required" : null,
                ).animate().fadeIn(delay: 300.ms).moveX(begin: -10, end: 0),

                const SizedBox(height: 32),
                CustomButton(
                  text: "Sign In",
                  isLoading: _isLoading,
                  onPressed: () =>
                      _login(_emailController.text, _passwordController.text),
                ).animate().fadeIn(delay: 400.ms).moveY(begin: 20, end: 0),

                // Demo Login Section
                const SizedBox(height: 40),
                const Row(
                  children: [
                    Expanded(child: Divider()),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        "DEMO ACCOUNTS",
                        style: TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ),
                    Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _DemoChip(
                      label: "Admin",
                      icon: Icons.admin_panel_settings,
                      color: Colors.indigo,
                      onTap: () {
                        _emailController.text = 'admin@afs.com';
                        _passwordController.text = 'password123';
                        _login('admin@afs.com', 'password123');
                      },
                    ),
                    _DemoChip(
                      label: "Faculty",
                      icon: Icons.school,
                      color: Colors.teal,
                      onTap: () {
                        _emailController.text = 'faculty@afs.com';
                        _passwordController.text = 'password123';
                        _login('faculty@afs.com', 'password123');
                      },
                    ),
                    _DemoChip(
                      label: "Student",
                      icon: Icons.person,
                      color: Colors.orange,
                      onTap: () {
                        _emailController.text = 'student@afs.com';
                        _passwordController.text = 'password123';
                        _login('student@afs.com', 'password123');
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DemoChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  const _DemoChip({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
