import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/loading_indicator.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

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
                        // Premium Header
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Hello, Scholar! 👋',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[600],
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Ready to learn today?',
                                style: TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: -1,
                                  height: 1.1,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Bento Stats Grid
                        // Payment Alert (New - matched to Web)
                        if (true) // Mock condition: stats.pendingPayments > 0
                          Container(
                            margin: const EdgeInsets.only(bottom: 24),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFFBEB), // Amber-50
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                  color: const Color(0xFFFDE68A)), // Amber-200
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFEF3C7), // Amber-100
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(Icons.credit_card,
                                      color:
                                          const Color(0xFFD97706)), // Amber-600
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'ACTION REQUIRED',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: const Color(
                                              0xFF78350F), // Amber-900
                                          letterSpacing: 1,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'You have 1 pending payment',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: const Color(
                                              0xFF92400E), // Amber-800
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pushNamed(context, '/payments');
                                  },
                                  style: TextButton.styleFrom(
                                    foregroundColor:
                                        const Color(0xFFB45309), // Amber-700
                                  ),
                                  child: const Text('Resolve'),
                                ),
                              ],
                            ),
                          ),

                        // Stats Grid (Matched to Web - 3 cards)
                        GridView.count(
                          crossAxisCount: 3,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12, // Tighter spacing for 3 cols
                          childAspectRatio: 0.85, // Taller cards to fit text
                          children: [
                            StatCard(
                              icon: Icons.auto_stories_outlined,
                              title: 'In Progress',
                              value: '${_activeCourses.length}',
                              subtitle: 'Active',
                              iconColor: const Color(0xFF2563EB), // Blue-600
                              backgroundColor:
                                  const Color(0xFFEFF6FF), // Blue-50
                            ),
                            StatCard(
                              icon: Icons.workspace_premium_outlined,
                              title: 'Completed',
                              value: '${_completedCourses.length}',
                              subtitle: 'Earned',
                              iconColor: const Color(0xFF059669), // Emerald-600
                              backgroundColor:
                                  const Color(0xFFECFDF5), // Emerald-50
                            ),
                            StatCard(
                              icon: Icons.access_time, // Clock
                              title: 'Attendance',
                              value: '92%',
                              subtitle: 'Present',
                              iconColor: const Color(0xFF9333EA), // Purple-600
                              backgroundColor:
                                  const Color(0xFFFAF5FF), // Purple-50
                            ),
                          ],
                        ),

                        const SizedBox(height: 32),

                        // Upcoming Sessions (New - matched to Web)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Upcoming Live Sessions',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Mock Single Session Card for Demo
                        Container(
                          margin: const EdgeInsets.only(bottom: 24),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF), // Blue-50
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                                color: const Color(0xFFDBEAFE)), // Blue-100
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(16),
                              onTap: () {},
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                            color: const Color(0xFFDBEAFE)),
                                      ),
                                      child: Column(
                                        children: [
                                          Text('FEB',
                                              style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue[300])),
                                          const Text('08',
                                              style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text('ADVANCED REACT PATTERNS',
                                              style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue[600],
                                                  letterSpacing: 0.5)),
                                          const SizedBox(height: 4),
                                          const Text(
                                              'State Management Deep Dive',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 14)),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              Icon(Icons.access_time,
                                                  size: 12,
                                                  color: Colors.grey[500]),
                                              const SizedBox(width: 4),
                                              Text('10:00 AM • 45m',
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey[600])),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    ElevatedButton(
                                      onPressed: () {},
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFF2563EB),
                                        foregroundColor: Colors.white,
                                        elevation: 0,
                                        shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8)),
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 16, vertical: 0),
                                        tapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      child: const Text('Join'),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 40),

                        // Section Title
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Resume Learning',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Pick up where you left off',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pushNamed(context, '/my-courses');
                              },
                              style: TextButton.styleFrom(
                                foregroundColor: const Color(0xFF4F46E5),
                                textStyle: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                              child: const Text('See All'),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        if (_activeCourses.isEmpty)
                          EmptyState(
                            icon: Icons.school_outlined,
                            message:
                                'No active courses found. Time to start a new journey!',
                            actionText: 'Browse Courses',
                            onAction: () {
                              Navigator.pushNamed(context, '/courses');
                            },
                          )
                        else
                          SizedBox(
                            height: 280,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              physics: const BouncingScrollPhysics(),
                              itemCount: _activeCourses.length > 5
                                  ? 5
                                  : _activeCourses.length,
                              itemBuilder: (context, index) {
                                final course = _activeCourses[index];
                                final progress =
                                    course['completionPercentage'] ?? 0;
                                return Container(
                                  width: 280, // Fixed width for carousel cards
                                  margin: const EdgeInsets.only(
                                      right: 16, bottom: 16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(24),
                                    border: Border.all(
                                        color: const Color(0xFFE2E8F0)),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black
                                            .withValues(alpha: 0.03),
                                        blurRadius: 15,
                                        offset: const Offset(0, 8),
                                      ),
                                    ],
                                  ),
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(24),
                                    onTap: () {
                                      Navigator.pushNamed(
                                        context,
                                        '/course-detail',
                                        arguments: course['id'],
                                      );
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.all(20),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Container(
                                                width: 54,
                                                height: 54,
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFF4F46E5)
                                                      .withValues(alpha: 0.1),
                                                  borderRadius:
                                                      BorderRadius.circular(16),
                                                ),
                                                child: const Icon(
                                                  Icons.play_circle_fill,
                                                  size: 28,
                                                  color: Color(0xFF4F46E5),
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
                                                      maxLines: 1,
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                    ),
                                                    const SizedBox(height: 4),
                                                    Row(
                                                      children: [
                                                        Icon(Icons.bolt,
                                                            size: 12,
                                                            color: Colors
                                                                .amber[600]),
                                                        const SizedBox(
                                                            width: 4),
                                                        Text(
                                                          'Next: Module 4', // Mock data
                                                          style: TextStyle(
                                                            fontSize: 12,
                                                            color: Colors
                                                                .grey[500],
                                                            fontWeight:
                                                                FontWeight.w500,
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          const Spacer(),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Progress',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.grey[700],
                                                ),
                                              ),
                                              Text(
                                                '$progress%',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w900,
                                                  color: Color(0xFF4F46E5),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 8),
                                          ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(10),
                                            child: LinearProgressIndicator(
                                              value: progress / 100,
                                              minHeight: 8,
                                              backgroundColor:
                                                  const Color(0xFFF1F5F9),
                                              valueColor:
                                                  const AlwaysStoppedAnimation<
                                                      Color>(Color(0xFF4F46E5)),
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
    );
  }
}
