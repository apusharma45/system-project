import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { ROLE_VALUES, RoleValue } from '../role.values';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(ROLE_VALUES)
  role: RoleValue;
}
