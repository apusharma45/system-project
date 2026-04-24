import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdatePharmacyMyProfileDto } from './dto/update-my-profile.dto';
import { PharmaciesService } from './pharmacies.service';

type RequestUser = {
  userId: string;
};

@Controller('pharmacies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Get('me/profile')
  @Roles(Role.PHARMACY)
  getMyProfile(@Req() req: { user: RequestUser }) {
    return this.pharmaciesService.getMyProfile(req.user.userId);
  }

  @Patch('me/profile')
  @Roles(Role.PHARMACY)
  updateMyProfile(@Req() req: { user: RequestUser }, @Body() dto: UpdatePharmacyMyProfileDto) {
    return this.pharmaciesService.updateMyProfile(req.user.userId, dto);
  }

  @Get(':pharmacyId/profile')
  @Roles(Role.ADMIN)
  getProfileForAdmin(@Param('pharmacyId', ParseUUIDPipe) pharmacyId: string) {
    return this.pharmaciesService.getProfileForAdmin(pharmacyId);
  }

  @Patch(':pharmacyId/profile')
  @Roles(Role.ADMIN)
  updateProfileForAdmin(
    @Param('pharmacyId', ParseUUIDPipe) pharmacyId: string,
    @Body() dto: UpdatePharmacyMyProfileDto,
  ) {
    return this.pharmaciesService.updateProfileForAdmin(pharmacyId, dto);
  }
}
