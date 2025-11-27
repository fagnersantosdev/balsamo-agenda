import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { author, message, rating } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "O comentário é obrigatório." },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        author: author || "Anônimo",
        message,
        rating: rating ?? 5,
        approved: false, // admin precisa aprovar
      },
    });

    return NextResponse.json({ ok: true, testimonial });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar avaliação" },
      { status: 500 }
    );
  }
}