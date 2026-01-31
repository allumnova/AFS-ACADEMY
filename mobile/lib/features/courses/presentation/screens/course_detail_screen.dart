import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/services/quiz_service.dart';
import '../../../../core/widgets/loading_indicator.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;

  const CourseDetailScreen({super.key, required this.courseId});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final CourseService _courseService = CourseService();
  final QuizService _quizService = QuizService();
  Map<String, dynamic>? _course;
  List<dynamic> _quizzes = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCourseDetails();
  }

  Future<void> _loadCourseDetails() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final course = await _courseService.getCourseById(widget.courseId);
      final quizzes = await _quizService.getCourseQuizzes(widget.courseId);
      setState(() {
        _course = course;
        _quizzes = quizzes;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Course Details'),
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Loading course...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline,
                          size: 64, color: Colors.red[300]),
                      const SizedBox(height: 16),
                      Text('Failed to load course',
                          style: TextStyle(color: Colors.grey[600])),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadCourseDetails,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Course header
                      Container(
                        height: 200,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.play_circle_outline,
                            size: 64,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Chip(
                                  label: Text(
                                      _course?['category'] ?? 'Development'),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  _course?['level'] ?? 'Beginner',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _course?['title'] ?? 'Untitled Course',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _course?['description'] ?? '',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[700],
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                const Icon(Icons.person_outline, size: 20),
                                const SizedBox(width: 4),
                                Text(
                                  _course?['instructor']?['name'] ?? 'Unknown',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            // Lectures section
                            const Text(
                              'Lectures',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            if (_course?['lectures'] != null &&
                                _course!['lectures'].isNotEmpty)
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _course!['lectures'].length,
                                itemBuilder: (context, index) {
                                  final lecture = _course!['lectures'][index];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    child: ListTile(
                                      leading: CircleAvatar(
                                        backgroundColor: Theme.of(context)
                                            .primaryColor
                                            .withValues(alpha: 0.1),
                                        child: const Icon(Icons.play_arrow),
                                      ),
                                      title: Text(lecture['title'] ??
                                          'Lecture ${index + 1}'),
                                      subtitle: Text(lecture['duration'] ?? ''),
                                      onTap: () {
                                        Navigator.pushNamed(
                                          context,
                                          '/video-player',
                                          arguments: lecture,
                                        );
                                      },
                                    ),
                                  );
                                },
                              )
                            else
                              const Text('No lectures available'),
                            const SizedBox(height: 24),
                            // Quizzes section
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Quizzes',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (_quizzes.isNotEmpty)
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pushNamed(
                                        context,
                                        '/quiz-list',
                                        arguments: widget.courseId,
                                      );
                                    },
                                    child: const Text('View All'),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            if (_quizzes.isEmpty)
                              const Text('No quizzes available')
                            else
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount:
                                    _quizzes.length > 3 ? 3 : _quizzes.length,
                                itemBuilder: (context, index) {
                                  final quiz = _quizzes[index];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    child: ListTile(
                                      leading: const CircleAvatar(
                                        child: Icon(Icons.quiz_outlined),
                                      ),
                                      title: Text(
                                          quiz['title'] ?? 'Quiz ${index + 1}'),
                                      subtitle: Text(
                                          '${quiz['questions']?.length ?? 0} questions'),
                                      trailing: const Icon(
                                          Icons.arrow_forward_ios,
                                          size: 16),
                                      onTap: () {
                                        Navigator.pushNamed(
                                          context,
                                          '/quiz-taking',
                                          arguments: quiz['id'],
                                        );
                                      },
                                    ),
                                  );
                                },
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
