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

    // 🧩 Validação dos campos obrigatórios
    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 🔍 Busca o serviço selecionado
    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    // 🕒 Corrige fuso horário (Brasil UTC-3)
    // O front envia o horário local (sem timezone), então ajustamos manualmente
    const start = new Date(data.startDateTime);
    const startLocal = new Date(start.getTime() - 3 * 60 * 60 * 1000);

    // Zera segundos e milissegundos — evita microdiferenças no cálculo
    startLocal.setSeconds(0, 0);

    // 🧘‍♀️ Define o horário de término:
    // duração do serviço + 15min de intervalo para descanso/preparo da sala
    const endLocal = new Date(startLocal.getTime() + (service.durationMin + 15) * 60000);
    endLocal.setSeconds(0, 0);

    // 🗓️ Identifica o dia da semana (0 = sábado, 1 = domingo, 2 = segunda, etc.)
    const jsDay = startLocal.getDay();
    const dayOfWeek = (jsDay + 1) % 7;

    // 🔎 Busca disponibilidade desse dia
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    // 🚫 Verifica se o dia está ativo
    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "❌ Não é possível agendar neste dia. O estabelecimento está fechado." },
        { status: 400 }
      );
    }

    // ⏰ Verifica se o horário está dentro do expediente
    const startHour = startLocal.getHours() + startLocal.getMinutes() / 60;
    if (startHour < availability.openHour || startHour >= availability.closeHour) {
      return NextResponse.json(
        { error: "⏳ Horário fora do expediente. Escolha um horário válido." },
        { status: 400 }
      );
    }

    // 🚫 Verifica se já existe um agendamento que conflita com esse intervalo
    // Ignora agendamentos cancelados e concluídos, e considera o intervalo de 15min
    const conflict = await prisma.booking.findFirst({
      where: {
        status: { notIn: ["CANCELADO", "CONCLUIDO"] },
        startDateTime: { lt: endLocal },
        endDateTime: { gt: startLocal },
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
        startDateTime: startLocal,
        endDateTime: endLocal,
        status: "PENDENTE",
      },
      include: { service: true },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Agendamento criado com sucesso!",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}