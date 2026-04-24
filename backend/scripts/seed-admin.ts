import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@medflow.local';
  const password = process.env.ADMIN_PASSWORD || 'Password123!';
  const fullName = process.env.ADMIN_FULL_NAME?.trim() || 'MedFlow Admin';
  const phone = process.env.ADMIN_PHONE?.trim() || '+8801700000000';
  const address = process.env.ADMIN_ADDRESS?.trim() || 'MedFlow Admin Console';

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        phone,
        address,
        role: Role.ADMIN,
        passwordHash,
      },
      create: {
        email,
        fullName,
        phone,
        address,
        role: Role.ADMIN,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
      },
    });

    console.log('Admin user seeded successfully.');
    console.log(
      JSON.stringify(
        {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          fullName: admin.fullName,
          password,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error('Admin seed failed:', error);
  process.exit(1);
});
