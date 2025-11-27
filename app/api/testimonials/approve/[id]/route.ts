import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao aprovar depoimento" },
      { status: 500 }
    );
  }
}