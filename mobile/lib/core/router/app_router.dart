import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/courses/presentation/screens/video_player_screen.dart';
import '../../features/courses/data/course_model.dart';
import '../../features/live/presentation/screens/live_class_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const HomeScreen(),
      ),
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
