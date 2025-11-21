import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }, // mais recentes primeiro
  });
  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { author, message } = body;

  if (!author || !message) {
    return NextResponse.json(
      { error: "Autor e mensagem são obrigatórios." },
      { status: 400 }
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: { author, message },
  });

  return NextResponse.json(testimonial);
}