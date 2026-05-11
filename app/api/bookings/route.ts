import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Prisma, BookingStatus } from "@prisma/client";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";
import {
  startOfBrazilDay,
  endOfBrazilDay,
} from "@/lib/timezone";
import { getTotalDuration } from "@/lib/lib.scheduling";

export const dynamic = "force-dynamic";

/* ============================================================
   GET — Buscar agendamentos (ADMIN)
============================================================ */
export async function GET(req: Request) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter"); // today | future | all
  const status = searchParams.get("status"); // PENDENTE | CONCLUIDO | CANCELADO

  try {
    const todayStart = startOfBrazilDay();
    const todayEnd = endOfBrazilDay();

    // Mantemos as suas variáveis de limite!
    const threeMonthsAgo = new Date(todayStart);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const futureLimit = new Date(todayEnd);
    futureLimit.setMonth(futureLimit.getMonth() + 3);

    const where: Prisma.BookingWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status as BookingStatus;
    }

    if (filter === "today") {
      where.startDateTime = {
        gte: todayStart,
        lt: todayEnd,
      };
      where.status = "PENDENTE";
    }

    if (filter === "future") {
      where.startDateTime = {
        gt: todayEnd,
        lt: futureLimit,
      };
      where.status = "PENDENTE";
    }

    // 👇 A trava dos 3 meses para trás, 
    // deixando aberto para a frente para não esconder os testes!
    if (filter === "all" && (status === "CONCLUIDO" || status === "CANCELADO")) {
      where.startDateTime = {
        gte: threeMonthsAgo, 
      };
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput =
      status === "CONCLUIDO" || status === "CANCELADO"
        ? { startDateTime: "desc" }
        : { startDateTime: "asc" };

    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true },
      orderBy,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("❌ Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}

/* ============================================================
   POST — Criar agendamento (CLIENTE)
============================================================ */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (
      !data.clientName ||
      !data.clientPhone ||
      !data.serviceId ||
      !data.startDateTime
    ) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    /* ============================
      🛠 Serviço e Configurações
    ============================ */
    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service || !service.active) {
      return NextResponse.json(
        { error: "Serviço inválido ou inativo." },
        { status: 404 }
      );
    }

    /* ============================
      ⏱ Duração (Fonte única da regra)
      Aqui, 'total' já retorna (duração do serviço + buffer do banco)
    ============================ */
    const { total } = await getTotalDuration(Number(data.serviceId));

    /* ============================
       🕒 Horários (Brasil → UTC)
    ============================ */
    const startLocal = new Date(data.startDateTime);
    startLocal.setSeconds(0, 0);

    const startUTC = new Date(data.startDateTime);
    startUTC.setSeconds(0, 0);
    
    // Bloqueio total na agenda: Início + (Duração Serviço + Buffer)
    const endWithBufferUTC = new Date(startUTC.getTime() + total * 60_000);

    /* ============================
       📅 Disponibilidade Semanal
    ============================ */
    const dayOfWeek = startLocal.getDay();
    const availability = await prisma.availability.findUnique({
      where: { dayOfWeek },
    });

    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "Dia indisponível para agendamento." },
        { status: 400 }
      );
    }

    const startHour = startLocal.getHours() + startLocal.getMinutes() / 60;
    const endHour = (startLocal.getHours() * 60 + startLocal.getMinutes() + total) / 60;

    if (startHour < availability.openHour || endHour > availability.closeHour) {
      return NextResponse.json(
        { error: "Horário fora do expediente." },
        { status: 400 }
      );
    }

    /* ============================
       🔁 Verificar conflito
    ============================ */
    const conflict = await prisma.booking.findFirst({
      where: {
        status: { in: ["PENDENTE", "CONCLUIDO"] },
        AND: [
          { startDateTime: { lt: endWithBufferUTC } },
          { endDateTime: { gt: startUTC } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Este horário já está reservado." },
        { status: 409 }
      );
    }

    /* ============================
       ✅ Criar agendamento
    ============================ */
    const booking = await prisma.booking.create({
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail || null,
        serviceId: Number(data.serviceId),
        startDateTime: startUTC,
        endDateTime: endWithBufferUTC, // Salvamos o bloco total ocupado
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