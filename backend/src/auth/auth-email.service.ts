import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class AuthEmailService {
  private readonly logger = new Logger(AuthEmailService.name);

  async sendPasswordResetCode(params: { toEmail: string; fullName?: string | null; code: string }) {
    const provider = (process.env.MAIL_PROVIDER || 'resend').toLowerCase();
    if (provider !== 'resend') {
      throw new InternalServerErrorException('Unsupported mail provider configuration');
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('RESEND_API_KEY is not configured');
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
      throw new InternalServerErrorException('Failed to send reset code email');
    }
  }
}
