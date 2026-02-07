import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primary = Color(0xFF4F46E5); // Indigo 600
  static const Color primaryLight = Color(0xFFEEF2FF); // Indigo 50
  static const Color primaryDark = Color(0xFF4338CA); // Indigo 700
  static const Color accent = Color(0xFF10B981); // Emerald 500
  static const Color accentLight = Color(0xFFECFDF5); // Emerald 50
  static const Color surface = Colors.white;
  static const Color background = Color(0xFFF8FAFC); // Slate 50
  static const Color textMain = Color(0xFF0F172A); // Slate 900
  static const Color textSub = Color(0xFF64748B); // Slate 500
  static const Color border = Color(0xFFE2E8F0); // Slate 200

  static List<BoxShadow> get premiumShadow => [
        BoxShadow(
          color: const Color(0xFF000000).withValues(alpha: 0.05),
          blurRadius: 20,
          offset: const Offset(0, 10),
        ),
      ];

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: primary,
        onPrimary: Colors.white,
        secondary: accent,
        onSecondary: Colors.white,
        surface: surface,
        onSurface: textMain,
        error: Color(0xFFEF4444),
      ),
      scaffoldBackgroundColor: background,
      dividerTheme: const DividerThemeData(
        color: border,
        thickness: 1,
      ),
      textTheme: GoogleFonts.outfitTextTheme().apply(
        bodyColor: textMain,
        displayColor: textMain,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: border, width: 1),
        ),
        color: Colors.white,
        clipBehavior: Clip.antiAlias,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: textMain),
        titleTextStyle: GoogleFonts.outfit(
          color: textMain,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primary, width: 2),
        ),
        contentPadding: const EdgeInsets.all(18),
        hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}
