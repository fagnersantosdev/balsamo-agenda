import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTotalDuration } from "@/lib/lib.scheduling";

/**
 * ⏱ Passo visual dos horários (UX)
 * Não interfere em conflito nem duração real
 */
const SLOT_INTERVAL_MINUTES = 15;

/**
 * GET /api/availability-times
 * ?date=YYYY-MM-DD
 * &serviceId=number
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const serviceIdParam = searchParams.get("serviceId");

    /* ============================
       🔎 Validação
    ============================ */
    if (!dateParam || !serviceIdParam) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const serviceId = Number(serviceIdParam);
    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: "serviceId inválido." },
        { status: 400 }
      );
    }

    /* ============================
       📅 Data base (HORÁRIO LOCAL)
    ============================ */
    const baseDate = new Date(`${dateParam}T00:00:00`);
    if (isNaN(baseDate.getTime())) {
      return NextResponse.json(
        { error: "Data inválida." },
        { status: 400 }
      );
    }

    const dayOfWeek = baseDate.getDay();

    /* ============================
       🕒 Disponibilidade
    ============================ */
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json([]);
    }

    /* ============================
       ⏱ Duração total (serviço + buffer global)
    ============================ */
    const { total } = await getTotalDuration(serviceId);

    /* ============================
       ⏰ Expediente (HORÁRIO LOCAL)
    ============================ */
    const dayStart = new Date(baseDate);
    dayStart.setHours(availability.openHour, 0, 0, 0);

    const dayEnd = new Date(baseDate);
    dayEnd.setHours(availability.closeHour, 0, 0, 0);

    /* ============================
       📋 Agendamentos do dia (UTC no banco)
    ============================ */
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["PENDENTE", "CONCLUIDO"] },
        startDateTime: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        startDateTime: true,
        endDateTime: true,
      },
    });

    /* ============================
       🔁 Geração dos horários
    ============================ */
    const slots: string[] = [];
    let cursor = new Date(dayStart);
    const now = new Date();

    while (true) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(slotStart.getTime() + total * 60_000);

      if (slotEnd > dayEnd) break;

      // Evita horários passados (apenas se for hoje)
      if (slotStart < now) {
        cursor = new Date(
          cursor.getTime() + SLOT_INTERVAL_MINUTES * 60_000
        );
        continue;
      }

      const hasConflict = bookings.some((b) => {
        return (
          slotStart < b.endDateTime &&
          slotEnd > b.startDateTime
        );
      });

      if (!hasConflict) {
        const label = slotStart.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        slots.push(label);
      }

      cursor = new Date(
        cursor.getTime() + SLOT_INTERVAL_MINUTES * 60_000
      );
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error("❌ Erro ao calcular horários:", error);
    return NextResponse.json(
      { error: "Erro ao calcular horários disponíveis." },
      { status: 500 }
    );
  }
}
