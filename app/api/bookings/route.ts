import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { service: true },
      orderBy: { startDateTime: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    // 🔒 Garante que mesmo em erro, devolvemos um JSON válido
    return NextResponse.json([], { status: 200 });
  }
}


export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 400 });
    }

    const start = new Date(data.startDateTime);
    // 🕒 inclui 15min de pausa após o serviço
    const end = new Date(start.getTime() + (service.durationMin + 15) * 60000);

    // 🗓️ verifica se o dia é ativo
    const dayOfWeek = start.getDay();
    const availability = await prisma.availability.findFirst({
      where: { dayOfWeek },
    });


    if (!availability || !availability.active) {
      return NextResponse.json(
        { error: "❌ Não é possível agendar neste dia. O estabelecimento está fechado." },
        { status: 400 }
      );
    }

    // ⏰ verifica se o horário está dentro do expediente
    const startHour = start.getHours() + start.getMinutes() / 60;
    if (startHour < availability.openHour || startHour >= availability.closeHour) {
      return NextResponse.json(
        { error: "⏳ Horário fora do expediente. Escolha um horário válido." },
        { status: 400 }
      );
    }

    // 🚫 verifica conflito de horários
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

    // ✅ cria o agendamento
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
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento." }, { status: 500 });
  }
}
