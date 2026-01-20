import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> } // Ajustado para Promise
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const { id } = await context.params; // Aguarda o ID
    const serviceId = Number(id);

    const restored = await prisma.service.update({
      where: { id: serviceId },
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
