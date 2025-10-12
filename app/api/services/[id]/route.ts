import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// 🔹 GET — obter um serviço
export async function GET(req: Request, { params }: Params) {
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
    return NextResponse.json({ error: "Erro ao buscar serviço." }, { status: 500 });
  }
}

// 🔹 PATCH — atualizar serviço
export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    const data = await req.json();

    const updated = await prisma.service.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json({ error: "Erro ao atualizar serviço." }, { status: 500 });
  }
}

// 🔹 DELETE — exclusão lógica (não apaga do banco!)
export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    const deleted = await prisma.service.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({
      ok: true,
      message: "Serviço marcado como inativo (excluído).",
      deleted,
    });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return NextResponse.json({ error: "Erro ao excluir serviço." }, { status: 500 });
  }
}
