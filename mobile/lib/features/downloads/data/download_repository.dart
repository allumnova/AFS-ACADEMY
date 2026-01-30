import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/local_database.dart';

class DownloadRepository {
  final Dio _dio;
  final LocalDatabase _db;

  DownloadRepository(this._dio, this._db);

  Future<void> downloadCourseVideo(
    String courseId,
    String title,
    String url,
    Function(int, int) onProgress,
  ) async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final fileName = "\${courseId}_video.mp4";
      final savePath = "\${appDir.path}/$fileName";

      // Insert Initial Record
      await _db.insertDownload({
        'id': courseId,
        'courseId': courseId,
        'title': title,
        'filePath': savePath,
        'progress': 0,
        'status': 'downloading',
      });

      // Start Download
      await _dio.download(
        url,
        savePath,
        onReceiveProgress: (received, total) async {
          int progress = ((received / total) * 100).toInt();
          onProgress(received, total);

          // Update DB periodically (optimization needed in prod)
          if (progress % 10 == 0) {
            // await _db.updateDownload({...});
          }
        },
      );

      // Mark Complete
      await _db.updateDownload({
        'id': courseId,
        'courseId': courseId,
        'title': title,
        'filePath': savePath,
        'progress': 100,
        'status': 'completed',
      });
    } catch (e) {
      // Mark Failed
      await _db.updateDownload({
        'id': courseId,
        'courseId': courseId,
        'title': title,
        'filePath': '',
        'progress': 0,
        'status': 'failed',
      });
      rethrow;
    }
  }

  Future<bool> isCourseDownloaded(String courseId) async {
    final record = await _db.getDownload(courseId);
    return record != null && record['status'] == 'completed';
  }

  Future<String?> getLocalFilePath(String courseId) async {
    final record = await _db.getDownload(courseId);
    if (record != null && record['status'] == 'completed') {
      return record['filePath'];
    }
    return null;
  }
}

final downloadRepositoryProvider = Provider<DownloadRepository>((ref) {
  final db = ref.watch(localDatabaseProvider);
  return DownloadRepository(Dio(), db);
});
