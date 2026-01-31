import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/courses/presentation/screens/video_player_screen.dart';
import '../../features/courses/presentation/screens/my_courses_screen.dart';
import '../../features/courses/presentation/screens/course_detail_screen.dart';
import '../../features/courses/data/course_model.dart';
import '../../features/live/presentation/screens/live_class_screen.dart';
import '../../features/dashboard/presentation/screens/student_dashboard_screen.dart';
import '../../features/dashboard/presentation/screens/faculty_dashboard_screen.dart';
import '../../features/dashboard/presentation/screens/admin_dashboard_screen.dart';
import '../../features/quiz/presentation/screens/quiz_list_screen.dart';
import '../../features/quiz/presentation/screens/quiz_taking_screen.dart';
import '../../features/payments/presentation/screens/payment_history_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/admin/presentation/screens/courses_management_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const HomeScreen(),
      ),
      // Student Dashboard Routes
      GoRoute(
        path: '/student-dashboard',
        builder: (context, state) => const StudentDashboardScreen(),
      ),
      GoRoute(
        path: '/my-courses',
        builder: (context, state) => const MyCoursesScreen(),
      ),
      GoRoute(
        path: '/course-detail/:id',
        builder: (context, state) {
          final courseId = state.pathParameters['id']!;
          return CourseDetailScreen(courseId: courseId);
        },
      ),
      GoRoute(
        path: '/quiz-list/:courseId',
        builder: (context, state) {
          final courseId = state.pathParameters['courseId']!;
          return QuizListScreen(courseId: courseId);
        },
      ),
      GoRoute(
        path: '/quiz-taking/:quizId',
        builder: (context, state) {
          final quizId = state.pathParameters['quizId']!;
          return QuizTakingScreen(quizId: quizId);
        },
      ),
      GoRoute(
        path: '/payment-history',
        builder: (context, state) => const PaymentHistoryScreen(),
      ),
      // Faculty Dashboard Routes
      GoRoute(
        path: '/faculty-dashboard',
        builder: (context, state) => const FacultyDashboardScreen(),
      ),
      // Admin Dashboard Routes
      GoRoute(
        path: '/admin-dashboard',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/admin-courses',
        builder: (context, state) => const CoursesManagementScreen(),
      ),
      // Profile & Common Routes
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      // Existing Routes
      GoRoute(
        path: '/course/:id',
        builder: (context, state) {
          final courseId = state.pathParameters['id']!;
          final course = state.extra as Course?;
          return VideoPlayerScreen(courseId: courseId, courseObj: course);
        },
      ),
      GoRoute(
        path: '/live',
        builder: (context, state) {
          final isBroadcaster = state.extra as bool? ?? false;
          return LiveClassScreen(isBroadcaster: isBroadcaster);
        },
      ),
    ],
  );
});
