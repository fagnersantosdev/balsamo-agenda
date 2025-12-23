import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function PUT(
  _: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

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
