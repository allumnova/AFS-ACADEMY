class Lecture {
  final String id;
  final String title;
  final String? description;
  final String? videoUrl;
  final bool isLive;
  final DateTime? startTime;
  final bool isCompleted;

  Lecture({
    required this.id,
    required this.title,
    this.description,
    this.videoUrl,
    required this.isLive,
    this.startTime,
    this.isCompleted = false,
  });

  factory Lecture.fromJson(Map<String, dynamic> json) {
    return Lecture(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      videoUrl: json['videoUrl'],
      isLive: json['isLive'] ?? false,
      startTime:
          json['startTime'] != null ? DateTime.parse(json['startTime']) : null,
      isCompleted: json['isCompleted'] ?? false,
    );
  }
}
