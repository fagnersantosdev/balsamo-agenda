import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  // ✅ CORREÇÃO: Usamos 'const' e definimos o tipo do objeto, removendo o 'any'
  const where: { approved?: boolean } = {};

  if (status === "pending") {
    where.approved = false;
  } else if (status === "approved") {
    where.approved = true;
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Erro ao buscar depoimentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}