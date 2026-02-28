import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT, Role.DOCTOR, Role.DIAGNOSTIC, Role.PHARMACY, Role.ADMIN)
  @Get('me')
  me(@Req() req: { user: unknown }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT, Role.ADMIN)
  @Get('doctors')
  listDoctors() {
    return this.usersService.listByRole(Role.DOCTOR);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  @Get('pharmacies')
  listPharmacies() {
    return this.usersService.listByRole(Role.PHARMACY);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  @Get('diagnostics')
  listDiagnostics() {
    return this.usersService.listByRole(Role.DIAGNOSTIC);
  }
}
