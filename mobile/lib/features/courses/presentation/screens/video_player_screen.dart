import 'dart:io';
import 'package:flutter/material.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/course_model.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../features/downloads/data/download_repository.dart';

class VideoPlayerScreen extends ConsumerStatefulWidget {
  final String courseId; // We could pass the full Course object via extra
  final Course? courseObj;

  const VideoPlayerScreen({super.key, required this.courseId, this.courseObj});

  @override
  ConsumerState<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends ConsumerState<VideoPlayerScreen> {
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
    _checkDownloadStatus();
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
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            Stack(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Container(
                    color: Colors.black,
                    child: _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : Chewie(controller: _chewieController!),
                  ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
              ],
            ),
            Expanded(
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            widget.courseObj?.title ?? "Course Video",
                            style: GoogleFonts.outfit(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        if (!_isDownloaded)
                          _isDownloading
                              ? CircularProgressIndicator(
                                  value: _downloadProgress,
                                )
                              : IconButton(
                                  onPressed: _startDownload,
                                  icon: const Icon(
                                    Icons.download,
                                    color: Colors.blueAccent,
                                  ),
                                  tooltip: "Download for Offline",
                                )
                        else
                          Row(
                            children: [
                              const Icon(
                                Icons.check_circle,
                                color: Colors.green,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "Downloaded",
                                style: GoogleFonts.outfit(
                                  color: Colors.green,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.courseObj?.category ?? "General",
                      style: GoogleFonts.outfit(
                        fontSize: 14,
                        color: Colors.blueGrey,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Divider(),
                    const SizedBox(height: 10),
                    Text(
                      "Description",
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.courseObj?.description ??
                          "No description available.",
                      style: GoogleFonts.outfit(color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
