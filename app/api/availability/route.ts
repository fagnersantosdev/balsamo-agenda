import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    // ✅ SEM embrulhar em objeto — retorne um array puro
    return NextResponse.json(items);
  } catch (e) {
    console.error("Erro ao buscar availability:", e);
    return NextResponse.json({ error: "Erro ao buscar disponibilidade" }, { status: 500 });
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