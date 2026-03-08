import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seed PROD (seguro)...");

  /* =====================================================
     ADMIN PADRÃO (idempotente)
  ===================================================== */
  const adminEmail = "admin@balsamo.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
    },
  });

  console.log("✅ Admin verificado/criado");

  /* =====================================================
     DISPONIBILIDADE SEMANAL PADRÃO
     (1 registro por dia da semana)
  ===================================================== */
  const availabilityData = [
    { dayOfWeek: 0, openHour: 0, closeHour: 0, active: false }, // Domingo
    { dayOfWeek: 1, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 2, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 3, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 4, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 5, openHour: 9, closeHour: 17, active: true }, // Sexta
    { dayOfWeek: 6, openHour: 0, closeHour: 0, active: false }, // Sábado
  ];

  for (const item of availabilityData) {
    await prisma.availability.upsert({
      where: { dayOfWeek: item.dayOfWeek },
      update: {
        openHour: item.openHour,
        closeHour: item.closeHour,
        active: item.active,
      },
      create: item,
    });
  }

  console.log("✅ Disponibilidade semanal verificada/criada");

  console.log("🎉 Seed PROD finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed PROD:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });