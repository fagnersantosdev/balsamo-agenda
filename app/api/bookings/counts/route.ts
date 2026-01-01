import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";
import { BookingsCountDTO } from "@/app/types/BookingsCountDTO";

export async function GET() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    // 🇧🇷 Horário local Brasil
    const nowUTC = new Date();
    const timezoneOffsetMs = 3 * 60 * 60 * 1000;
    const localNow = new Date(nowUTC.getTime() - timezoneOffsetMs);

    const startOfTodayLocal = new Date(localNow);
    startOfTodayLocal.setHours(0, 0, 0, 0);

    const endOfTodayLocal = new Date(localNow);
    endOfTodayLocal.setHours(23, 59, 59, 999);

    const startOfTodayUTC = new Date(startOfTodayLocal.getTime() + timezoneOffsetMs);
    const endOfTodayUTC = new Date(endOfTodayLocal.getTime() + timezoneOffsetMs);

    const [
      todayPending,
      futurePending,
      completed,
      canceled,
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          status: "PENDENTE",
          startDateTime: {
            gte: startOfTodayUTC,
            lt: endOfTodayUTC,
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: "PENDENTE",
          startDateTime: {
            gt: endOfTodayUTC,
          },
        },
      }),
      prisma.booking.count({ where: { status: "CONCLUIDO" } }),
      prisma.booking.count({ where: { status: "CANCELADO" } }),
    ]);

    const response: BookingsCountDTO = {
      todayPending,
      futurePending,
      completed,
      canceled,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erro ao contar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao contar agendamentos." },
      { status: 500 }
    );
  }
}