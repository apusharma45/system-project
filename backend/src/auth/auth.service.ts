import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    this.assertRequiredRoleFields(dto);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const patientProfile =
      dto.role === 'PATIENT'
        ? {
            gender: dto.patientProfile!.gender,
            dateOfBirth: new Date(dto.patientProfile!.dateOfBirth),
            allergies: dto.patientProfile?.allergies,
            chronicConditions: dto.patientProfile?.chronicConditions,
            currentMedications: dto.patientProfile?.currentMedications,
            emergencyContactName: dto.patientProfile?.emergencyContactName,
            emergencyContactPhone: dto.patientProfile?.emergencyContactPhone,
            emergencyContactRelation: dto.patientProfile?.emergencyContactRelation,
          }
        : undefined;

    const professionalProfile =
      dto.role === 'DOCTOR' || dto.role === 'PHARMACY' || dto.role === 'DIAGNOSTIC'
        ? {
            gender: dto.professionalProfile?.gender,
            dateOfBirth: dto.professionalProfile?.dateOfBirth
              ? new Date(dto.professionalProfile.dateOfBirth)
              : undefined,
            licenseNumber: dto.professionalProfile?.licenseNumber,
            specialization: dto.professionalProfile?.specialization,
            pharmacyName: dto.professionalProfile?.pharmacyName,
            labName: dto.professionalProfile?.labName,
            degrees: dto.professionalProfile?.degrees,
            certifications: dto.professionalProfile?.certifications,
            yearsOfExperience: dto.professionalProfile?.yearsOfExperience,
            licenseAuthority: dto.professionalProfile?.licenseAuthority,
            accreditations: dto.professionalProfile?.accreditations,
            availableTests: dto.professionalProfile?.availableTests,
          }
        : undefined;

    const user = await this.usersService.createUser({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role as Role,
      phone: dto.phone,
      address: dto.address,
      patientProfile,
      professionalProfile,
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email, user.role);
  }

  private async signToken(userId: string, email: string, role: Role) {
    return {
      access_token: await this.jwtService.signAsync({
        sub: userId,
        email,
        role,
      }),
    };
  }

  private assertRequiredRoleFields(dto: RegisterDto) {
    if (dto.role === 'PATIENT') {
      if (!dto.patientProfile) {
        throw new BadRequestException('patientProfile is required for PATIENT registration');
      }
      const patientProfile = dto.patientProfile;
      if (!patientProfile.gender) {
        throw new BadRequestException('patientProfile.gender is required for PATIENT registration');
      }
      if (!patientProfile.dateOfBirth) {
        throw new BadRequestException('patientProfile.dateOfBirth is required for PATIENT registration');
      }
      return;
    }

    if (dto.role === 'DOCTOR') {
      if (!dto.professionalProfile) {
        throw new BadRequestException('professionalProfile is required for DOCTOR registration');
      }
      const professionalProfile = dto.professionalProfile;
      if (!professionalProfile.gender) {
        throw new BadRequestException('professionalProfile.gender is required for DOCTOR registration');
      }
      if (!professionalProfile.dateOfBirth) {
        throw new BadRequestException('professionalProfile.dateOfBirth is required for DOCTOR registration');
      }
      if (!professionalProfile.licenseNumber) {
        throw new BadRequestException('professionalProfile.licenseNumber is required for DOCTOR registration');
      }
      if (!professionalProfile.specialization) {
        throw new BadRequestException('professionalProfile.specialization is required for DOCTOR registration');
      }
      return;
    }

    if (dto.role === 'PHARMACY') {
      if (!dto.professionalProfile) {
        throw new BadRequestException('professionalProfile is required for PHARMACY registration');
      }
      const professionalProfile = dto.professionalProfile;
      if (!professionalProfile.licenseNumber) {
        throw new BadRequestException('professionalProfile.licenseNumber is required for PHARMACY registration');
      }
      if (!professionalProfile.pharmacyName) {
        throw new BadRequestException('professionalProfile.pharmacyName is required for PHARMACY registration');
      }
      return;
    }

    if (dto.role === 'DIAGNOSTIC') {
      if (!dto.professionalProfile) {
        throw new BadRequestException('professionalProfile is required for DIAGNOSTIC registration');
      }
      const professionalProfile = dto.professionalProfile;
      if (!professionalProfile.licenseNumber) {
        throw new BadRequestException('professionalProfile.licenseNumber is required for DIAGNOSTIC registration');
      }
      if (!professionalProfile.labName) {
        throw new BadRequestException('professionalProfile.labName is required for DIAGNOSTIC registration');
      }
    }
  }
}
