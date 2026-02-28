import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarkReadDto } from './dto/mark-read.dto';
import { NotificationsService } from './notifications.service';

type RequestUser = {
  userId: string;
};

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  listMine(@Req() req: { user: RequestUser }) {
    return this.notificationsService.listMine(req.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Req() req: { user: RequestUser }) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Patch(':id/read')
  markRead(
    @Req() req: { user: RequestUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.notificationsService.markRead(req.user.userId, id, dto.read ?? true);
  }
}
