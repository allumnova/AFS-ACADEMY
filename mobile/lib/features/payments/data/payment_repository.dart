import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/constants/api_constants.dart';

class PaymentRepository {
  final Dio _dio = Dio();

  Future<Map<String, dynamic>> createOrder(String courseId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final response = await _dio.post(
        ApiConstants.createOrder,
        data: {'courseId': courseId},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to create payment order');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<bool> verifyPayment(String orderId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final response = await _dio.post(
        ApiConstants.verifyPayment,
        data: {'orderId': orderId},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200 && response.data['status'] == 'success') {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

final paymentRepositoryProvider = Provider((ref) => PaymentRepository());
