import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  startOfBrazilDay,
  endOfBrazilDay,
  //toUTCFromBrazil,
} from "@/lib/timezone";

/**
 * ⏱ Buffer entre atendimentos (minutos)
 */
const settings = await prisma.settings.findUnique({
  where: { id: 1 },
});

const bufferMinutes = settings?.bufferMinutes ?? 15;
const durationMin = service.durationMin + bufferMinutes;


/**
 * ⏱ Intervalo visual dos horários (UX)
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
       📅 Data base (Brasil)
    ============================ */
    const brazilBaseDate = new Date(`${dateParam}T00:00:00`);
    if (isNaN(brazilBaseDate.getTime())) {
      return NextResponse.json(
        { error: "Data inválida." },
        { status: 400 }
      );
    }

    const dayOfWeek = brazilBaseDate.getDay();

    /* ============================
       🕒 Availability
    ============================ */
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json([]);
    }

    /* ============================
       🛠 Serviço
    ============================ */
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.active) {
      return NextResponse.json(
        { error: "Serviço inválido ou inativo." },
        { status: 404 }
      );
    }

    /* ============================
       ⏰ Intervalo do dia (UTC)
    ============================ */
    const startOfDayUTC = startOfBrazilDay(brazilBaseDate);
    const endOfDayUTC = endOfBrazilDay(brazilBaseDate);

    const dayStartUTC = new Date(startOfDayUTC);
    dayStartUTC.setUTCHours(availability.openHour, 0, 0, 0);

    const dayEndUTC = new Date(startOfDayUTC);
    dayEndUTC.setUTCHours(availability.closeHour, 0, 0, 0);

    /* ============================
       📋 Agendamentos do dia
    ============================ */
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDENTE", "CONCLUIDO"],
        },
        startDateTime: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
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
    let cursorUTC = new Date(dayStartUTC);

    const nowUTC = new Date();

    while (true) {
      const slotStartUTC = new Date(cursorUTC);

      const slotEndUTC = new Date(
        slotStartUTC.getTime() +
          (service.durationMin + BUFFER_MINUTES) * 60_000
      );

      if (slotEndUTC > dayEndUTC) break;

      // Evita horários passados (apenas se for hoje)
      if (slotStartUTC < nowUTC) {
        cursorUTC = new Date(
          cursorUTC.getTime() + SLOT_INTERVAL_MINUTES * 60_000
        );
        continue;
      }

      const hasConflict = bookings.some((b) => {
        return (
          slotStartUTC < b.endDateTime &&
          slotEndUTC > b.startDateTime
        );
      });

      if (!hasConflict) {
        const localSlot = new Date(
          slotStartUTC.getTime() - 3 * 60 * 60 * 1000
        );

        const h = String(localSlot.getHours()).padStart(2, "0");
        const m = String(localSlot.getMinutes()).padStart(2, "0");

        slots.push(`${h}:${m}`);
      }

      cursorUTC = new Date(
        cursorUTC.getTime() + SLOT_INTERVAL_MINUTES * 60_000
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
