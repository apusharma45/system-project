import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkApp() {
    return { status: 'ok' as const };
  }

  @Get('db')
  checkDb() {
    return this.healthService.checkDatabase();
  }
}
