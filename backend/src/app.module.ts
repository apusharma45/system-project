import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LabsModule } from './labs/labs.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    LabsModule,
    PrescriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
