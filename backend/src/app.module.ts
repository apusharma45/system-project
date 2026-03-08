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
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { PatientsModule } from './patients/patients.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DoctorsModule } from './doctors/doctors.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    HealthModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    LabsModule,
    PrescriptionsModule,
    NotificationsModule,
    AuditModule,
    PatientsModule,
    DoctorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
