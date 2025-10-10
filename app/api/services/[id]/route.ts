import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 Buscar serviço por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: Number(params.id) },
  });
  if (!service) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }
  return NextResponse.json(service);
}

// 🟣 Atualizar serviço
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();

  const updated = await prisma.service.update({
    where: { id: Number(params.id) },
    data: {
      name: data.name,
      price: Number(data.price),
      durationMin: Number(data.durationMin),
    },
  });

  return NextResponse.json(updated);
}

// 🔴 Deletar serviço
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.service.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Serviço excluído com sucesso" });
}
