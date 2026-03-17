import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuditQueryDto } from './dto/audit-query.dto';
import { AuditService } from './audit.service';

type RequestUser = {
  userId: string;
};

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(Role.ADMIN)
  listForAdmin(@Query() query: AuditQueryDto) {
    return this.auditService.listForAdmin(query);
  }

  @Get('me')
  listMine(@Req() req: { user: RequestUser }, @Query() query: AuditQueryDto) {
    return this.auditService.listMine(req.user.userId, query);
  }

  @Get('entity/:entityType/:entityId')
  @Roles(Role.ADMIN)
  listByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query() query: AuditQueryDto,
  ) {
    return this.auditService.listByEntity(entityType, entityId, query);
  }
}
