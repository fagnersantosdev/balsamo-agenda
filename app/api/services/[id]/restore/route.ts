import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    const restored = await prisma.service.update({
      where: { id },
      data: { active: true },
    });

    return NextResponse.json({
      ok: true,
      message: "Serviço restaurado com sucesso.",
      restored,
    });
  } catch (error) {
    console.error("Erro ao restaurar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao restaurar serviço." },
      { status: 500 }
    );
  }
}
