import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* =====================================================
   Helpers
===================================================== */
function nextWeekday(day: number, hour = 10) {
  const date = new Date();
  const diff = (day + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
  date.setHours(hour, 0, 0, 0);
  return date;
}

/* =====================================================
   Seed DEV
===================================================== */
async function main() {
  console.log("🌱 Iniciando seed DEV (reset completo)...");

  /* =====================================================
     LIMPEZA (ordem importa)
  ===================================================== */
  await prisma.booking.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();

  /* =====================================================
     ADMIN
  ===================================================== */
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@balsamo.com" },
    update: {},
    create: {
      email: "admin@balsamo.com",
      password: passwordHash,
    },
  });

  /* =====================================================
     SERVIÇOS
  ===================================================== */
  const servicesData = [
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
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }

  const services = await prisma.service.findMany();

  /* =====================================================
     DISPONIBILIDADE SEMANAL
     (1 registro por dia — sem duplicação)
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
    await prisma.availability.create({ data: item });
  }

  /* =====================================================
     AGENDAMENTOS (casos reais)
  ===================================================== */
  const monday = nextWeekday(1, 10);
  const tuesday = nextWeekday(2, 14);
  const wednesday = nextWeekday(3, 9);

  await prisma.booking.createMany({
    data: [
      {
        clientName: "Maria Silva",
        clientPhone: "24999999999",
        clientEmail: "maria@email.com",
        startDateTime: monday,
        endDateTime: new Date(monday.getTime() + 60 * 60000),
        serviceId: services[0].id,
        status: BookingStatus.PENDENTE,
      },
      {
        clientName: "Ana Paula",
        clientPhone: "24988888888",
        clientEmail: "ana@email.com",
        startDateTime: tuesday,
        endDateTime: new Date(tuesday.getTime() + 70 * 60000),
        serviceId: services[1].id,
        status: BookingStatus.PENDENTE,
      },
      {
        clientName: "João Pedro",
        clientPhone: "24977777777",
        startDateTime: wednesday,
        endDateTime: new Date(wednesday.getTime() + 30 * 60000),
        serviceId: services[2].id,
        status: BookingStatus.CONCLUIDO,
      },
    ],
  });

  /* =====================================================
     AVALIAÇÕES (DEV)
  ===================================================== */
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
        approved: false,
      },
    ],
  });

  console.log("✅ Seed DEV concluído com sucesso!");
}

/* =====================================================
   Execução
===================================================== */
main()
  .catch((e) => {
    console.error("❌ Erro no seed DEV:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
