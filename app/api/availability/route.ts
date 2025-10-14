import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📅 GET — busca horários de funcionamento
export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    // ⚙️ Configuração fixa da proprietária
    const defaults = Array.from({ length: 7 }).map((_, i) => ({
      dayOfWeek: i,
      openHour: 9,
      closeHour: 19,
      active: i >= 1 && i <= 5, // segunda a sexta
    }));

    // Se não existir, cria do zero
    if (availability.length === 0) {
      await prisma.availability.createMany({ data: defaults });
    } else {
      // Se já existe, atualiza para o padrão correto
      for (const d of defaults) {
        await prisma.availability.upsert({
          where: { dayOfWeek: d.dayOfWeek },
          update: d,
          create: d,
        });
      }
    }

    const fresh = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(fresh);
  } catch (error) {
    console.error("Erro ao buscar disponibilidade:", error);
    return NextResponse.json(
      { error: "Erro ao buscar disponibilidade." },
      { status: 500 }
    );
  }
}
