import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class ChatMessage {
  final String id;
  final String senderName;
  final String message;
  final DateTime timestamp;
  final bool isMe;

  ChatMessage({
    required this.id,
    required this.senderName,
    required this.message,
    required this.timestamp,
    required this.isMe,
  });
}

class ChatRepository {
  IO.Socket? _socket;
  Timer? _simulatedTimer;
  final _messageController = StreamController<ChatMessage>.broadcast();

  Stream<ChatMessage> get messageStream => _messageController.stream;

  void connect(String courseId, String userName) {
    // Mocking a connection using a public echo server or localhost if available
    // For demo, we will use a simulation since no backend socket server is running yet.

    /* 
    // Real implementation would look like this:
    _socket = IO.io('http://10.0.2.2:5000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    _socket!.connect();
    _socket!.on('message', (data) {
       _messageController.add(ChatMessage(...));
    });
    */

    // Simulating incoming messages for Demo
    _simulatedTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_messageController.isClosed) {
        timer.cancel();
        return;
      }
      _messageController.add(
        ChatMessage(
          id: DateTime.now().toString(),
          senderName: "Student ${timer.tick}",
          message: "This is a simulated live question #${timer.tick}!",
          timestamp: DateTime.now(),
          isMe: false,
        ),
      );
    });
  }

  void sendMessage(String message, String userName) {
    // Optimistic update
    final newMessage = ChatMessage(
      id: DateTime.now().toString(),
      senderName: userName,
      message: message,
      timestamp: DateTime.now(),
      isMe: true,
    );
    _messageController.add(newMessage);

    // _socket?.emit('sendMessage', {'message': message, 'user': userName});
  }

  void dispose() {
    _socket?.disconnect();
    _simulatedTimer?.cancel();
    _messageController.close();
  }
}

final chatRepositoryProvider = Provider.autoDispose<ChatRepository>((ref) {
  final repo = ChatRepository();
  ref.onDispose(() => repo.dispose());
  return repo;
});
