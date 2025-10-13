import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { startDateTime: "asc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 📦 Busca o serviço (duração em minutos)
    const service = await prisma.service.findUnique({
      where: { id: Number(data.serviceId) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 400 });
    }

    // 🕓 Converte o horário recebido para o fuso local
    const localDate = new Date(data.startDateTime);
    const start = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    const end = new Date(start.getTime() + service.durationMin * 60000);

    // 🔎 Verifica conflito de horário
    const conflict = await prisma.booking.findFirst({
      where: {
        startDateTime: { lt: end },
        endDateTime: { gt: start },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Este horário já está reservado" },
        { status: 409 }
      );
    }

    // 💾 Cria o agendamento corrigido
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
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}
