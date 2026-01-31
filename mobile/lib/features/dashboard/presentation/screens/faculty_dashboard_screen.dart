import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/loading_indicator.dart';

class FacultyDashboardScreen extends StatefulWidget {
  const FacultyDashboardScreen({Key? key}) : super(key: key);

  @override
  State<FacultyDashboardScreen> createState() => _FacultyDashboardScreenState();
}

class _FacultyDashboardScreenState extends State<FacultyDashboardScreen> {
  final CourseService _courseService = CourseService();
  List<dynamic> _myCourses = [];
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
      final courses = await _courseService.getFacultyCourses();
      setState(() {
        _myCourses = courses;
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
        title: const Text('Faculty Dashboard'),
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
                      Text('Failed to load dashboard',
                          style: TextStyle(color: Colors.grey[600])),
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
                          'Faculty Dashboard',
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
                              title: 'My Courses',
                              value: '${_myCourses.length}',
                              subtitle: 'Active courses',
                              iconColor: Theme.of(context).primaryColor,
                              backgroundColor: Theme.of(context).primaryColor,
                            ),
                            StatCard(
                              icon: Icons.people_outline,
                              title: 'Total Students',
                              value: '120',
                              subtitle: '+12 this week',
                              iconColor: Colors.blue,
                            ),
                            StatCard(
                              icon: Icons.star_outline,
                              title: 'Average Rating',
                              value: '4.8',
                              subtitle: 'From 45 reviews',
                              iconColor: Colors.amber,
                            ),
                            StatCard(
                              icon: Icons.video_library_outlined,
                              title: 'Live Sessions',
                              value: '8',
                              subtitle: 'This month',
                              iconColor: Colors.green,
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // My Courses Section
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'My Courses',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pushNamed(
                                    context, '/faculty-courses');
                              },
                              child: const Text('View All'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        if (_myCourses.isEmpty)
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(32),
                              child: Column(
                                children: [
                                  Icon(Icons.school_outlined,
                                      size: 64, color: Colors.grey[300]),
                                  const SizedBox(height: 16),
                                  Text(
                                    'No courses created yet',
                                    style: TextStyle(color: Colors.grey[600]),
                                  ),
                                ],
                              ),
                            ),
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount:
                                _myCourses.length > 3 ? 3 : _myCourses.length,
                            itemBuilder: (context, index) {
                              final course = _myCourses[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: Theme.of(context)
                                        .primaryColor
                                        .withOpacity(0.1),
                                    child: Icon(
                                      Icons.book,
                                      color: Theme.of(context).primaryColor,
                                    ),
                                  ),
                                  title: Text(
                                    course['title'] ?? 'Untitled Course',
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Text(
                                    '${course['enrolledCount'] ?? 0} students enrolled',
                                  ),
                                  trailing: const Icon(Icons.arrow_forward_ios,
                                      size: 16),
                                  onTap: () {
                                    Navigator.pushNamed(
                                      context,
                                      '/course-detail',
                                      arguments: course['id'],
                                    );
                                  },
                                ),
                              );
                            },
                          ),
                        const SizedBox(height: 32),
                        // Upcoming Sessions
                        const Text(
                          'Upcoming Live Sessions',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Center(
                              child: Text(
                                'No classes scheduled for today',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.pushNamed(context, '/course-form');
        },
        icon: const Icon(Icons.add),
        label: const Text('New Course'),
      ),
    );
  }
}
