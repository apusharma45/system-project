import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

type RequestUser = {
  userId: string;
  role: Role;
};

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.PATIENT)
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.createForPatient(req.user.userId, dto);
  }

  @Get('me')
  @Roles(Role.PATIENT, Role.DOCTOR)
  listMine(@Req() req: { user: RequestUser }) {
    return this.appointmentsService.listMine(req.user.userId, req.user.role);
  }

  @Patch(':id/confirm')
  @Roles(Role.DOCTOR)
  confirm(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.confirmByDoctor(req.user.userId, id);
  }

  @Patch(':id/call')
  @Roles(Role.DOCTOR)
  call(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.callByDoctor(req.user.userId, id);
  }

  @Patch(':id/in-visit')
  @Roles(Role.DOCTOR)
  markInVisit(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.markInVisitByDoctor(req.user.userId, id);
  }

  @Patch(':id/exam-done')
  @Roles(Role.DOCTOR)
  markExamDone(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.markExamDoneByDoctor(req.user.userId, id);
  }

  @Patch(':id/close')
  @Roles(Role.DOCTOR)
  close(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.closeByDoctor(req.user.userId, id);
  }

  @Patch(':id/cancel')
  @Roles(Role.PATIENT, Role.DOCTOR)
  cancel(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.role === Role.DOCTOR) {
      return this.appointmentsService.cancelByDoctor(req.user.userId, id);
    }
    return this.appointmentsService.cancelByPatient(req.user.userId, id);
  }
}
