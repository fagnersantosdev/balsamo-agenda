import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTotalDuration } from "@/lib/lib.scheduling";

const SLOT_INTERVAL_MINUTES = 15;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const serviceIdParam = searchParams.get("serviceId");

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
       📅 Data base (Brasil)
    ============================ */
    const baseDate = new Date(`${dateParam}T00:00:00-03:00`);
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
       ⏱ Duração total (serviço + buffer)
    ============================ */
    const { total } = await getTotalDuration(serviceId);

    /* ============================
       ⏰ Expediente (UTC REAL)
    ============================ */
    const dayStartUTC = new Date(baseDate);
    dayStartUTC.setUTCHours(availability.openHour + 3, 0, 0, 0);

    const dayEndUTC = new Date(baseDate);
    dayEndUTC.setUTCHours(availability.closeHour + 3, 0, 0, 0);

    /* ============================
       📋 Agendamentos do dia (UTC)
    ============================ */
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["PENDENTE", "CONCLUIDO"] },
        startDateTime: {
          gte: dayStartUTC,
          lt: dayEndUTC,
        },
      },
      select: {
        startDateTime: true,
        endDateTime: true,
      },
    });

    const bookingsUTC = bookings.map((b) => ({
      start: b.startDateTime.getTime(),
      end: b.endDateTime.getTime(),
    }));

    /* ============================
       🔁 Geração dos horários
    ============================ */
    const slots: string[] = [];
    let cursorUTC = new Date(dayStartUTC);
    const nowUTC = new Date();

    while (true) {
      const slotStart = cursorUTC.getTime();
      const slotEnd = slotStart + total * 60_000;

      if (slotEnd > dayEndUTC.getTime()) break;

      if (slotStart < nowUTC.getTime()) {
        cursorUTC = new Date(slotStart + SLOT_INTERVAL_MINUTES * 60_000);
        continue;
      }

      const hasConflict = bookingsUTC.some(
        (b) => slotStart < b.end && slotEnd > b.start
      );

      if (!hasConflict) {
        const label = new Date(slotStart).toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
        });

        slots.push(label);
      }

      cursorUTC = new Date(slotStart + SLOT_INTERVAL_MINUTES * 60_000);
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
