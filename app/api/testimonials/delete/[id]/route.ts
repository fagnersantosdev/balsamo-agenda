import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const exists = await prisma.testimonial.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Depoimento não encontrado" },
        { status: 404 }
      );
    }


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao excluir depoimento" },
      { status: 500 }
    );
  }
}
