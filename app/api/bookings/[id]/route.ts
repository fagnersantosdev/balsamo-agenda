import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = Number(params.id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ message: "Agendamento excluído com sucesso ✅" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir agendamento ❌" },
      { status: 500 }
    );
  }
}
