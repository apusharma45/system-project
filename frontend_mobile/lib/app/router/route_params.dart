class RouteParam {
  const RouteParam(this.value);

  final String value;

  static RouteParam? parse(String? value) {
    if (value == null) return null;
    final normalized = value.trim();
    if (normalized.isEmpty) return null;
    return RouteParam(normalized);
  }
}
