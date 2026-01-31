import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../database/database_helper.dart';

class CourseService {
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

  // Get all courses (public)
  Future<List<dynamic>> getAllCourses() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/courses'),
        headers: _getHeaders(null),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load courses: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching courses: $e');
    }
  }

  // Get course by ID
  Future<Map<String, dynamic>> getCourseById(String courseId) async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/courses/$courseId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load course: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching course: $e');
    }
  }

  // Get enrolled courses (student)
  Future<List<dynamic>> getEnrolledCourses() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/courses/my/enrolled'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception(
            'Failed to load enrolled courses: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching enrolled courses: $e');
    }
  }

  // Get faculty courses
  Future<List<dynamic>> getFacultyCourses() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/courses/my/created'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception(
            'Failed to load faculty courses: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching faculty courses: $e');
    }
  }

  // Create course (admin/faculty)
  Future<Map<String, dynamic>> createCourse(
      Map<String, dynamic> courseData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/courses'),
        headers: _getHeaders(token),
        body: json.encode(courseData),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to create course: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating course: $e');
    }
  }

  // Update course (admin/faculty)
  Future<Map<String, dynamic>> updateCourse(
      String courseId, Map<String, dynamic> courseData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}/courses/$courseId'),
        headers: _getHeaders(token),
        body: json.encode(courseData),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to update course: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error updating course: $e');
    }
  }

  // Delete course (admin/faculty)
  Future<void> deleteCourse(String courseId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}/courses/$courseId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete course: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error deleting course: $e');
    }
  }
}
