import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private static readonly REGISTER_SELECT = {
    id: true,
    email: true,
    role: true,
    avatarUrl: true,
  } as const;

  private static readonly ALLOWED_AVATAR_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

  private static readonly MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async uploadMyAvatar(
    userId: string,
    file:
      | {
          originalname: string;
          mimetype: string;
          size: number;
          buffer: Buffer;
        }
      | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }
    if (!UsersService.ALLOWED_AVATAR_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only jpg, png, and webp images are allowed');
    }
    if (file.size > UsersService.MAX_AVATAR_SIZE_BYTES) {
      throw new BadRequestException('Avatar image must be 5MB or smaller');
    }

    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        avatarPublicId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const upload = await this.cloudinaryService.uploadBuffer({
      buffer: file.buffer,
      fileName: file.originalname,
      folder: `profile-avatars/${userId}`,
      contentType: file.mimetype,
      resourceType: 'image',
    });

    if (existing.avatarPublicId) {
      await this.cloudinaryService.destroy(existing.avatarPublicId, 'image');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: upload.url,
        avatarPublicId: upload.publicId,
        avatarMimeType: upload.mimeType,
        avatarSizeBytes: upload.bytes,
      },
      select: {
        id: true,
        avatarUrl: true,
      },
    });

    return {
      user: updated,
    };
  }

  async removeMyAvatar(userId: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        avatarPublicId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (existing.avatarPublicId) {
      await this.cloudinaryService.destroy(existing.avatarPublicId, 'image');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: null,
        avatarPublicId: null,
        avatarMimeType: null,
        avatarSizeBytes: null,
      },
      select: {
        id: true,
        avatarUrl: true,
      },
    });

    return {
      user: updated,
    };
  }

  createUser(params: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: Role;
    phone: string;
    address: string;
    patientProfile?: {
      gender: string;
      dateOfBirth: Date;
      allergies?: string;
      chronicConditions?: string;
      currentMedications?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      emergencyContactRelation?: string;
    };
    professionalProfile?: {
      gender?: string;
      dateOfBirth?: Date;
      licenseNumber?: string;
      specialization?: string;
      pharmacyName?: string;
      labName?: string;
      degrees?: string[];
      certifications?: string[];
      yearsOfExperience?: number;
      licenseAuthority?: string;
      accreditations?: string[];
      availableTests?: string[];
    };
  }) {
    const {
      fullName,
      email,
      passwordHash,
      role,
      phone,
      address,
      patientProfile,
      professionalProfile,
    } = params;

    return this.prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        phone,
        address,
        patientProfile: patientProfile ? { create: patientProfile } : undefined,
        professionalProfile: professionalProfile ? { create: professionalProfile } : undefined,
      },
      select: UsersService.REGISTER_SELECT,
    });
  }

  listByRole(role: Role) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listDoctorsForPatients() {
    return this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        role: true,
        professionalProfile: {
          select: {
            specialization: true,
            yearsOfExperience: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }).then((items) =>
      items.map((item) => ({
        id: item.id,
        fullName: item.fullName,
        avatarUrl: item.avatarUrl,
        email: item.email,
        role: item.role,
        specialization: item.professionalProfile?.specialization ?? null,
        yearsOfExperience: item.professionalProfile?.yearsOfExperience ?? null,
      })),
    );
  }

  async getDoctorDetailsForPatients(doctorId: string) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        professionalProfile: {
          select: {
            specialization: true,
            yearsOfExperience: true,
            degrees: true,
            about: true,
            clinicName: true,
            clinicAddress: true,
            clinicPhone: true,
            availableTimeSlots: true,
          },
        },
      },
    });

    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }

    return {
      doctor: {
        id: doctor.id,
        fullName: doctor.fullName,
        avatarUrl: doctor.avatarUrl,
        email: doctor.email,
        role: doctor.role,
        phone: doctor.phone,
        address: doctor.address,
        specialization: doctor.professionalProfile?.specialization ?? null,
        yearsOfExperience: doctor.professionalProfile?.yearsOfExperience ?? null,
        degrees: doctor.professionalProfile?.degrees ?? null,
        about: doctor.professionalProfile?.about ?? null,
        clinicName: doctor.professionalProfile?.clinicName ?? null,
        clinicAddress: doctor.professionalProfile?.clinicAddress ?? null,
        clinicPhone: doctor.professionalProfile?.clinicPhone ?? null,
        availableTimeSlots: doctor.professionalProfile?.availableTimeSlots ?? null,
      },
    };
  }
}
