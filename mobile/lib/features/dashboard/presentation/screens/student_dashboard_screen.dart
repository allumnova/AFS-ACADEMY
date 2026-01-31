import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/loading_indicator.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  final CourseService _courseService = CourseService();
  List<dynamic> _enrolledCourses = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final courses = await _courseService.getEnrolledCourses();
      setState(() {
        _enrolledCourses = courses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  List<dynamic> get _activeCourses {
    return _enrolledCourses
        .where((c) => c['enrollmentStatus'] == 'active')
        .toList();
  }

  List<dynamic> get _completedCourses {
    return _enrolledCourses
        .where((c) => c['enrollmentStatus'] == 'completed')
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Loading dashboard...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline,
                          size: 64, color: Colors.red[300]),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load dashboard',
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _error!,
                        style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadDashboardData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadDashboardData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Welcome back!',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Stats Cards
                        GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 1.5,
                          children: [
                            StatCard(
                              icon: Icons.book_outlined,
                              title: 'Courses in Progress',
                              value: '${_activeCourses.length}',
                              iconColor: Theme.of(context).primaryColor,
                              backgroundColor: Theme.of(context).primaryColor,
                            ),
                            StatCard(
                              icon: Icons.access_time,
                              title: 'Hours Learned',
                              value: '12.5',
                              iconColor: Colors.orange,
                            ),
                            StatCard(
                              icon: Icons.emoji_events_outlined,
                              title: 'Certificates',
                              value: '${_completedCourses.length}',
                              iconColor: Colors.amber,
                            ),
                            StatCard(
                              icon: Icons.trending_up,
                              title: 'Avg. Progress',
                              value: '65%',
                              iconColor: Colors.green,
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Resume Learning Section
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Pick up where you left off',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pushNamed(context, '/my-courses');
                              },
                              child: const Text('View All'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        if (_activeCourses.isEmpty)
                          EmptyState(
                            icon: Icons.school_outlined,
                            message: 'You are not enrolled in any courses yet.',
                            actionText: 'Browse Courses',
                            onAction: () {
                              Navigator.pushNamed(context, '/courses');
                            },
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _activeCourses.length > 3
                                ? 3
                                : _activeCourses.length,
                            itemBuilder: (context, index) {
                              final course = _activeCourses[index];
                              final progress =
                                  course['completionPercentage'] ?? 0;
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: InkWell(
                                  onTap: () {
                                    Navigator.pushNamed(
                                      context,
                                      '/course-detail',
                                      arguments: course['id'],
                                    );
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              width: 60,
                                              height: 60,
                                              decoration: BoxDecoration(
                                                color: Colors.grey[200],
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                              ),
                                              child: const Icon(
                                                Icons.play_circle_outline,
                                                size: 32,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(width: 16),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    course['title'] ??
                                                        'Untitled Course',
                                                    style: const TextStyle(
                                                      fontSize: 16,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                    maxLines: 2,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    '$progress% Complete',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey[600],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(4),
                                          child: LinearProgressIndicator(
                                            value: progress / 100,
                                            minHeight: 6,
                                            backgroundColor: Colors.grey[200],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                      ],
                    ),
                  ),
                ),
    );
  }
}
