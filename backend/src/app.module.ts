import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LabsModule } from './labs/labs.module';

@Module({
  imports: [PrismaModule, HealthModule, UsersModule, AuthModule, AppointmentsModule, LabsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
