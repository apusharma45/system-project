import { MarkReadDto } from './dto/mark-read.dto';
import { NotificationsService } from './notifications.service';
type RequestUser = {
    userId: string;
};
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    listMine(req: {
        user: RequestUser;
    }): any;
    markAllRead(req: {
        user: RequestUser;
    }): any;
    markRead(req: {
        user: RequestUser;
    }, id: string, dto: MarkReadDto): Promise<any>;
}
export {};
