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
              : CustomScrollView(
                  slivers: [
                    // Premium Collapsing App Bar
                    SliverAppBar(
                      expandedHeight: 240.0,
                      floating: false,
                      pinned: true,
                      backgroundColor: Colors.white,
                      elevation: 0,
                      flexibleSpace: FlexibleSpaceBar(
                        background: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topRight,
                              end: Alignment.bottomLeft,
                              colors: [
                                Theme.of(context).primaryColor,
                                Theme.of(context).primaryColor.withOpacity(0.8),
                              ],
                            ),
                          ),
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              // Pattern overlay or image could go here
                              Center(
                                child: Icon(
                                  Icons.school_outlined,
                                  size: 80,
                                  color: Colors.white.withOpacity(0.2),
                                ),
                              ),
                              Positioned(
                                bottom: 0,
                                left: 0,
                                right: 0,
                                child: Container(
                                  height: 32,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.only(
                                      topLeft: Radius.circular(32),
                                      topRight: Radius.circular(32),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      leading: IconButton(
                        icon: const CircleAvatar(
                          backgroundColor: Colors.white24,
                          child: Icon(Icons.arrow_back, color: Colors.white),
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ),

                    // Course Content
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Tags
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                        color: const Color(0xFFE2E8F0)),
                                  ),
                                  child: Text(
                                    _course?['category'] ?? 'Development',
                                    style: const TextStyle(
                                      color: Color(0xFF64748B),
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF0FDF4),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                        color: const Color(0xFFBBF7D0)),
                                  ),
                                  child: Text(
                                    _course?['level'] ?? 'Beginner',
                                    style: TextStyle(
                                      color: Colors.green[700],
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 16),

                            Text(
                              _course?['title'] ?? 'Untitled Course',
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                height: 1.2,
                                letterSpacing: -0.5,
                              ),
                            ),

                            const SizedBox(height: 16),

                            // Instructor
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: Theme.of(context).primaryColor,
                                        width: 2),
                                  ),
                                  child: CircleAvatar(
                                    radius: 16,
                                    backgroundColor: Theme.of(context)
                                        .primaryColor
                                        .withOpacity(0.1),
                                    child: Icon(Icons.person,
                                        size: 20,
                                        color: Theme.of(context).primaryColor),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Instructor',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[500],
                                      ),
                                    ),
                                    Text(
                                      _course?['instructor']?['name'] ??
                                          'Unknown',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),

                            const SizedBox(height: 24),

                            const Divider(height: 1),

                            const SizedBox(height: 24),

                            Text(
                              'About this course',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey[900],
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _course?['description'] ?? '',
                              style: TextStyle(
                                fontSize: 15,
                                height: 1.6,
                                color: Colors.grey[600],
                              ),
                            ),

                            const SizedBox(height: 32),
                          ],
                        ),
                      ),
                    ),

                    // Syllabus Header
                    SliverPersistentHeader(
                      pinned: true,
                      delegate: _SliverAppBarDelegate(
                        minHeight: 60.0,
                        maxHeight: 60.0,
                        child: Container(
                          color: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          alignment: Alignment.centerLeft,
                          child: const Text(
                            'Course Content',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Lectures List
                    if (_course?['lectures'] != null &&
                        _course!['lectures'].isNotEmpty)
                      SliverPadding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        sliver: SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final lecture = _course!['lectures'][index];
                              final isLocked =
                                  index > 2; // Mock logic for locked content
                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                      color: const Color(0xFFE2E8F0)),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.02),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(16),
                                  leading: Container(
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(
                                      color: isLocked
                                          ? Colors.grey[100]
                                          : Theme.of(context)
                                              .primaryColor
                                              .withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(
                                      isLocked
                                          ? Icons.lock_outline
                                          : Icons.play_arrow_rounded,
                                      color: isLocked
                                          ? Colors.grey[400]
                                          : Theme.of(context).primaryColor,
                                    ),
                                  ),
                                  title: Text(
                                    lecture['title'] ?? 'Lecture ${index + 1}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: isLocked
                                          ? Colors.grey[400]
                                          : Colors.grey[900],
                                    ),
                                  ),
                                  subtitle: Text(
                                    lecture['duration'] ?? '10 mins',
                                    style: TextStyle(color: Colors.grey[500]),
                                  ),
                                  trailing: isLocked
                                      ? null
                                      : const Icon(Icons.check_circle,
                                          color: Color(0xFF10B981), size: 20),
                                  onTap: isLocked
                                      ? null
                                      : () {
                                          Navigator.pushNamed(
                                            context,
                                            '/video-player',
                                            arguments: lecture,
                                          );
                                        },
                                ),
                              );
                            },
                            childCount: _course!['lectures'].length,
                          ),
                        ),
                      )
                    else
                      const SliverToBoxAdapter(
                        child: Padding(
                          padding: EdgeInsets.all(24),
                          child: Center(child: Text('No lectures available')),
                        ),
                      ),

                    // Quizzes Header
                    if (_quizzes.isNotEmpty)
                      SliverPersistentHeader(
                        pinned: false,
                        delegate: _SliverAppBarDelegate(
                          minHeight: 60.0,
                          maxHeight: 60.0,
                          child: Container(
                            color: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            alignment: Alignment.centerLeft,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Quizzes',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
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
                          ),
                        ),
                      ),

                    // Quizzes List
                    if (_quizzes.isNotEmpty)
                      SliverPadding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        sliver: SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final quiz = _quizzes[index];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                      color: const Color(0xFFE2E8F0)),
                                ),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(16),
                                  leading: CircleAvatar(
                                    backgroundColor:
                                        Colors.amber.withOpacity(0.1),
                                    child: const Icon(Icons.quiz_outlined,
                                        color: Colors.amber),
                                  ),
                                  title: Text(
                                    quiz['title'] ?? 'Quiz ${index + 1}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  subtitle: Text(
                                    '${quiz['questions']?.length ?? 0} questions',
                                    style: TextStyle(color: Colors.grey[500]),
                                  ),
                                  trailing: const Icon(
                                      Icons.arrow_forward_ios_rounded,
                                      size: 16,
                                      color: Color(0xFFE2E8F0)),
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
                            childCount:
                                _quizzes.length > 3 ? 3 : _quizzes.length,
                          ),
                        ),
                      ),

                    const SliverToBoxAdapter(child: SizedBox(height: 100)),
                  ],
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          if (_course != null &&
              _course!['lectures'] != null &&
              _course!['lectures'].isNotEmpty) {
            Navigator.pushNamed(
              context,
              '/video-player',
              arguments: _course!['lectures'][0],
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('No lectures to resume')),
            );
          }
        },
        backgroundColor: Theme.of(context).primaryColor,
        icon: const Icon(Icons.play_arrow_rounded),
        label: const Text('Resume Learning'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;

  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  @override
  double get minExtent => minHeight;
  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}
