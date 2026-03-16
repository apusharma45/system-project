import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'resetCode must be a 6-digit code' })
  resetCode: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
