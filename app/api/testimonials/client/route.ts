import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { author, message, rating } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Mensagem obrigatória" },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        author: author?.trim() || "Anônimo",
        message: message.trim(),
        rating: Number(rating) || 5,
        approved: false, // ⭐ sempre pendente
      },
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return NextResponse.json(
      { error: "Erro ao enviar avaliação" },
      { status: 500 }
    );
  }
}
