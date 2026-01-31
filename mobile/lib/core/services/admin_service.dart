import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../database/database_helper.dart';

class AdminService {
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

  // Get dashboard stats
  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/admin/stats'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load stats: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching stats: $e');
    }
  }

  // Get all students
  Future<List<dynamic>> getStudents() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      // Note: This endpoint might need to be added to the server
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/admin/students'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load students: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching students: $e');
    }
  }

  // Get all payments (admin view)
  Future<List<dynamic>> getAllPayments() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/admin/payments'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load payments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching payments: $e');
    }
  }

  // Get attendance records
  Future<List<dynamic>> getAttendance({String? courseId, String? date}) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      String url = '${ApiConstants.baseUrl}/attendance';
      final queryParams = <String, String>{};
      if (courseId != null) queryParams['courseId'] = courseId;
      if (date != null) queryParams['date'] = date;

      if (queryParams.isNotEmpty) {
        url += '?${Uri(queryParameters: queryParams).query}';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load attendance: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching attendance: $e');
    }
  }

  // Mark attendance
  Future<Map<String, dynamic>> markAttendance(
      Map<String, dynamic> attendanceData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/attendance'),
        headers: _getHeaders(token),
        body: json.encode(attendanceData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to mark attendance: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error marking attendance: $e');
    }
  }
}
