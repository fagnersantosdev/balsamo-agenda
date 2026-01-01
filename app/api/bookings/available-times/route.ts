import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ⏱ Buffer entre atendimentos (em minutos)
 * Ex: tempo de limpeza, organização, descanso
 */
const BUFFER_MINUTES = 15;

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
       🔎 Validação de parâmetros
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
       📅 Data base (local)
    ============================ */
    const baseDate = new Date(`${dateParam}T00:00:00`);
    if (isNaN(baseDate.getTime())) {
      return NextResponse.json(
        { error: "Data inválida." },
        { status: 400 }
      );
    }

    const dayOfWeek = baseDate.getDay();
    const now = new Date();

    /* ============================
       🕒 Availability do dia
    ============================ */
    const availability = await prisma.availability.findFirst({
      where: {
        dayOfWeek,
        active: true,
      },
    });

    // Dia não disponível
    if (!availability) {
      return NextResponse.json([]);
    }

    /* ============================
       🛠 Serviço
    ============================ */
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado." },
        { status: 404 }
      );
    }

    // Duração do atendimento + buffer
    const durationMin = service.durationMin + BUFFER_MINUTES;

    /* ============================
       ⏰ Intervalo do dia
    ============================ */
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(availability.openHour, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(availability.closeHour, 0, 0, 0);

    /* ============================
       📋 Agendamentos do dia
       - PENDENTE e CONCLUIDO bloqueiam horário
       - CANCELADO não bloqueia
    ============================ */
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDENTE", "CONCLUIDO"],
        },
        startDateTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        startDateTime: true,
        endDateTime: true,
      },
    });

    /* ============================
       🔁 Geração de horários
    ============================ */
    const slots: string[] = [];
    let cursor = new Date(startOfDay);

    while (true) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(
        slotStart.getTime() + durationMin * 60000
      );

      // Estoura o expediente
      if (slotEnd > endOfDay) break;

      // Evita horários no passado (caso seja hoje)
      if (slotStart < now) {
        cursor = new Date(cursor.getTime() + 15 * 60000);
        continue;
      }

      // Verifica conflito com agendamentos existentes
      const hasConflict = bookings.some((b) => {
        const bookingStart = new Date(b.startDateTime);
        const bookingEnd = new Date(b.endDateTime);

        return (
          slotStart < bookingEnd &&
          slotEnd > bookingStart
        );
      });

      if (!hasConflict) {
        const h = String(slotStart.getHours()).padStart(2, "0");
        const m = String(slotStart.getMinutes()).padStart(2, "0");
        slots.push(`${h}:${m}`);
      }

      // Avança a cada 15 minutos
      cursor = new Date(cursor.getTime() + 15 * 60000);
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
