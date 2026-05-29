import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

const VALID_STATUS = ["PENDENTE", "CONCLUIDO", "CANCELADO"] as const;

/* =========================
   PATCH – atualizar status
========================= */
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const { status } = await req.json();

    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }

    const exists = await prisma.booking.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}