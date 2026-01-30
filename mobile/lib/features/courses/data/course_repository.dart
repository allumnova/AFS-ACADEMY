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
}
