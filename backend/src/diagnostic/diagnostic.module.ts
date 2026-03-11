import { Module } from '@nestjs/common';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';

@Module({
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
})
export class DiagnosticModule {}
