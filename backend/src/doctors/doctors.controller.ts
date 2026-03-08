import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateDoctorMyProfileDto } from './dto/update-my-profile.dto';
import { DoctorsService } from './doctors.service';

type RequestUser = {
  userId: string;
};

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('me/profile')
  @Roles(Role.DOCTOR)
  getMyProfile(@Req() req: { user: RequestUser }) {
    return this.doctorsService.getMyProfile(req.user.userId);
  }

  @Patch('me/profile')
  @Roles(Role.DOCTOR)
  updateMyProfile(@Req() req: { user: RequestUser }, @Body() dto: UpdateDoctorMyProfileDto) {
    return this.doctorsService.updateMyProfile(req.user.userId, dto);
  }
}
