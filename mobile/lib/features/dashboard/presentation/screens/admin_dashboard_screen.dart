import 'package:flutter/material.dart';
import '../../../../core/services/admin_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/loading_indicator.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final AdminService _adminService = AdminService();
  Map<String, dynamic>? _stats;
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
      final stats = await _adminService.getDashboardStats();
      setState(() {
        _stats = stats;
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
        title: const Text('Admin Dashboard'),
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
                      Text('Access Denied',
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                        'You are not authorized to view this page',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        child: const Text('Return to Login'),
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
                          'Dashboard Overview',
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
                              icon: Icons.attach_money,
                              title: 'Total Revenue',
                              value:
                                  '${_stats?['revenue']?['currency'] ?? 'INR'} ${_stats?['revenue']?['total'] ?? 0}',
                              subtitle: '+20.1% from last month',
                              iconColor: Colors.green,
                              backgroundColor: Colors.green,
                            ),
                            StatCard(
                              icon: Icons.people_outline,
                              title: 'Active Students',
                              value: '${_stats?['users']?['students'] ?? 0}',
                              subtitle: '+180 new students',
                              iconColor: Colors.blue,
                            ),
                            StatCard(
                              icon: Icons.book_outlined,
                              title: 'Active Courses',
                              value: '${_stats?['courses']?['total'] ?? 0}',
                              subtitle: '+4 new courses',
                              iconColor: Theme.of(context).primaryColor,
                            ),
                            StatCard(
                              icon: Icons.video_library_outlined,
                              title: 'Live Sessions',
                              value: '12',
                              subtitle: 'Scheduled this week',
                              iconColor: Colors.orange,
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Quick Actions
                        const Text(
                          'Quick Actions',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          childAspectRatio: 2,
                          children: [
                            _buildQuickActionCard(
                              context,
                              icon: Icons.people,
                              title: 'Students',
                              onTap: () => Navigator.pushNamed(
                                  context, '/admin-students'),
                            ),
                            _buildQuickActionCard(
                              context,
                              icon: Icons.school,
                              title: 'Courses',
                              onTap: () => Navigator.pushNamed(
                                  context, '/admin-courses'),
                            ),
                            _buildQuickActionCard(
                              context,
                              icon: Icons.payment,
                              title: 'Payments',
                              onTap: () => Navigator.pushNamed(
                                  context, '/admin-payments'),
                            ),
                            _buildQuickActionCard(
                              context,
                              icon: Icons.check_circle,
                              title: 'Attendance',
                              onTap: () => Navigator.pushNamed(
                                  context, '/admin-attendance'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Recent Enrollments
                        const Text(
                          'Recent Enrollments',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        if (_stats?['enrollments']?['recent'] != null &&
                            _stats!['enrollments']['recent'].isNotEmpty)
                          Card(
                            child: ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount:
                                  _stats!['enrollments']['recent'].length,
                              separatorBuilder: (context, index) =>
                                  const Divider(height: 1),
                              itemBuilder: (context, index) {
                                final enrollment =
                                    _stats!['enrollments']['recent'][index];
                                return ListTile(
                                  leading: CircleAvatar(
                                    child: Text(
                                      (enrollment['student']?['name'] ?? 'U')[0]
                                          .toUpperCase(),
                                    ),
                                  ),
                                  title: Text(enrollment['student']?['name'] ??
                                      'Unknown'),
                                  subtitle: Text(
                                      enrollment['student']?['email'] ?? ''),
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        enrollment['course']?['title'] ?? '',
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        'Paid INR ${enrollment['course']?['price'] ?? 0}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.green[700],
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          )
                        else
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(24),
                              child: Center(
                                child: Text(
                                  'No recent enrollments to show',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildQuickActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(icon, color: Theme.of(context).primaryColor),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}
