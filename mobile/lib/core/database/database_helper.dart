import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static const _dbName = "afs_academy_auth.db";
  static const _dbVersion = 1;
  static const tableUser = "user";

  static final DatabaseHelper instance = DatabaseHelper._privateConstructor();
  static Database? _database;

  DatabaseHelper._privateConstructor();

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
      CREATE TABLE $tableUser (
        id INTEGER PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        token TEXT NOT NULL
      )
    ''');
  }

  // User Operations
  Future<int> insertUser(Map<String, dynamic> user) async {
    final db = await instance.database;
    // Delete any existing user first (single user app)
    await db.delete(tableUser);
    return await db.insert(tableUser, user);
  }

  Future<Map<String, dynamic>?> getUser() async {
    final db = await instance.database;
    final results = await db.query(tableUser);
    if (results.isNotEmpty) return results.first;
    return null;
  }

  Future<int> updateUser(Map<String, dynamic> user) async {
    final db = await instance.database;
    return await db.update(
      tableUser,
      user,
      where: 'id = ?',
      whereArgs: [user['id']],
    );
  }

  Future<int> deleteUser() async {
    final db = await instance.database;
    return await db.delete(tableUser);
  }
}
