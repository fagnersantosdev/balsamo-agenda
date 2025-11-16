import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — Buscar disponibilidade
export async function GET() {
  const availability = await prisma.availability.findMany({
    orderBy: { dayOfWeek: "asc" }
  });

  return NextResponse.json(availability);
}

// PATCH — Atualizar disponibilidade
export async function PATCH(req: Request) {
  try {
    const updates = await req.json();

    for (const item of updates) {
      await prisma.availability.update({
        where: { id: item.id },
        data: {
          openHour: item.openHour,
          closeHour: item.closeHour,
          active: item.active,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao atualizar availability:", error);
    return NextResponse.json(
      { error: "Erro ao salvar alterações" },
      { status: 500 }
    );
  }
}

// POST — Apenas retorna a lista (ou remova se não usar)
export async function POST() {
  try {
    const items = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao buscar availability:", error);
    return NextResponse.json(
      { error: "Erro ao buscar availability" },
      { status: 500 }
    );
  }
}