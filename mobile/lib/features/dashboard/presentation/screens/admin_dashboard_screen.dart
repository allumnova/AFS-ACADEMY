import 'package:flutter/material.dart';
import '../../../../core/services/admin_service.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../../core/widgets/loading_indicator.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

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
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5), // Emerald-50
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFD1FAE5)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF10B981), // Emerald-500
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'SYSTEM HEALTHY',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF059669), // Emerald-600
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
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
                              icon: Icons.network_check_outlined,
                              title: 'Server Load',
                              value: '24%',
                              subtitle: 'Optimal',
                              iconColor: Colors.amber,
                              backgroundColor: Colors.amber[50],
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),

                        // Platform Insights (New - matched to Web)
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
                              const Text(
                                'Platform Insights',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 24),

                              // Storage Usage
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('STORAGE USAGE',
                                      style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey[500])),
                                  Text('65%',
                                      style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey[500])),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: 0.65,
                                  minHeight: 8,
                                  backgroundColor: const Color(0xFFF1F5F9),
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(
                                          Color(0xFF2563EB)),
                                ),
                              ),

                              const SizedBox(height: 20),

                              // API Requests
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('API REQUESTS',
                                      style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey[500])),
                                  Text('12.5k / 50k',
                                      style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey[500])),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: 0.25,
                                  minHeight: 8,
                                  backgroundColor: const Color(0xFFF1F5F9),
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(
                                          Color(0xFF6366F1)),
                                ),
                              ),

                              const SizedBox(height: 24),
                              SizedBox(
                                width: double.infinity,
                                child: OutlinedButton(
                                  onPressed: () {},
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.grey[700],
                                    side: BorderSide(color: Colors.grey[300]!),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12),
                                  ),
                                  child: const Text('Download System Report'),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 32),
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
