import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PatientsService } from './patients.service';

type RequestUser = {
  userId: string;
};

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':patientId/profile')
  @Roles(Role.DOCTOR)
  getProfile(
    @Req() req: { user: RequestUser },
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.patientsService.getProfileForDoctor(req.user.userId, patientId);
  }
}
