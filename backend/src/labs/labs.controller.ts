import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { LabsService } from './labs.service';

type RequestUser = {
  userId: string;
  role: Role;
};

type UploadedLabFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('labs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post('orders')
  @Roles(Role.DOCTOR)
  createOrder(@Req() req: { user: RequestUser }, @Body() dto: CreateLabOrderDto) {
    return this.labsService.createOrder(req.user.userId, dto);
  }

  @Patch('orders/:id/assign')
  @Roles(Role.DIAGNOSTIC)
  assign(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.labsService.assignOrder(req.user.userId, id);
  }

  @Patch('orders/:id/sample-collected')
  @Roles(Role.DIAGNOSTIC)
  sampleCollected(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.labsService.collectSample(req.user.userId, id);
  }

  @Patch('orders/:id/result-uploaded')
  @Roles(Role.DIAGNOSTIC)
  @UseInterceptors(FilesInterceptor('files', 10))
  resultUploaded(
    @Req() req: { user: RequestUser },
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: UploadedLabFile[] | undefined,
  ) {
    return this.labsService.uploadResult(req.user.userId, id, files);
  }

  @Patch('orders/:id/sent')
  @Roles(Role.DIAGNOSTIC)
  sent(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.labsService.markSent(req.user.userId, id);
  }

  @Get('orders/me')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.DIAGNOSTIC)
  listMine(@Req() req: { user: RequestUser }) {
    return this.labsService.listMine(req.user.userId, req.user.role);
  }

  @Get('orders/:id/result')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.DIAGNOSTIC)
  getResult(@Req() req: { user: RequestUser }, @Param('id', ParseUUIDPipe) id: string) {
    return this.labsService.getResult(req.user.userId, req.user.role, id);
  }
}
