class AppConfig {
  const AppConfig({required this.apiBaseUrl, required this.wsBaseUrl});

  final String apiBaseUrl;
  final String wsBaseUrl;

  static AppConfig fromEnvironment() {
    const api = String.fromEnvironment(
      'APP_API_BASE_URL',
      defaultValue: 'http://10.0.2.2:3000',
    );
    const ws = String.fromEnvironment(
      'APP_WS_BASE_URL',
      defaultValue: 'ws://10.0.2.2:3000',
    );
    return const AppConfig(apiBaseUrl: api, wsBaseUrl: ws);
  }
}
