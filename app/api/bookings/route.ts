import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Prisma, BookingStatus } from "@prisma/client";

/* ============================================================
   GET — Buscar agendamentos com filtros
============================================================ */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const pastLimit = new Date();
    pastLimit.setDate(pastLimit.getDate() - 30);

    const futureLimit = new Date();
    futureLimit.setDate(futureLimit.getDate() + 30);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const whereClause: Prisma.BookingWhereInput = {};

    /* -------- Filtro por status -------- */
    if (status && status !== "ALL") {
      whereClause.status = status as BookingStatus;

      if (status === "CANCELADO") {
        whereClause.status = "CANCELADO";
      }
      else if (status === "CONCLUIDO") {
        whereClause.status = "CONCLUIDO";
        whereClause.startDateTime = {
          gte: threeMonthsAgo,
          lte: endOfToday,
        };
      }

      else {
        whereClause.status = status as BookingStatus;
      }
    }

    /* -------- Filtro por período -------- */
    if (filter === "today") {
      whereClause.startDateTime = { gte: startOfToday, lte: endOfToday };
      whereClause.status = { notIn: ["CANCELADO", "CONCLUIDO"] };
    }

    if (filter === "future") {
      whereClause.startDateTime = { gt: endOfToday, lte: futureLimit };
      whereClause.status = "PENDENTE";
    }

    if (filter === "past") {
      whereClause.endDateTime = { lt: startOfToday, gte: pastLimit };
    }

    let orderBy: Prisma.BookingOrderByWithRelationInput = {
      startDateTime: "asc",
    };

    // Cancelados e concluídos → mais recentes primeiro
    if (status === "CANCELADO" || status === "CONCLUIDO") {
      orderBy = { startDateTime: "desc" };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: { service: true },
      orderBy,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("❌ Erro no GET bookings:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}

/* ============================================================
   POST — Criar agendamento (SEM UTC, horário local)
============================================================ */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    /* -------- Serviço -------- */
    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    /* -------- Criar horário local -------- */
    const startLocal = new Date(data.startDateTime);
    startLocal.setSeconds(0, 0);

    const endLocal = new Date(startLocal.getTime() + (service.durationMin + 15) * 60000);
    endLocal.setSeconds(0, 0);

    /* ============================================================
       MAPEAR DIA DA SEMANA — DOM=1, SEG=2, ..., SÁB=7
    ============================================================ */
    const jsDay = startLocal.getDay(); // 0-6 (0=domingo)
    const dayOfWeek = jsDay === 0 ? 1 : jsDay + 1;

    /* -------- Proibir sábado (7) e domingo (1) -------- */
    if (dayOfWeek === 1 || dayOfWeek === 7) {
      return NextResponse.json(
        { error: "❌ Não é possível agendar aos fins de semana." },
        { status: 400 }
      );
    }

    /* -------- Disponibilidade -------- */
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "❌ Este dia não está disponível para agendamento." },
        { status: 400 }
      );
    }

    /* -------- Verificar horário dentro do expediente -------- */
    const startHour = startLocal.getHours() + startLocal.getMinutes() / 60;

    if (startHour < availability.openHour || startHour >= availability.closeHour) {
      return NextResponse.json(
        { error: "⏳ Horário fora do expediente." },
        { status: 400 }
      );
    }

    /* -------- Conflito de horário real -------- */
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

    /* -------- Criar agendamento -------- */
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
      { ok: true, message: "Agendamento criado com sucesso!", booking },
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