import 'package:flutter/material.dart';
import '../../../../core/services/course_service.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/loading_indicator.dart';

class CoursesManagementScreen extends StatefulWidget {
  const CoursesManagementScreen({Key? key}) : super(key: key);

  @override
  State<CoursesManagementScreen> createState() =>
      _CoursesManagementScreenState();
}

class _CoursesManagementScreenState extends State<CoursesManagementScreen> {
  final CourseService _courseService = CourseService();
  List<dynamic> _courses = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final courses = await _courseService.getAllCourses();
      setState(() {
        _courses = courses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteCourse(String courseId, String title) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Course'),
        content: Text('Are you sure you want to delete "$title"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _courseService.deleteCourse(courseId);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Course deleted successfully')),
        );
        _loadCourses();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete course: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Courses Management'),
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Loading courses...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline,
                          size: 64, color: Colors.red[300]),
                      const SizedBox(height: 16),
                      Text('Failed to load courses',
                          style: TextStyle(color: Colors.grey[600])),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadCourses,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _courses.isEmpty
                  ? EmptyState(
                      icon: Icons.school_outlined,
                      message: 'No courses found',
                      actionText: 'Create Course',
                      onAction: () {
                        Navigator.pushNamed(context, '/course-form');
                      },
                    )
                  : RefreshIndicator(
                      onRefresh: _loadCourses,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _courses.length,
                        itemBuilder: (context, index) {
                          final course = _courses[index];
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
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 4),
                                  Text(
                                      '${course['category'] ?? 'Development'} • ${course['level'] ?? 'Beginner'}'),
                                  Text('Price: INR ${course['price'] ?? 0}'),
                                ],
                              ),
                              isThreeLine: true,
                              trailing: PopupMenuButton(
                                itemBuilder: (context) => [
                                  const PopupMenuItem(
                                    value: 'view',
                                    child: Row(
                                      children: [
                                        Icon(Icons.visibility, size: 20),
                                        SizedBox(width: 8),
                                        Text('View'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: 'edit',
                                    child: Row(
                                      children: [
                                        Icon(Icons.edit, size: 20),
                                        SizedBox(width: 8),
                                        Text('Edit'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: 'delete',
                                    child: Row(
                                      children: [
                                        Icon(Icons.delete,
                                            size: 20, color: Colors.red),
                                        SizedBox(width: 8),
                                        Text('Delete',
                                            style:
                                                TextStyle(color: Colors.red)),
                                      ],
                                    ),
                                  ),
                                ],
                                onSelected: (value) {
                                  switch (value) {
                                    case 'view':
                                      Navigator.pushNamed(
                                        context,
                                        '/course-detail',
                                        arguments: course['id'],
                                      );
                                      break;
                                    case 'edit':
                                      Navigator.pushNamed(
                                        context,
                                        '/course-form',
                                        arguments: course,
                                      );
                                      break;
                                    case 'delete':
                                      _deleteCourse(course['id'],
                                          course['title'] ?? 'this course');
                                      break;
                                  }
                                },
                              ),
                            ),
                          );
                        },
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
