import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendentes = await prisma.booking.count({ where: { status: "PENDENTE" } });
    const concluidos = await prisma.booking.count({ where: { status: "CONCLUIDO" } });
    const cancelados = await prisma.booking.count({ where: { status: "CANCELADO" } });

    return NextResponse.json({ pendentes, concluidos, cancelados });
  } catch (error) {
    console.error("Erro ao contar agendamentos:", error);
    return NextResponse.json({ pendentes: 0, concluidos: 0, cancelados: 0 });
  }
}
