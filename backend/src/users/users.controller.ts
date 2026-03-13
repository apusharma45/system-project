import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @Roles(Role.PATIENT, Role.DOCTOR, Role.DIAGNOSTIC, Role.PHARMACY, Role.ADMIN)
  @Patch('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Req() req: { user: { userId: string } },
    @UploadedFile()
    file:
      | {
          originalname: string;
          mimetype: string;
          size: number;
          buffer: Buffer;
        }
      | undefined,
  ) {
    return this.usersService.uploadMyAvatar(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT, Role.DOCTOR, Role.DIAGNOSTIC, Role.PHARMACY, Role.ADMIN)
  @Delete('me/avatar')
  removeAvatar(@Req() req: { user: { userId: string } }) {
    return this.usersService.removeMyAvatar(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT, Role.ADMIN)
  @Get('doctors')
  listDoctors() {
    return this.usersService.listDoctorsForPatients();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT, Role.ADMIN)
  @Get('doctors/:doctorId')
  getDoctorDetails(@Param('doctorId', ParseUUIDPipe) doctorId: string) {
    return this.usersService.getDoctorDetailsForPatients(doctorId);
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
