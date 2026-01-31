import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/services/quiz_service.dart';
import '../../../../core/widgets/loading_indicator.dart';

class QuizTakingScreen extends StatefulWidget {
  final String quizId;

  const QuizTakingScreen({Key? key, required this.quizId}) : super(key: key);

  @override
  State<QuizTakingScreen> createState() => _QuizTakingScreenState();
}

class _QuizTakingScreenState extends State<QuizTakingScreen> {
  final QuizService _quizService = QuizService();
  Map<String, dynamic>? _quiz;
  Map<String, dynamic> _answers = {};
  bool _isLoading = true;
  bool _isSubmitting = false;
  String? _error;
  int _currentQuestionIndex = 0;
  Timer? _timer;
  int _remainingSeconds = 0;

  @override
  void initState() {
    super.initState();
    _loadQuiz();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _loadQuiz() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final quiz = await _quizService.getQuiz(widget.quizId);
      setState(() {
        _quiz = quiz;
        _isLoading = false;
        // Parse duration (e.g., "30 minutes" to seconds)
        final duration = quiz['duration'] ?? '30 minutes';
        _remainingSeconds = _parseDuration(duration);
        _startTimer();
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  int _parseDuration(String duration) {
    final match = RegExp(r'(\d+)').firstMatch(duration);
    if (match != null) {
      return int.parse(match.group(1)!) * 60; // Convert minutes to seconds
    }
    return 30 * 60; // Default 30 minutes
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
        });
      } else {
        _timer?.cancel();
        _submitQuiz();
      }
    });
  }

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  Future<void> _submitQuiz() async {
    setState(() {
      _isSubmitting = true;
    });

    try {
      final result =
          await _quizService.submitQuiz(widget.quizId, {'answers': _answers});
      _timer?.cancel();

      if (mounted) {
        // Show result dialog
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            title: const Text('Quiz Completed!'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  result['passed'] ? Icons.check_circle : Icons.cancel,
                  size: 64,
                  color: result['passed'] ? Colors.green : Colors.red,
                ),
                const SizedBox(height: 16),
                Text(
                  'Your Score: ${result['score']}%',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  result['passed'] ? 'Congratulations!' : 'Keep practicing!',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit quiz: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final shouldPop = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Exit Quiz?'),
            content: const Text('Your progress will be lost. Are you sure?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('Exit'),
              ),
            ],
          ),
        );
        return shouldPop ?? false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(_quiz?['title'] ?? 'Quiz'),
          actions: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(
                child: Text(
                  _formatTime(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
        body: _isLoading
            ? const LoadingIndicator(message: 'Loading quiz...')
            : _error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline,
                            size: 64, color: Colors.red[300]),
                        const SizedBox(height: 16),
                        Text('Failed to load quiz',
                            style: TextStyle(color: Colors.grey[600])),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: _loadQuiz,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Column(
                    children: [
                      // Progress indicator
                      LinearProgressIndicator(
                        value: (_currentQuestionIndex + 1) /
                            (_quiz?['questions']?.length ?? 1),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Question ${_currentQuestionIndex + 1} of ${_quiz?['questions']?.length ?? 0}',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                _quiz?['questions']?[_currentQuestionIndex]
                                        ?['question'] ??
                                    '',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 24),
                              Expanded(
                                child: ListView.builder(
                                  itemCount: _quiz?['questions']
                                                  ?[_currentQuestionIndex]
                                              ?['options']
                                          ?.length ??
                                      0,
                                  itemBuilder: (context, index) {
                                    final option = _quiz?['questions']
                                            ?[_currentQuestionIndex]?['options']
                                        ?[index];
                                    final questionId = _quiz?['questions']
                                        ?[_currentQuestionIndex]?['id'];
                                    final isSelected =
                                        _answers[questionId] == option;

                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 12),
                                      color: isSelected
                                          ? Theme.of(context)
                                              .primaryColor
                                              .withOpacity(0.1)
                                          : null,
                                      child: InkWell(
                                        onTap: () {
                                          setState(() {
                                            _answers[questionId] = option;
                                          });
                                        },
                                        child: Padding(
                                          padding: const EdgeInsets.all(16),
                                          child: Row(
                                            children: [
                                              Radio<String>(
                                                value: option,
                                                groupValue:
                                                    _answers[questionId],
                                                onChanged: (value) {
                                                  setState(() {
                                                    _answers[questionId] =
                                                        value;
                                                  });
                                                },
                                              ),
                                              Expanded(
                                                child: Text(
                                                  option,
                                                  style: const TextStyle(
                                                      fontSize: 16),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      // Navigation buttons
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            if (_currentQuestionIndex > 0)
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {
                                    setState(() {
                                      _currentQuestionIndex--;
                                    });
                                  },
                                  child: const Text('Previous'),
                                ),
                              ),
                            if (_currentQuestionIndex > 0)
                              const SizedBox(width: 16),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _isSubmitting
                                    ? null
                                    : () {
                                        if (_currentQuestionIndex <
                                            (_quiz?['questions']?.length ?? 0) -
                                                1) {
                                          setState(() {
                                            _currentQuestionIndex++;
                                          });
                                        } else {
                                          _submitQuiz();
                                        }
                                      },
                                child: _isSubmitting
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                            strokeWidth: 2),
                                      )
                                    : Text(
                                        _currentQuestionIndex <
                                                (_quiz?['questions']?.length ??
                                                        0) -
                                                    1
                                            ? 'Next'
                                            : 'Submit',
                                      ),
                              ),
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
