import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function nextWeekday(day: number) {
  const date = new Date();
  const diff = (day + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
  date.setHours(10, 0, 0, 0);
  return date;
}




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
  await prisma.service.createMany({
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
    // Domingo
    { dayOfWeek: 0, openHour: 0, closeHour: 0, active: false },

    // Segunda a Quinta
    { dayOfWeek: 1, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 2, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 3, openHour: 9, closeHour: 18, active: true },
    { dayOfWeek: 4, openHour: 9, closeHour: 18, active: true },

    // Sexta
    { dayOfWeek: 5, openHour: 9, closeHour: 17, active: true },

    // Sábado
    { dayOfWeek: 6, openHour: 0, closeHour: 0, active: false },
  ],
});


  /* =======================
   AGENDAMENTOS
======================= */
const nextMonday = nextWeekday(1);
const nextTuesday = nextWeekday(2);
const nextWednesday = nextWeekday(3);

await prisma.booking.createMany({
  data: [
    {
      clientName: "Maria Silva",
      clientPhone: "24999999999",
      clientEmail: "maria@email.com",
      startDateTime: nextMonday,
      endDateTime: new Date(nextMonday.getTime() + 60 * 60000),
      serviceId: allServices[0].id,
      status: BookingStatus.PENDENTE,
    },
    {
      clientName: "Ana Paula",
      clientPhone: "24988888888",
      clientEmail: "ana@email.com",
      startDateTime: nextTuesday,
      endDateTime: new Date(nextTuesday.getTime() + 70 * 60000),
      serviceId: allServices[1].id,
      status: BookingStatus.PENDENTE,
    },
    {
      clientName: "João Pedro",
      clientPhone: "24977777777",
      startDateTime: nextWednesday,
      endDateTime: new Date(nextWednesday.getTime() + 30 * 60000),
      serviceId: allServices[2].id,
      status: BookingStatus.CONCLUIDO,
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
