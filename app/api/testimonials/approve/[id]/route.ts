import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function PUT(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // ⬅️ Await obrigatório no Next.js 15
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
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