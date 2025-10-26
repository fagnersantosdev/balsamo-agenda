import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const deleted = await prisma.service.findMany({
      where: { active: false },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Erro ao buscar serviços excluídos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços excluídos." },
      { status: 500 }
    );
  }
}
