// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@balsamo.com';
  const plain = process.env.ADMIN_PASSWORD || 'admin123';

  const password = await bcrypt.hash(plain, 10);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin já existe: ${email}`);
    return;
  }

  await prisma.admin.create({
    data: { email, password },
  });

  console.log(`✅ Admin criado: ${email} (senha: ${plain})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
