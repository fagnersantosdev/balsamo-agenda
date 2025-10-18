import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const availability = await prisma.availability.findMany({ orderBy: { dayOfWeek: "asc" } });
  return NextResponse.json(availability);
}

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
    return NextResponse.json({ error: "Erro ao salvar alterações" }, { status: 500 });
  }
}


export async function POST() {
  try{
    const items = await prisma.availability.findMany({
      orderBy: {dayOfWeek: "asc"},
    })

  } catch (e) {
    
  }
  
}