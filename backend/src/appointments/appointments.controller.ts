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
}
