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
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Center(child: _renderRemoteVideo()),
          if (widget.isBroadcaster)
            Positioned(
              top: 40,
              right: 20,
              child: Container(
                width: 100,
                height: 150,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white),
                ),
                child: _renderLocalPreview(),
              ),
            ),

          // Chat Overlay
          DraggableScrollableSheet(
            initialChildSize: 0.4,
            minChildSize: 0.1,
            maxChildSize: 0.6,
            builder: (context, scrollController) {
              return LiveChatOverlay(courseId: widget.channelName);
            },
          ),

          // Top Back Button
          Positioned(
            top: 40,
            left: 10,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),

          // Bottom Controls (Float above chat sheet slightly if needed or put inside)
          // For simplicity, we put them at the very bottom right or top for now to avoid covering chat input
          Positioned(
            top: 40,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  "LIVE",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),

          // Mute/End Controls
          Positioned(
            bottom: 20,
            right: 20,
            child: Column(
              children: [
                if (widget.isBroadcaster)
                  FloatingActionButton(
                    heroTag: "mute",
                    mini: true,
                    backgroundColor: _muted ? Colors.white : Colors.blueAccent,
                    child: Icon(
                      _muted ? Icons.mic_off : Icons.mic,
                      color: _muted ? Colors.black : Colors.white,
                    ),
                    onPressed: () {
                      setState(() => _muted = !_muted);
                      _engine.muteLocalAudioStream(_muted);
                    },
                  ),
                const SizedBox(height: 10),
                FloatingActionButton(
                  heroTag: "end",
                  mini: true,
                  backgroundColor: Colors.red,
                  child: const Icon(Icons.call_end, color: Colors.white),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
        ],
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
      return const Center(child: CircularProgressIndicator());
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
      if (widget.isBroadcaster) {
        return const Center(
          child: Text("Broadcasting...", style: TextStyle(color: Colors.white)),
        );
      }
      return const Center(
        child: Text(
          "Waiting for Instructor...",
          style: TextStyle(color: Colors.white),
        ),
      );
    }
  }
}
