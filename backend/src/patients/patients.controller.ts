import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { PatientsService } from './patients.service';

type RequestUser = {
  userId: string;
};

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles(Role.ADMIN)
  listPatients() {
    return this.patientsService.listPatientsForAdmin();
  }

  @Get('me/profile')
  @Roles(Role.PATIENT)
  getMyProfile(@Req() req: { user: RequestUser }) {
    return this.patientsService.getMyProfile(req.user.userId);
  }

  @Patch('me/profile')
  @Roles(Role.PATIENT)
  updateMyProfile(@Req() req: { user: RequestUser }, @Body() dto: UpdateMyProfileDto) {
    return this.patientsService.updateMyProfile(req.user.userId, dto);
  }

  @Get(':patientId/admin-profile')
  @Roles(Role.ADMIN)
  getProfileForAdmin(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.patientsService.getProfileForAdmin(patientId);
  }

  @Patch(':patientId/admin-profile')
  @Roles(Role.ADMIN)
  updateProfileForAdmin(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.patientsService.updateProfileForAdmin(patientId, dto);
  }

  @Get(':patientId/profile')
  @Roles(Role.DOCTOR)
  getProfile(
    @Req() req: { user: RequestUser },
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.patientsService.getProfileForDoctor(req.user.userId, patientId);
  }
}
