import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.service.create({
    data: {
      name: "Massagem Relaxante",
      durationMin: 60,
      active: true,
    },
  });
}

main()
  .then(() => {
    console.log("Serviço criado com sucesso!");
  })
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
