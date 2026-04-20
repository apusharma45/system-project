import 'package:flutter_test/flutter_test.dart';

import 'package:frontend_mobile/app/router/route_params.dart';

void main() {
  test('route param parser returns null for null and blank values', () {
    expect(RouteParam.parse(null), isNull);
    expect(RouteParam.parse(''), isNull);
    expect(RouteParam.parse('   '), isNull);
  });

  test('route param parser trims and keeps valid values', () {
    final value = RouteParam.parse('  doc-1  ');
    expect(value, isNotNull);
    expect(value!.value, 'doc-1');
  });
}
