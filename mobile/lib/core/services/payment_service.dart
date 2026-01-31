import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../database/database_helper.dart';

class PaymentService {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;

  Future<String?> _getToken() async {
    final user = await _dbHelper.getUser();
    return user?['token'];
  }

  Map<String, String> _getHeaders(String? token) {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // Get my payments
  Future<List<dynamic>> getMyPayments() async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/payments'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as List<dynamic>;
      } else {
        throw Exception('Failed to load payments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching payments: $e');
    }
  }

  // Create order
  Future<Map<String, dynamic>> createOrder(
      Map<String, dynamic> orderData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/payments/orders'),
        headers: _getHeaders(token),
        body: json.encode(orderData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to create order: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating order: $e');
    }
  }

  // Verify payment
  Future<Map<String, dynamic>> verifyPayment(
      Map<String, dynamic> paymentData) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/payments/verify'),
        headers: _getHeaders(token),
        body: json.encode(paymentData),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to verify payment: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error verifying payment: $e');
    }
  }

  // Generate invoice
  Future<String> generateInvoice(String paymentId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No authentication token found');
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/payments/$paymentId/invoice'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['invoiceUrl'] ?? '';
      } else {
        throw Exception('Failed to generate invoice: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error generating invoice: $e');
    }
  }
}
