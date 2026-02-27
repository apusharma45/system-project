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
import { Role } from '@prisma/client';
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
  constructor(private readonly appointments: AppointmentsService) {}

  @Post()
  @Roles(Role.PATIENT)
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateAppointmentDto) {
    return this.appointments.createForPatient(req.user.userId, dto);
  }

  @Get('me')
  @Roles(Role.PATIENT, Role.DOCTOR)
  listMine(@Req() req: { user: RequestUser }) {
    return this.appointments.listMyAppointments(req.user.userId, req.user.role);
  }

  @Patch(':id/confirm')
  @Roles(Role.DOCTOR)
  confirm(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.confirm(req.user.userId, id);
  }

  @Patch(':id/call')
  @Roles(Role.DOCTOR)
  call(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.call(req.user.userId, id);
  }

  @Patch(':id/in-visit')
  @Roles(Role.DOCTOR)
  markInVisit(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.markInVisit(req.user.userId, id);
  }

  @Patch(':id/exam-done')
  @Roles(Role.DOCTOR)
  markExamDone(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.markExamDone(req.user.userId, id);
  }

  @Patch(':id/close')
  @Roles(Role.DOCTOR)
  close(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.appointments.close(req.user.userId, id);
  }

  @Patch(':id/cancel')
  @Roles(Role.PATIENT, Role.DOCTOR)
  cancel(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.role === Role.DOCTOR) {
      return this.appointments.cancelByDoctor(req.user.userId, id);
    }
    return this.appointments.cancelByPatient(req.user.userId, id);
  }
}
