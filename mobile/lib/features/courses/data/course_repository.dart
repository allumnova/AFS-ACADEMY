import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/api_constants.dart';
import 'course_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

final courseRepositoryProvider = Provider((ref) => CourseRepository());

final coursesProvider = FutureProvider<List<Course>>((ref) async {
  return ref.watch(courseRepositoryProvider).getCourses();
});

class CourseRepository {
  final Dio _dio = Dio();

  Future<List<Course>> getCourses() async {
    try {
      // Add token if needed
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final response = await _dio.get(
        '${ApiConstants.baseUrl}/courses',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((e) => Course.fromJson(e)).toList();
      } else {
        throw Exception('Failed to load courses');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Course> getCourseById(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final response = await _dio.get(
        '${ApiConstants.baseUrl}/courses/$id',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        return Course.fromJson(response.data);
      } else {
        throw Exception('Failed to load course details');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<Course>> getEnrolledCourses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final response = await _dio.get(
        '${ApiConstants.baseUrl}/courses/my/enrolled',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((e) => Course.fromJson(e)).toList();
      } else {
        throw Exception('Failed to load enrolled courses');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<bool> isEnrolled(String courseId) async {
    try {
      final enrolled = await getEnrolledCourses();
      return enrolled.any((c) => c.id == courseId);
    } catch (e) {
      return false;
    }
  }
}

final enrolledCoursesProvider = FutureProvider<List<Course>>((ref) async {
  return ref.watch(courseRepositoryProvider).getEnrolledCourses();
});

final isEnrolledProvider =
    FutureProvider.family<bool, String>((ref, courseId) async {
  return ref.watch(courseRepositoryProvider).isEnrolled(courseId);
});
