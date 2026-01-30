import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LocalDatabase {
  static const _dbName = "afs_academy.db";
  static const _dbVersion = 1;
  static const tableDownloads = "downloads";

  static final LocalDatabase instance = LocalDatabase._privateConstructor();
  static Database? _database;

  LocalDatabase._privateConstructor();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, _dbName);

    return await openDatabase(path, version: _dbVersion, onCreate: _onCreate);
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $tableDownloads (
        id TEXT PRIMARY KEY,
        courseId TEXT NOT NULL,
        title TEXT NOT NULL,
        filePath TEXT NOT NULL,
        progress INTEGER NOT NULL,
        status TEXT NOT NULL
      )
    ''');
  }

  // CRUD Operations
  Future<int> insertDownload(Map<String, dynamic> row) async {
    final db = await instance.database;
    return await db.insert(
      tableDownloads,
      row,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> getDownloads() async {
    final db = await instance.database;
    return await db.query(tableDownloads);
  }

  Future<Map<String, dynamic>?> getDownload(String courseId) async {
    final db = await instance.database;
    final results = await db.query(
      tableDownloads,
      where: 'courseId = ?',
      whereArgs: [courseId],
    );
    if (results.isNotEmpty) return results.first;
    return null;
  }

  Future<int> updateDownload(Map<String, dynamic> row) async {
    final db = await instance.database;
    String id = row['id'];
    return await db.update(
      tableDownloads,
      row,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> deleteDownload(String id) async {
    final db = await instance.database;
    return await db.delete(tableDownloads, where: 'id = ?', whereArgs: [id]);
  }
}

final localDatabaseProvider = Provider<LocalDatabase>(
  (ref) => LocalDatabase.instance,
);
