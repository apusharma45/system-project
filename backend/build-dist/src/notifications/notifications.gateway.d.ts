import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly logger;
    constructor(jwtService: JwtService);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    emitToUser(userId: string, event: string, payload: unknown): void;
    roomForUser(userId: string): string;
    private extractToken;
}
