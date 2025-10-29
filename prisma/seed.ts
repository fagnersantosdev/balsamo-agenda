import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@balsamo.com" },
    update: {},
    create: {
      email: "admin@balsamo.com",
      password: hashed,
    },
  });
}

main().finally(() => prisma.$disconnect());
