import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/loading_indicator.dart';

class FacultyDashboardScreen extends StatefulWidget {
  const FacultyDashboardScreen({super.key});

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
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final courses = await _courseService.getFacultyCourses();
      if (mounted) {
        setState(() {
          _myCourses = courses;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
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
                        // Premium Header
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Greetings, Professor 🎓',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[600],
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Your Classroom awaits.',
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

                        // Bento Stats Grid (Faculty)
                        // Stats Grid (Matched to Web)
                        GridView.count(
                          crossAxisCount:
                              3, // Changed to 3 to match Web's 3-column layout idea, or keep 2 and have one full width? Web is 3 cols. Mobile might be too cramped for 3. Let's stick to 2 but update contents.
                          // Actually, Web uses 3 cards. On mobile 2 cols is better.
                          // Card 1: Courses, Card 2: Students, Card 3: Rating.
                          // We can do a Row of 3 if they fit, or 2 row grid.
                          // Let's stick to GridView with 2 columns for mobile readability, but update the DATA.
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 1.1,
                          children: [
                            StatCard(
                              icon: Icons.book_outlined,
                              title: 'My Courses',
                              value: '${_myCourses.length}',
                              subtitle: 'Active',
                              iconColor: const Color(0xFF2563EB), // Blue-600
                              backgroundColor:
                                  const Color(0xFFEFF6FF), // Blue-50
                            ),
                            StatCard(
                              icon: Icons.groups_outlined,
                              title: 'Total Students',
                              value: '120', // Mock data from Web
                              subtitle: '+12 this week',
                              iconColor: const Color(0xFF059669), // Emerald-600
                              backgroundColor:
                                  const Color(0xFFECFDF5), // Emerald-50
                            ),
                            StatCard(
                              icon: Icons.star_border_rounded,
                              title: 'Avg. Rating',
                              value: '4.8',
                              subtitle: 'From 45 reviews',
                              iconColor: const Color(0xFFD97706), // Amber-600
                              backgroundColor:
                                  const Color(0xFFFFFBEB), // Amber-50
                            ),
                          ],
                        ),

                        const SizedBox(height: 32),

                        // Student Feedback Section (New)
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.03),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Student Feedback',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Icon(Icons.message_outlined,
                                      color: Colors.indigo[500], size: 20),
                                ],
                              ),
                              const SizedBox(height: 24),
                              Center(
                                child: Column(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: const Color(
                                            0xFFF1F5F9), // Slate-100
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(Icons.star_outline,
                                          color: const Color(
                                              0xFF94A3B8), // Slate-400
                                          size: 24),
                                    ),
                                    const SizedBox(height: 12),
                                    const Text(
                                      'No approved reviews yet',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 14,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Student feedback will appear here once moderated.',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          color: Colors.grey[500],
                                          fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Syllabus Suggestion Section (New)
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.03),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Syllabus Suggestion',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Icon(Icons.send_outlined,
                                      color: Colors.blue[500], size: 20),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Suggest changes to your assigned courses directly to the Admin.',
                                style: TextStyle(
                                    color: Colors.grey[500], fontSize: 13),
                              ),
                              const SizedBox(height: 16),
                              TextField(
                                maxLines: 3,
                                decoration: InputDecoration(
                                  hintText: 'Describe your proposed changes...',
                                  hintStyle: TextStyle(
                                      color: Colors.grey[400], fontSize: 13),
                                  filled: true,
                                  fillColor: Colors.white,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide:
                                        BorderSide(color: Colors.grey[200]!),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide:
                                        BorderSide(color: Colors.grey[200]!),
                                  ),
                                  contentPadding: const EdgeInsets.all(12),
                                ),
                              ),
                              const SizedBox(height: 16),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: () {},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor:
                                        const Color(0xFF0F172A), // Slate-900
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12),
                                  ),
                                  child: const Text('Send Proposal'),
                                ),
                              ),
                            ],
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
                                  'My Courses',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Management & Content',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pushNamed(
                                    context, '/faculty-courses');
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

                        if (_myCourses.isEmpty)
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(40),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border:
                                  Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              children: [
                                Icon(Icons.school_outlined,
                                    size: 64, color: Colors.grey[300]),
                                const SizedBox(height: 16),
                                Text(
                                  'No courses created yet',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount:
                                _myCourses.length > 5 ? 5 : _myCourses.length,
                            itemBuilder: (context, index) {
                              final course = _myCourses[index];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                      color: const Color(0xFFE2E8F0)),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.03),
                                      blurRadius: 15,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(16),
                                  leading: Container(
                                    width: 50,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF4F46E5)
                                          .withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(
                                      Icons.book_rounded,
                                      color: Color(0xFF4F46E5),
                                    ),
                                  ),
                                  title: Text(
                                    course['title'] ?? 'Untitled Course',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  subtitle: Padding(
                                    padding: const EdgeInsets.only(top: 4.0),
                                    child: Row(
                                      children: [
                                        Icon(Icons.people_alt_outlined,
                                            size: 14, color: Colors.grey[500]),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${course['enrolledCount'] ?? 0} Students',
                                          style: TextStyle(
                                            color: Colors.grey[500],
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  trailing: const Icon(
                                      Icons.arrow_forward_ios_rounded,
                                      size: 16,
                                      color: Color(0xFFE2E8F0)),
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

                        // Quick Actions / Upcoming
                        const Text(
                          'Ready to Stream?',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF4F46E5), Color(0xFF6366F1)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF4F46E5).withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Icon(Icons.video_camera_front,
                                      color: Colors.white, size: 32),
                                  Chip(
                                    label: Text('OFFLINE',
                                        style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 10)),
                                    backgroundColor: Colors.white24,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              const Text(
                                'Next Live Session',
                                style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500),
                              ),
                              const Text(
                                'No classes scheduled for today',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: const Color(0xFF4F46E5),
                                  minimumSize: const Size(double.infinity, 50),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16)),
                                ),
                                child: const Text('Go to Live Hub'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 100), // Spacing for FAB
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
