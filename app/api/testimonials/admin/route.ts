import { NextResponse } from "next/server";
import { prisma}from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "pending" | "approved" | null

    let where: any = {};

    if (status === "pending") {
      where.approved = false;
    } else if (status === "approved") {
      where.approved = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
    return NextResponse.json(
      { error: "Erro ao carregar depoimentos" },
      { status: 500 }
    );
  }
}