import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/domain/models.dart';
import '../../features/patient/data/mappers/patient_json_mapper.dart';

const _tokenKey = 'session_token';

enum AuthStatus { loading, unauthenticated, authenticated }

class SessionController extends ChangeNotifier {
  SessionController({required this.apiClient, required this.preferences});

  final ApiClient apiClient;
  final SharedPreferences preferences;

  AuthStatus _status = AuthStatus.loading;
  AuthStatus get status => _status;

  String? _token;
  String? get token => _token;

  CurrentUser? _user;
  CurrentUser? get user => _user;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  Future<void> bootstrap() async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    _token = preferences.getString(_tokenKey);
    if (_token == null || _token!.isEmpty) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return;
    }

    await _loadCurrentUser();
  }

  Future<void> login(String email, String password) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await apiClient.postJson(
        '/auth/login',
        <String, dynamic>{'email': email, 'password': password},
      );
      final accessToken = response['access_token'] as String?;
      if (accessToken == null || accessToken.isEmpty) {
        throw const ApiException('Missing access token in response');
      }
      await authenticateWithToken(accessToken);
    } catch (error) {
      _errorMessage = error is ApiException ? error.message : 'Login failed';
      _status = AuthStatus.unauthenticated;
      notifyListeners();
    }
  }

  Future<void> authenticateWithToken(String accessToken) async {
    _token = accessToken;
    await preferences.setString(_tokenKey, accessToken);
    await _loadCurrentUser();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    _errorMessage = null;
    await preferences.remove(_tokenKey);
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final me = await apiClient.getJson('/users/me');
      final user = mapCurrentUser(me);
      _user = user;
      _status = AuthStatus.authenticated;
      notifyListeners();
    } catch (error) {
      _token = null;
      _user = null;
      await preferences.remove(_tokenKey);
      _errorMessage = error is ApiException
          ? error.message
          : 'Session restore failed';
      _status = AuthStatus.unauthenticated;
      notifyListeners();
    }
  }
}
