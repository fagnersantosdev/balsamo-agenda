import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Prisma, BookingStatus } from "@prisma/client";

// ======================================================
// 🔹 GET — listar agendamentos (com filtros)
// ======================================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");

  try {
    // 🕒 Ajuste de fuso horário (Brasil GMT-3)
    const nowUTC = new Date();
    const timezoneOffsetMs = 3 * 60 * 60 * 1000; // 3h em ms
    const localNow = new Date(nowUTC.getTime() - timezoneOffsetMs);

    // 📅 Início e fim do dia local
    const startOfTodayLocal = new Date(localNow);
    startOfTodayLocal.setHours(0, 0, 0, 0);

    const endOfTodayLocal = new Date(localNow);
    endOfTodayLocal.setHours(23, 59, 59, 999);

    // 🔁 Converter de volta para UTC (banco trabalha em UTC)
    const startOfTodayUTC = new Date(startOfTodayLocal.getTime() + timezoneOffsetMs);
    const endOfTodayUTC = new Date(endOfTodayLocal.getTime() + timezoneOffsetMs);

    // 🧩 Filtro dinâmico
    const whereClause: Prisma.BookingWhereInput = {};

    // 🔖 Filtro por status (se vier manualmente)
    if (status && status !== "ALL") {
      whereClause.status = status as BookingStatus;
    }

    // 🧭 Filtro por período
    switch (filter) {
      case "today":
        // Mostra apenas agendamentos PENDENTES do dia atual
        whereClause.startDateTime = {
          gte: startOfTodayUTC,
          lt: endOfTodayUTC,
        };
        whereClause.status = "PENDENTE";
        break;

      case "future":
        // Mostra agendamentos futuros (a partir de amanhã)
        whereClause.startDateTime = {
          gt: endOfTodayUTC,
        };
        break;

      case "past":
        // Mostra agendamentos que terminaram antes de hoje
        whereClause.endDateTime = {
          lt: startOfTodayUTC,
        };
        break;

      default:
        // “all” → sem filtro adicional
        break;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: { service: true },
      orderBy: { startDateTime: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("❌ Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos." }, { status: 500 });
  }
}

// ======================================================
// 🔹 POST — criar novo agendamento
// ======================================================
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 🧾 Validação básica
    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 400 });
    }

    // 🕐 Define início e fim considerando a pausa de 15 minutos
    const start = new Date(data.startDateTime);
    const end = new Date(start.getTime() + (service.durationMin + 15) * 60000);

    // 🗓️ Valida disponibilidade do dia
    const jsDay = start.getDay();
    const dayOfWeek = (jsDay + 1) % 7; // Corrige mapeamento entre JS e BD

    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "❌ Não é possível agendar neste dia. O estabelecimento está fechado." },
        { status: 400 }
      );
    }

    // ⏰ Valida horário dentro do expediente
    const startHour = start.getHours() + start.getMinutes() / 60;
    if (startHour < availability.openHour || startHour >= availability.closeHour) {
      return NextResponse.json(
        { error: "⏳ Horário fora do expediente. Escolha um horário válido." },
        { status: 400 }
      );
    }

    // 🚫 Impede conflitos de horário
    const conflict = await prisma.booking.findFirst({
      where: {
        startDateTime: { lt: end },
        endDateTime: { gt: start },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "❌ Este horário já está reservado." },
        { status: 409 }
      );
    }

    // ✅ Cria o agendamento
    const booking = await prisma.booking.create({
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail || null,
        serviceId: Number(data.serviceId),
        startDateTime: start,
        endDateTime: end,
      },
      include: { service: true },
    });

    return NextResponse.json(
      { ok: true, message: "Agendamento criado com sucesso!", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento." }, { status: 500 });
  }
}
