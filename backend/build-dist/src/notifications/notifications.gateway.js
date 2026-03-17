"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    jwtService;
    logger = new common_1.Logger(NotificationsGateway_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    server;
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'test-secret',
            });
            client.data.user = {
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
            };
            client.join(this.roomForUser(payload.sub));
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.debug(`Socket disconnected: ${client.id}`);
    }
    emitToUser(userId, event, payload) {
        this.server.to(this.roomForUser(userId)).emit(event, payload);
    }
    roomForUser(userId) {
        return `user:${userId}`;
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (typeof authToken === 'string' && authToken.trim().length > 0) {
            return authToken.startsWith('Bearer ') ? authToken.slice(7) : authToken;
        }
        const headerAuth = client.handshake.headers.authorization;
        if (typeof headerAuth === 'string' && headerAuth.startsWith('Bearer ')) {
            return headerAuth.slice(7);
        }
        return null;
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/notifications',
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map