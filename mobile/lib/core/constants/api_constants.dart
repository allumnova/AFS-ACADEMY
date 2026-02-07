import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api'; // Localhost for Web to avoid CORS with prod
    }
    return 'https://allumnova.cloud/api';
  }

  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get createOrder => '$baseUrl/payments/create-order';
  static String get verifyPayment => '$baseUrl/payments/verify';

  static String getImageUrl(String path) {
    if (path.startsWith('http')) return path;
    // Replace localhost with production domain for absolute URLs from backend
    final formattedPath = path.startsWith('/') ? path : '/$path';
    return 'https://allumnova.cloud$formattedPath';
  }
}
