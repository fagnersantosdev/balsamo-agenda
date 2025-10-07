import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const data = await req.json();

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price ? Number(data.price) : undefined,
        durationMin: data.durationMin ? Number(data.durationMin) : undefined,
      },
    });

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar serviço" },
      { status: 500 }
    );
  }
}
