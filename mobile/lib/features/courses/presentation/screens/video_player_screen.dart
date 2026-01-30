import 'dart:io';
import 'package:flutter/material.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/course_model.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../downloads/data/download_repository.dart';
import '../../../payments/data/payment_repository.dart';
import '../../data/course_repository.dart';

class VideoPlayerScreen extends ConsumerStatefulWidget {
  final String courseId;
  final Course? courseObj;

  const VideoPlayerScreen({super.key, required this.courseId, this.courseObj});

  @override
  ConsumerState<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends ConsumerState<VideoPlayerScreen> {
  Course? _course;
  bool _isEnrolled = false;
  bool _checkingEnrollment = true;
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;
  bool _isLoading = true;
  bool _isDownloaded = false;
  String? _localFilePath;
  bool _isDownloading = false;
  double _downloadProgress = 0.0;

  @override
  void initState() {
    super.initState();
    _course = widget.courseObj;
    _loadCourseData();
  }

  Future<void> _loadCourseData() async {
    setState(() => _checkingEnrollment = true);
    try {
      final repo = ref.read(courseRepositoryProvider);
      // Fetch full details (including lectures)
      _course = await repo.getCourseById(widget.courseId);
      _isEnrolled = await repo.isEnrolled(widget.courseId);

      await _checkDownloadStatus();
    } catch (e) {
      debugPrint("Error loading course data: $e");
    } finally {
      if (mounted) {
        setState(() => _checkingEnrollment = false);
      }
    }
  }

  Future<void> _checkDownloadStatus() async {
    final repo = ref.read(downloadRepositoryProvider);
    _isDownloaded = await repo.isCourseDownloaded(widget.courseId);
    if (_isDownloaded) {
      _localFilePath = await repo.getLocalFilePath(widget.courseId);
    }
    if (mounted) _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    // Determine source: Local File or Network URL
    if (_isDownloaded && _localFilePath != null) {
      _videoPlayerController = VideoPlayerController.file(
        File(_localFilePath!),
      );
    } else {
      // Dummy Video URL for demo
      const videoUrl =
          'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4';
      _videoPlayerController = VideoPlayerController.networkUrl(
        Uri.parse(videoUrl),
      );
    }

    await _videoPlayerController!.initialize();

    _chewieController = ChewieController(
      videoPlayerController: _videoPlayerController!,
      autoPlay: true,
      looping: false,
      aspectRatio: 16 / 9,
      errorBuilder: (context, errorMessage) {
        return Center(
          child: Text(
            errorMessage,
            style: const TextStyle(color: Colors.white),
          ),
        );
      },
    );

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _initiatePayment() async {
    try {
      final payRepo = ref.read(paymentRepositoryProvider);
      final order = await payRepo.createOrder(widget.courseId);

      // In a real app, you'd open Cashfree SDK/Webview here.
      // For Demo, we'll simulate verification after a delay.
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Processing Payment...")),
        );
      }

      await Future.delayed(const Duration(seconds: 2));

      final success = await payRepo.verifyPayment(order['order_id']);

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Success! You are now enrolled."),
              backgroundColor: Colors.green,
            ),
          );
          _loadCourseData(); // Refresh state
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Payment failed or cancelled."),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Payment Error: $e")),
        );
      }
    }
  }

  Future<void> _startDownload() async {
    setState(() => _isDownloading = true);
    try {
      // Demo URL
      const videoUrl =
          'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4';
      final repo = ref.read(downloadRepositoryProvider);

      await repo.downloadCourseVideo(
        widget.courseId,
        widget.courseObj?.title ?? "Course Video",
        videoUrl,
        (received, total) {
          if (mounted) {
            setState(() {
              _downloadProgress = received / total;
            });
          }
        },
      );

      if (mounted) {
        setState(() {
          _isDownloading = false;
          _isDownloaded = true;
          _checkDownloadStatus(); // Refresh player to use local file
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Download Completed!")));
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isDownloading = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Download Failed: $e")));
      }
    }
  }

  @override
  void dispose() {
    _videoPlayerController?.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_checkingEnrollment && _course == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final course = _course ?? widget.courseObj!;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          course.title,
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header / Video Selection
            if (_isEnrolled)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Container(
                  color: Colors.black,
                  child: _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : Chewie(controller: _chewieController!),
                ),
              )
            else
              Stack(
                alignment: Alignment.center,
                children: [
                  Image.network(
                    ApiConstants.getImageUrl(course.thumbnail),
                    height: 220,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    height: 220,
                    width: double.infinity,
                    color: Colors.black.withValues(alpha: 0.3),
                  ),
                  const CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white24,
                    child: Icon(Icons.lock, color: Colors.white, size: 30),
                  ),
                ],
              ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              course.category,
                              style: TextStyle(
                                color: Theme.of(context).primaryColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              course.title,
                              style: GoogleFonts.outfit(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_isEnrolled && !_isDownloaded)
                        _isDownloading
                            ? CircularProgressIndicator(
                                value: _downloadProgress)
                            : IconButton(
                                onPressed: _startDownload,
                                icon: const Icon(
                                  Icons.download_for_offline_outlined,
                                  color: Colors.blue,
                                ),
                              ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  if (!_isEnrolled) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "LIFETIME ACCESS",
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue,
                                ),
                              ),
                              Text(
                                "₹${course.price}",
                                style: GoogleFonts.outfit(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade900,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          ElevatedButton(
                            onPressed: _initiatePayment,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text("BUY NOW"),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                  Text(
                    "About this course",
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    course.description,
                    style: TextStyle(height: 1.5, color: Colors.grey.shade700),
                  ),
                  const SizedBox(height: 32),
                  if (_isEnrolled) ...[
                    Text(
                      "Course Content",
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (course.lectures.isEmpty)
                      const Text("No lectures available yet.")
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: course.lectures.length,
                        separatorBuilder: (_, __) => const Divider(),
                        itemBuilder: (context, index) {
                          final lecture = course.lectures[index];
                          return ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.grey.shade100,
                              child: Text(
                                "${index + 1}",
                                style: const TextStyle(
                                  color: Colors.black54,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            title: Text(
                              lecture.title,
                              style:
                                  const TextStyle(fontWeight: FontWeight.w500),
                            ),
                            subtitle: Text(
                              lecture.isLive ? "Live Session" : "Video Lesson",
                            ),
                            trailing: const Icon(Icons.play_circle_outline),
                            onTap: () {
                              // In a real app, update the video player source here
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content: Text("Loading: ${lecture.title}")),
                              );
                            },
                          );
                        },
                      ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
