import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // ⬅️ 1. Await no params
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Verifica se existe
    const exists = await prisma.testimonial.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Depoimento não encontrado" },
        { status: 404 }
      );
    }

    // ⬅️ 2. Faltava esta linha! Agora deleta de verdade.
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao excluir depoimento" },
      { status: 500 }
    );
  }
}