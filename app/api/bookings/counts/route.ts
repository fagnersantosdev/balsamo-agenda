import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";


export async function GET() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    // 🕒 Ajuste para fuso horário do Brasil (GMT-3)
    const nowUTC = new Date();
    const timezoneOffsetMs = 3 * 60 * 60 * 1000; // 3h em milissegundos
    const localNow = new Date(nowUTC.getTime() - timezoneOffsetMs);

    // 📅 Início e fim do dia local
    const startOfTodayLocal = new Date(localNow);
    startOfTodayLocal.setHours(0, 0, 0, 0);

    const endOfTodayLocal = new Date(localNow);
    endOfTodayLocal.setHours(23, 59, 59, 999);

    // 🔁 Converter de volta para UTC (banco usa UTC)
    const startOfTodayUTC = new Date(startOfTodayLocal.getTime() + timezoneOffsetMs);
    const endOfTodayUTC = new Date(endOfTodayLocal.getTime() + timezoneOffsetMs);

    // 📊 Contagens paralelas para performance
    const [pendentes, concluidos, cancelados, hoje, futuros] = await Promise.all([
      prisma.booking.count({ where: { status: "PENDENTE" } }),
      prisma.booking.count({ where: { status: "CONCLUIDO" } }),
      prisma.booking.count({ where: { status: "CANCELADO" } }),
      prisma.booking.count({
        where: {
          status: "PENDENTE", // apenas pendentes do dia
          startDateTime: {
            gte: startOfTodayUTC,
            lt: endOfTodayUTC,
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: "PENDENTE", // futuros pendentes
          startDateTime: {
            gt: endOfTodayUTC,
          },
        },
      }),
    ]);

    return NextResponse.json({
      pendentes,
      concluidos,
      cancelados,
      hoje,
      futuros,
    });
  } catch (error) {
    console.error("❌ Erro ao contar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao contar agendamentos." },
      { status: 500 }
    );
  }
}
