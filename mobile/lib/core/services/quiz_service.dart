import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../database/database_helper.dart';

class QuizService {
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

  // Get quizzes for a course
  Future<List<dynamic>> getCourseQuizzes(String courseId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/quizzes/course/$courseId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load quizzes: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching quizzes: $e');
    }
  }

  // Get quiz by ID
  Future<Map<String, dynamic>> getQuiz(String quizId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/quizzes/$quizId'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load quiz: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching quiz: $e');
    }
  }

  // Submit quiz answers
  Future<Map<String, dynamic>> submitQuiz(
      String quizId, Map<String, dynamic> answers) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/quizzes/$quizId/submit'),
        headers: _getHeaders(token),
        body: json.encode(answers),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to submit quiz: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error submitting quiz: $e');
    }
  }

  // Create quiz (admin/faculty)
  Future<Map<String, dynamic>> createQuiz(Map<String, dynamic> quizData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/quizzes'),
        headers: _getHeaders(token),
        body: json.encode(quizData),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to create quiz: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating quiz: $e');
    }
  }
}
