import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar depoimentos" },
      { status: 500 }
    );
  }
}