import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // ⬅️ Await obrigatório no Next.js 15
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Erro ao aprovar depoimento:", error);
    return NextResponse.json(
      { error: "Erro ao aprovar depoimento" },
      { status: 500 }
    );
  }
}