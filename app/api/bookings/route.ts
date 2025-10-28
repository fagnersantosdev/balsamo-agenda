import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Prisma, BookingStatus } from "@prisma/client";

// ===================================================================
// 📋 GET — Buscar agendamentos (com filtros e status)
// ===================================================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");

  try {
    const now = new Date(); // Local do servidor
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // 📅 Intervalos para relatórios e filtros
    const pastLimit = new Date(now);
    pastLimit.setDate(pastLimit.getDate() - 30);

    const futureLimit = new Date(now);
    futureLimit.setDate(futureLimit.getDate() + 30);

    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const whereClause: Prisma.BookingWhereInput = {};

    // 🎯 Filtro por status
    if (status && status !== "ALL") {
      whereClause.status = status as BookingStatus;

      // Relatórios — mostrar últimos 3 meses
      if (status === "CONCLUIDO" || status === "CANCELADO") {
        whereClause.startDateTime = {
          gte: threeMonthsAgo,
          lte: endOfToday,
        };
      }
    }

    // 🧭 Filtro por período
    switch (filter) {
      case "today":
        whereClause.startDateTime = { gte: startOfToday, lt: endOfToday };
        // Excluir cancelados/concluídos
        whereClause.status = { notIn: ["CANCELADO", "CONCLUIDO"] };
        break;
      case "future":
        whereClause.startDateTime = { gt: endOfToday, lte: futureLimit };
        break;
      case "past":
        whereClause.endDateTime = { lt: startOfToday, gte: pastLimit };
        break;
      default:
        break; // "all"
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

// ===================================================================
// 🗓️ POST — Criar novo agendamento (horário local, sem UTC-3)
// ===================================================================
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 400 });
    }

    // 🕐 Criar data local sem converter fuso
    const start = new Date(data.startDateTime); // ex: "2025-10-28T15:00"
    const end = new Date(start.getTime() + (service.durationMin + 15) * 60 * 1000);

    // 🗓️ Dia da semana (sab=0, dom=1, seg=2,...)
    const jsDay = start.getDay();
    const dayOfWeek = (jsDay + 1) % 7;

    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "❌ Não é possível agendar neste dia. O estabelecimento está fechado." },
        { status: 400 }
      );
    }

    // ⏰ Dentro do expediente?
    const startHour = start.getHours() + start.getMinutes() / 60;
    if (startHour < availability.openHour || startHour >= availability.closeHour) {
      return NextResponse.json(
        { error: "⏳ Horário fora do expediente. Escolha um horário válido." },
        { status: 400 }
      );
    }

    // 🚫 Conflitos
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

    // ✅ Criar agendamento (mantém o horário local coerente)
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
