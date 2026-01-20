import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTotalDuration } from "@/lib/lib.scheduling";
import { startOfBrazilDay, endOfBrazilDay, toUTCFromBrazil } from "@/lib/timezone";

const SLOT_INTERVAL_MINUTES = 15;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const serviceIdParam = searchParams.get("serviceId");

    if (!dateParam || !serviceIdParam) {
      return NextResponse.json({ error: "Parâmetros ausentes." }, { status: 400 });
    }

    const serviceId = Number(serviceIdParam);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "serviceId inválido." }, { status: 400 });
    }

    /* ============================================================
        📅 1. TRATAMENTO DA DATA
    ============================================================ */
    const [year, month, day] = dateParam.split("-").map(Number);
    const baseDate = new Date(year, month - 1, day);

    const dayStartUTC = startOfBrazilDay(baseDate);
    const dayEndUTC = endOfBrazilDay(baseDate);

    /* ============================================================
        🕒 2. DISPONIBILIDADE
    ============================================================ */
    const dayOfWeek = baseDate.getDay();
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json([]);
    }

    /* ============================================================
        ⏱ 3. DURAÇÃO DO SERVIÇO
    ============================================================ */
    const { total } = await getTotalDuration(serviceId);

    /* ============================================================
        📋 4. BUSCA DE AGENDAMENTOS
    ============================================================ */
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["PENDENTE", "CONCLUIDO"] },
        startDateTime: {
          gte: dayStartUTC,
          lte: dayEndUTC,
        },
      },
      select: {
        startDateTime: true,
        endDateTime: true,
      },
    });

    const bookedRanges = bookings.map((b) => ({
      start: b.startDateTime.getTime(),
      end: b.endDateTime.getTime(),
    }));

    /* ============================================================
        🔁 5. GERAÇÃO DOS SLOTS
    ============================================================ */
    const slots: string[] = [];
    const now = new Date();

    // Aqui usamos const porque o objeto Date será mutado, não reatribuído
    const cursorLocal = new Date(baseDate);
    cursorLocal.setHours(availability.openHour, 0, 0, 0);

    const dayEndLocal = new Date(baseDate);
    dayEndLocal.setHours(availability.closeHour, 0, 0, 0);

    while (true) {
      const slotStartUTC = toUTCFromBrazil(cursorLocal);
      const slotStartTimestamp = slotStartUTC.getTime();
      const slotEndTimestamp = slotStartTimestamp + total * 60_000;

      if (slotEndTimestamp > toUTCFromBrazil(dayEndLocal).getTime()) break;

      if (slotStartTimestamp < now.getTime()) {
        cursorLocal.setMinutes(cursorLocal.getMinutes() + SLOT_INTERVAL_MINUTES);
        continue;
      }

      const hasConflict = bookedRanges.some(
        (b) => slotStartTimestamp < b.end && slotEndTimestamp > b.start
      );

      if (!hasConflict) {
        slots.push(
          cursorLocal.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      cursorLocal.setMinutes(cursorLocal.getMinutes() + SLOT_INTERVAL_MINUTES);
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Erro availability-times:", error);
    return NextResponse.json(
      { error: "Erro ao calcular horários." },
      { status: 500 }
    );
  }
}