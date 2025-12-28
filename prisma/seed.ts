import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de desenvolvimento...");


  /*PARA EXECUTAR O BANCO USE ESSE COMANDO
   npx prisma db seed --preview-feature
  
  */
  /* =======================
     ADMIN
  ======================= */
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@balsamo.com" },
    update: {},
    create: {
      email: "admin@balsamo.com",
      password: passwordHash,
    },
  });

  /* =======================
     SERVIÇOS
  ======================= */
  const services = await prisma.service.createMany({
    data: [
      {
        name: "Massagem Relaxante",
        price: 120,
        durationMin: 60,
        details: ["Redução do estresse", "Relaxamento profundo"],
      },
      {
        name: "Pedras Quentes",
        price: 150,
        durationMin: 70,
        details: ["Alívio de tensões", "Circulação"],
      },
      {
        name: "Quick Massage",
        price: 80,
        durationMin: 30,
        details: ["Ideal para pausas rápidas"],
      },
      {
        name: "Drenagem Linfática",
        price: 130,
        durationMin: 60,
        details: ["Redução de inchaço", "Bem-estar"],
      },
    ],
  });

  const allServices = await prisma.service.findMany();

  /* =======================
     DISPONIBILIDADE
  ======================= */
  await prisma.availability.createMany({
    data: [
      { dayOfWeek: 1, openHour: 9, closeHour: 18, active: true },
      { dayOfWeek: 2, openHour: 9, closeHour: 18, active: true },
      { dayOfWeek: 3, openHour: 9, closeHour: 18, active: true },
      { dayOfWeek: 4, openHour: 9, closeHour: 18, active: true },
      { dayOfWeek: 5, openHour: 9, closeHour: 17, active: true },
    ],
  });

  /* =======================
     AGENDAMENTOS
  ======================= */
  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.booking.createMany({
    data: [
      {
        clientName: "Maria Silva",
        clientPhone: "24999999999",
        clientEmail: "maria@email.com",
        startDateTime: today,
        endDateTime: new Date(today.getTime() + 60 * 60000),
        serviceId: allServices[0].id,
        status: BookingStatus.PENDENTE,
      },
      {
        clientName: "Ana Paula",
        clientPhone: "24988888888",
        clientEmail: "ana@email.com",
        startDateTime: tomorrow,
        endDateTime: new Date(tomorrow.getTime() + 60 * 60000),
        serviceId: allServices[1].id,
        status: BookingStatus.PENDENTE,
      },
      {
        clientName: "João Pedro",
        clientPhone: "24977777777",
        startDateTime: nextWeek,
        endDateTime: new Date(nextWeek.getTime() + 30 * 60000),
        serviceId: allServices[2].id,
        status: BookingStatus.CONCLUIDO,
      },
      {
        clientName: "Fernanda Lima",
        clientPhone: "24966666666",
        startDateTime: nextWeek,
        endDateTime: new Date(nextWeek.getTime() + 60 * 60000),
        serviceId: allServices[3].id,
        status: BookingStatus.CANCELADO,
      },
    ],
  });

  /* =======================
     AVALIAÇÕES
  ======================= */
  await prisma.testimonial.createMany({
    data: [
      {
        author: "Maria Silva",
        message: "Atendimento maravilhoso, saí renovada!",
        rating: 5,
        approved: true,
      },
      {
        author: "Ana Paula",
        message: "Ambiente calmo e muito profissional.",
        rating: 4,
        approved: true,
      },
      {
        author: "Cliente Anônimo",
        message: "Gostei bastante, recomendo.",
        rating: 5,
        approved: false, // para testar moderação
      },
    ],
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
