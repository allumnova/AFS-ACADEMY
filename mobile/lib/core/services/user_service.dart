import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../database/database_helper.dart';

class UserService {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;

  Future<String?> _getToken() async {
    final user = await _dbHelper.getUser();
    return user?['token'];
  }

  Map<String, String> _getHeaders(String? token) {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // Get user profile
  Future<Map<String, dynamic>> getProfile() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/users/profile'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load profile: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching profile: $e');
    }
  }

  // Update user profile
  Future<Map<String, dynamic>> updateProfile(
      Map<String, dynamic> profileData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}/users/profile'),
        headers: _getHeaders(token),
        body: json.encode(profileData),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to update profile: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error updating profile: $e');
    }
  }

  // Send OTP
  Future<Map<String, dynamic>> sendOTP(Map<String, dynamic> otpData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/users/send-otp'),
        headers: _getHeaders(token),
        body: json.encode(otpData),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to send OTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error sending OTP: $e');
    }
  }

  // Verify OTP
  Future<Map<String, dynamic>> verifyOTP(Map<String, dynamic> otpData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/users/verify-otp'),
        headers: _getHeaders(token),
        body: json.encode(otpData),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to verify OTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error verifying OTP: $e');
    }
  }
}
