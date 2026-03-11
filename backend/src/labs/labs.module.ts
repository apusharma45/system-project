import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LabsController } from './labs.controller';
import { LabsService } from './labs.service';

@Module({
  imports: [NotificationsModule, AuditModule, CloudinaryModule],
  controllers: [LabsController],
  providers: [LabsService],
})
export class LabsModule {}
