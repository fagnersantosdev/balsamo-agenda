import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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