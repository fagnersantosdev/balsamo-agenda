import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // ⬅️ Await obrigatório no Next.js 15
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Opcional: Verificar se existe antes para evitar erro no console
    const exists = await prisma.testimonial.findUnique({ where: { id } });
    if (!exists) {
        return NextResponse.json({ error: "Depoimento não encontrado" }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir depoimento" },
      { status: 500 }
    );
  }
}