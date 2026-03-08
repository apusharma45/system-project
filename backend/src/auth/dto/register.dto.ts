import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ROLE_VALUES, RoleValue } from '../role.values';

const GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;

class PatientProfileRegisterDto {
  @IsString()
  @IsIn(GENDER_VALUES)
  gender: (typeof GENDER_VALUES)[number];

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @IsOptional()
  @IsString()
  currentMedications?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;
}

class ProfessionalProfileRegisterDto {
  @IsOptional()
  @IsString()
  @IsIn(GENDER_VALUES)
  gender?: (typeof GENDER_VALUES)[number];

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  pharmacyName?: string;

  @IsOptional()
  @IsString()
  labName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  degrees?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  licenseAuthority?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accreditations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableTests?: string[];
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(5)
  phone: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsString()
  @IsIn(ROLE_VALUES)
  role: RoleValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientProfileRegisterDto)
  patientProfile?: PatientProfileRegisterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfessionalProfileRegisterDto)
  professionalProfile?: ProfessionalProfileRegisterDto;
}
