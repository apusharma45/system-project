import 'api_exception.dart';

const String kNetworkErrorMessage =
    'Network error. Please check your connection and try again.';

String userFacingErrorMessage(
  Object? error, {
  String fallback = 'Something went wrong. Please try again.',
}) {
  if (error is ApiException) {
    final message = error.message.trim();
    if (_looksLikeNetworkIssue(message)) {
      return kNetworkErrorMessage;
    }
    if (message.isEmpty || message == 'Request failed') {
      return fallback;
    }
    return message;
  }

  final raw = error?.toString().trim() ?? '';
  if (_looksLikeNetworkIssue(raw)) {
    return kNetworkErrorMessage;
  }
  return fallback;
}

bool _looksLikeNetworkIssue(String value) {
  final lower = value.toLowerCase();
  return lower.contains('network error') ||
      lower.contains('socketexception') ||
      lower.contains('failed host lookup') ||
      lower.contains('connection refused') ||
      lower.contains('connection failed') ||
      lower.contains('timed out') ||
      lower.contains('localhost:3000') ||
      lower.contains('os error');
}
