"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmailService = void 0;
const common_1 = require("@nestjs/common");
let AuthEmailService = AuthEmailService_1 = class AuthEmailService {
    logger = new common_1.Logger(AuthEmailService_1.name);
    async sendPasswordResetCode(params) {
        const provider = (process.env.MAIL_PROVIDER || 'resend').toLowerCase();
        if (provider !== 'resend') {
            throw new common_1.InternalServerErrorException('Unsupported mail provider configuration');
        }
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException('RESEND_API_KEY is not configured');
        }
        const from = process.env.MAIL_FROM || 'MedFlow <no-reply@medlfow.com>';
        const recipientName = params.fullName?.trim() || 'there';
        const subject = 'Your MedFlow password reset code';
        const text = `Hi ${recipientName},\n\nYour MedFlow password reset code is: ${params.code}\n\nThis code expires in 10 minutes.\nIf you did not request this, you can ignore this email.`;
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [params.toEmail],
                subject,
                text,
            }),
        });
        if (!response.ok) {
            const body = await response.text();
            this.logger.error(`Failed to send reset email (${response.status}): ${body}`);
            throw new common_1.InternalServerErrorException('Failed to send reset code email');
        }
    }
};
exports.AuthEmailService = AuthEmailService;
exports.AuthEmailService = AuthEmailService = AuthEmailService_1 = __decorate([
    (0, common_1.Injectable)()
], AuthEmailService);
//# sourceMappingURL=auth-email.service.js.map