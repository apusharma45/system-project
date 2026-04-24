import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateDiagnosticMyProfileDto } from './dto/update-my-profile.dto';
import { DiagnosticService } from './diagnostic.service';

type RequestUser = {
  userId: string;
};

@Controller('diagnostic')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Get('me/profile')
  @Roles(Role.DIAGNOSTIC)
  getMyProfile(@Req() req: { user: RequestUser }) {
    return this.diagnosticService.getMyProfile(req.user.userId);
  }

  @Patch('me/profile')
  @Roles(Role.DIAGNOSTIC)
  updateMyProfile(
    @Req() req: { user: RequestUser },
    @Body() dto: UpdateDiagnosticMyProfileDto,
  ) {
    return this.diagnosticService.updateMyProfile(req.user.userId, dto);
  }

  @Get(':diagnosticId/profile')
  @Roles(Role.ADMIN)
  getProfileForAdmin(@Param('diagnosticId', ParseUUIDPipe) diagnosticId: string) {
    return this.diagnosticService.getProfileForAdmin(diagnosticId);
  }

  @Patch(':diagnosticId/profile')
  @Roles(Role.ADMIN)
  updateProfileForAdmin(
    @Param('diagnosticId', ParseUUIDPipe) diagnosticId: string,
    @Body() dto: UpdateDiagnosticMyProfileDto,
  ) {
    return this.diagnosticService.updateProfileForAdmin(diagnosticId, dto);
  }
}
