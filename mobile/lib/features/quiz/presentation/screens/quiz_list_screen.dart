import 'package:flutter/material.dart';
import '../../../../core/services/quiz_service.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/loading_indicator.dart';

class QuizListScreen extends StatefulWidget {
  final String courseId;

  const QuizListScreen({Key? key, required this.courseId}) : super(key: key);

  @override
  State<QuizListScreen> createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> {
  final QuizService _quizService = QuizService();
  List<dynamic> _quizzes = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadQuizzes();
  }

  Future<void> _loadQuizzes() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final quizzes = await _quizService.getCourseQuizzes(widget.courseId);
      setState(() {
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
        title: const Text('Quizzes'),
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Loading quizzes...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline,
                          size: 64, color: Colors.red[300]),
                      const SizedBox(height: 16),
                      Text('Failed to load quizzes',
                          style: TextStyle(color: Colors.grey[600])),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadQuizzes,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _quizzes.isEmpty
                  ? const EmptyState(
                      icon: Icons.quiz_outlined,
                      message: 'No quizzes available for this course',
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _quizzes.length,
                      itemBuilder: (context, index) {
                        final quiz = _quizzes[index];
                        final isCompleted = quiz['isCompleted'] ?? false;
                        final score = quiz['score'];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          child: InkWell(
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                '/quiz-taking',
                                arguments: quiz['id'],
                              );
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        backgroundColor: isCompleted
                                            ? Colors.green
                                            : Theme.of(context).primaryColor,
                                        child: Icon(
                                          isCompleted
                                              ? Icons.check
                                              : Icons.quiz_outlined,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              quiz['title'] ??
                                                  'Quiz ${index + 1}',
                                              style: const TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              '${quiz['questions']?.length ?? 0} questions',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      if (isCompleted && score != null)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.green[50],
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            '$score%',
                                            style: TextStyle(
                                              color: Colors.green[700],
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  if (quiz['description'] != null) ...[
                                    const SizedBox(height: 12),
                                    Text(
                                      quiz['description'],
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[700],
                                      ),
                                    ),
                                  ],
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.access_time,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        quiz['duration'] ?? '30 minutes',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Icon(
                                        Icons.star_outline,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Passing: ${quiz['passingScore'] ?? 70}%',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}
