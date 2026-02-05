import 'dart:async';
import 'package:dio/dio.dart';

class ProgressService {
  final Dio _dio;

  ProgressService(this._dio);

  Future<void> updateProgress({
    required String courseId,
    required String lectureId,
    required int progressSeconds,
    bool isCompleted = false,
  }) async {
    try {
      await _dio.put('/courses/progress', data: {
        'courseId': courseId,
        'lectureId': lectureId,
        'progressSeconds': progressSeconds,
        'isCompleted': isCompleted,
      });
    } catch (e) {
      // Fail silently for heartbeat
      print('Failed to sync progress: $e');
    }
  }

  Future<Map<String, dynamic>?> getLectureProgress(String lectureId) async {
    try {
      final response = await _dio.get('/lectures/$lectureId/progress');
      return response.data;
    } catch (e) {
      print('Failed to get progress: $e');
      return null;
    }
  }
}
