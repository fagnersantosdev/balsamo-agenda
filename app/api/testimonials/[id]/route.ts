import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // ⬅️ Await obrigatório no Next.js 15
  const id = Number(params.id);

  try {
    // Verifica se existe antes de tentar deletar (opcional, mas evita erros no log)
    const exists = await prisma.testimonial.findUnique({ where: { id } });
    
    if (!exists) {
        return NextResponse.json({ error: "Depoimento não encontrado" }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 500 });
  }
}