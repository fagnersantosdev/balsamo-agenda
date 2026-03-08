import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🚀 Garante que a rota seja dinâmica e não estática (cacheada)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
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