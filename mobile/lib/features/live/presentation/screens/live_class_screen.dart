import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../chat/presentation/widgets/live_chat_overlay.dart';

// Placeholder App ID - User will need to replace this or we fetch from backend
const appId = "YOUR_AGORA_APP_ID";
const token = "YOUR_AGORA_TEMP_TOKEN";
const channel = "demo_channel";

class LiveClassScreen extends ConsumerStatefulWidget {
  final String channelName;
  final bool isBroadcaster;

  const LiveClassScreen({
    super.key,
    this.channelName = channel,
    this.isBroadcaster = false,
  });

  @override
  ConsumerState<LiveClassScreen> createState() => _LiveClassScreenState();
}

class _LiveClassScreenState extends ConsumerState<LiveClassScreen> {
  int? _remoteUid;
  bool _localUserJoined = false;
  late RtcEngine _engine;
  bool _muted = false;

  @override
  void initState() {
    super.initState();
    initAgora();
  }

  Future<void> initAgora() async {
    try {
      if (appId == "YOUR_AGORA_APP_ID") {
        debugPrint("Warning: Agora App ID is not set.");
        return;
      }

      // Retrieve permissions
      await [Permission.microphone, Permission.camera].request();

      // Create the engine
      _engine = createAgoraRtcEngine();
      await _engine.initialize(
        const RtcEngineContext(
          appId: appId,
          channelProfile: ChannelProfileType.channelProfileLiveBroadcasting,
        ),
      );

      _engine.registerEventHandler(
        RtcEngineEventHandler(
          onJoinChannelSuccess: (RtcConnection connection, int elapsed) {
            debugPrint("local user ${connection.localUid} joined");
            if (mounted) setState(() => _localUserJoined = true);
          },
          onUserJoined: (RtcConnection connection, int remoteUid, int elapsed) {
            debugPrint("remote user $remoteUid joined");
            if (mounted) setState(() => _remoteUid = remoteUid);
          },
          onUserOffline: (
            RtcConnection connection,
            int remoteUid,
            UserOfflineReasonType reason,
          ) {
            debugPrint("remote user $remoteUid left channel");
            if (mounted) setState(() => _remoteUid = null);
          },
          onTokenPrivilegeWillExpire: (RtcConnection connection, String token) {
            debugPrint(
              '[onTokenPrivilegeWillExpire] ${connection.toJson()} $token',
            );
          },
        ),
      );

      await _engine.setClientRole(
        role: widget.isBroadcaster
            ? ClientRoleType.clientRoleBroadcaster
            : ClientRoleType.clientRoleAudience,
      );

      await _engine.enableVideo();
      await _engine.startPreview();

      await _engine.joinChannel(
        token: token,
        channelId: widget.channelName,
        uid: 0,
        options: const ChannelMediaOptions(),
      );
    } catch (e) {
      debugPrint("Agora Init Error: $e");
    }
  }

  @override
  void dispose() {
    _engine.leaveChannel();
    _engine.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: Stack(
        children: [
          // Main Video Area
          Center(
            child: InteractiveViewer(
              child: _renderRemoteVideo(),
            ),
          ),

          // Header Gradient Overlay
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.7),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Top App Bar Area
          Positioned(
            top: 50,
            left: 16,
            right: 16,
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white24,
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.channelName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.redAccent,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            "LIVE",
                            style: TextStyle(
                              color: Colors.redAccent[100],
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Icon(Icons.people,
                              color: Colors.white70, size: 14),
                          const SizedBox(width: 4),
                          const Text(
                            "24", // Mock participant count
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Settings or more options could go here
                IconButton(
                  icon: const Icon(Icons.more_vert, color: Colors.white),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          // Local Preview (PiP)
          if (widget.isBroadcaster)
            Positioned(
              top: 120,
              right: 16,
              child: Container(
                width: 100,
                height: 150,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white24, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: _renderLocalPreview(),
                ),
              ),
            ),

          // Chat Overlay
          DraggableScrollableSheet(
            initialChildSize: 0.35,
            minChildSize: 0.1,
            maxChildSize: 0.6,
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors
                      .transparent, // Let the LiveChatOverlay handle its own background if needed, or transparent here
                ),
                child: LiveChatOverlay(courseId: widget.channelName),
              );
            },
          ),

          // Bottom Controls Bar
          Positioned(
            bottom: 30, // Above the safe area/nav bar
            left: 20,
            right: 20,
            child: SafeArea(
              child: Center(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildControlBtn(
                        icon: _muted ? Icons.mic_off : Icons.mic,
                        color: _muted ? Colors.redAccent : Colors.white,
                        bgColor: _muted ? Colors.white12 : Colors.white24,
                        onTap: () {
                          setState(() => _muted = !_muted);
                          _engine.muteLocalAudioStream(_muted);
                        },
                      ),
                      const SizedBox(width: 20),
                      _buildControlBtn(
                        icon: Icons.videocam,
                        color: Colors.white,
                        bgColor: Colors.white24,
                        onTap: () {
                          // Toggle video logic
                        },
                      ),
                      const SizedBox(width: 20),
                      if (widget.isBroadcaster)
                        _buildControlBtn(
                          icon: Icons.flip_camera_ios,
                          color: Colors.white,
                          bgColor: Colors.white24,
                          onTap: () {
                            _engine.switchCamera();
                          },
                        ),
                      if (widget.isBroadcaster) const SizedBox(width: 20),
                      _buildControlBtn(
                        icon: Icons.call_end,
                        color: Colors.white,
                        bgColor: Colors.red,
                        onTap: () => Navigator.of(context).pop(),
                        isEndCall: true,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildControlBtn({
    required IconData icon,
    required Color color,
    required Color bgColor,
    required VoidCallback onTap,
    bool isEndCall = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: isEndCall ? 56 : 48,
        height: isEndCall ? 56 : 48,
        decoration: BoxDecoration(
          color: bgColor,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: isEndCall ? 28 : 24),
      ),
    );
  }

  Widget _renderLocalPreview() {
    if (_localUserJoined && widget.isBroadcaster) {
      return AgoraVideoView(
        controller: VideoViewController(
          rtcEngine: _engine,
          canvas: const VideoCanvas(uid: 0),
        ),
      );
    } else {
      return Container(
        color: Colors.black,
        child: const Center(
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white30),
          ),
        ),
      );
    }
  }

  Widget _renderRemoteVideo() {
    if (_remoteUid != null) {
      return AgoraVideoView(
        controller: VideoViewController.remote(
          rtcEngine: _engine,
          canvas: VideoCanvas(uid: _remoteUid),
          connection: RtcConnection(channelId: widget.channelName),
        ),
      );
    } else {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.live_tv_outlined,
              size: 64, color: Colors.white.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          if (widget.isBroadcaster)
            const Text("Starting Broadcast...",
                style: TextStyle(color: Colors.white70))
          else
            const Text(
              "Waiting for Instructor...",
              style: TextStyle(color: Colors.white70),
            ),
        ],
      );
    }
  }
}
