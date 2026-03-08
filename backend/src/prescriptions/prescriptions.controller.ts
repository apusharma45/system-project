import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';
import { PrescriptionsService } from './prescriptions.service';

type RequestUser = {
  userId: string;
  role: Role;
};

type UploadedPrescriptionFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Req() req: { user: RequestUser }, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.createDraft(req.user.userId, dto);
  }

  @Patch(':id/sign')
  @Roles(Role.DOCTOR)
  sign(
    @Req() req: { user: RequestUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto?: UpdatePrescriptionNotesDto,
  ) {
    return this.prescriptionsService.signByDoctor(req.user.userId, id, dto);
  }

  @Patch(':id/send-patient')
  @Roles(Role.DOCTOR)
  sendPatient(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.sendToPatientByDoctor(req.user.userId, id);
  }

  @Patch(':id/send-pharmacy')
  @Roles(Role.DOCTOR)
  sendPharmacy(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.sendToPharmacyByDoctor(req.user.userId, id);
  }

  @Patch(':id/upload-document')
  @Roles(Role.DOCTOR)
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Req() req: { user: RequestUser },
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: UploadedPrescriptionFile | undefined,
  ) {
    return this.prescriptionsService.uploadDocumentByDoctor(req.user.userId, id, file);
  }

  @Patch(':id/dispense')
  @Roles(Role.PHARMACY)
  dispense(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.dispenseByPharmacy(req.user.userId, id);
  }

  @Get('me')
  @Roles(Role.DOCTOR, Role.PATIENT, Role.PHARMACY)
  listMine(@Req() req: { user: RequestUser }) {
    return this.prescriptionsService.listMine(req.user.userId, req.user.role);
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.PATIENT, Role.PHARMACY)
  getOne(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.getOne(req.user.userId, req.user.role, id);
  }
}
