import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

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
