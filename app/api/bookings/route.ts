import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: { startDateTime: 'asc' },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const data = await req.json();

  // Validações simples (pode melhorar com Zod depois)
  if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startDateTime) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // Busca o serviço para calcular horário de término
  const service = await prisma.service.findUnique({
    where: { id: Number(data.serviceId) },
  });

  if (!service) {
    return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 400 });
  }

  const start = new Date(data.startDateTime);
  const end = new Date(start.getTime() + service.durationMin * 60000);

  // Verificar conflitos simples
  const conflict = await prisma.booking.findFirst({
    where: {
      startDateTime: { lt: end },
      endDateTime: { gt: start },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: 'Este horário já está reservado' },
      { status: 409 }
    );
  }

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

  return NextResponse.json(booking, { status: 201 });
}
