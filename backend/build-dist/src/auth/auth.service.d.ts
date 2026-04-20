import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthEmailService } from './auth-email.service';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly prisma;
    private readonly usersService;
    private readonly authEmailService;
    private readonly jwtService;
    private static readonly RESET_CODE_EXPIRES_MINUTES;
    private static readonly RESET_CODE_MAX_ATTEMPTS;
    constructor(prisma: PrismaService, usersService: UsersService, authEmailService: AuthEmailService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    requestPasswordReset(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private signToken;
    private assertRequiredRoleFields;
}
