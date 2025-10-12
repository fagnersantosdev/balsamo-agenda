import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * ✅ GET /api/services/:id
 * Retorna um serviço específico
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(params.id) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviço." },
      { status: 500 }
    );
  }
}

/**
 * ✅ PUT /api/services/:id
 * Atualiza um serviço existente
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.service.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        price: Number(data.price),
        durationMin: Number(data.durationMin),
        details: data.details || [],
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar serviço." },
      { status: 500 }
    );
  }
}

/**
 * 🗑️ DELETE /api/services/:id
 * Exclui um serviço
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return NextResponse.json(
      { error: "Erro ao excluir serviço." },
      { status: 500 }
    );
  }
}
