import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";
import { startOfBrazilDay, endOfBrazilDay } from "@/lib/timezone";
import { BookingsCountDTO } from "@/app/types/BookingsCountDTO";

export async function GET() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    // 🇧🇷 Intervalo do dia no Brasil (retornado em UTC)
    const startToday = startOfBrazilDay();
    const endToday = endOfBrazilDay();

    const [
      todayPending,
      futurePending,
      completed,
      canceled,
    ] = await Promise.all([
      // 📅 Pendentes de hoje
      prisma.booking.count({
        where: {
          status: "PENDENTE",
          startDateTime: {
            gte: startToday,
            lt: endToday,
          },
        },
      }),

      // ⏭ Pendentes futuros
      prisma.booking.count({
        where: {
          status: "PENDENTE",
          startDateTime: {
            gte: endToday,
          },
        },
      }),

      // ✅ Concluídos (histórico)
      prisma.booking.count({
        where: { status: "CONCLUIDO" },
      }),

      // ❌ Cancelados
      prisma.booking.count({
        where: { status: "CANCELADO" },
      }),
    ]);

    const dto: BookingsCountDTO = {
      todayPending,
      futurePending,
      completed,
      canceled,
    };

    return NextResponse.json(dto);
  } catch (error) {
    console.error("❌ Erro ao contar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao contar agendamentos." },
      { status: 500 }
    );
  }
}