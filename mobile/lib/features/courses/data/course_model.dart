class Course {
  final String id;
  final String title;
  final String description;
  final double price;
  final String thumbnail;
  final String category;
  final String level;

  Course({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.thumbnail,
    required this.category,
    required this.level,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: double.tryParse(json['price']?.toString() ?? '0') ?? 0.0,
      thumbnail: json['thumbnail'] ?? '',
      category: json['category'] ?? 'General',
      level: json['level'] ?? 'beginner',
    );
  }
}
