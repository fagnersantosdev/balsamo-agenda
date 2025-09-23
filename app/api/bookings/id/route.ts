import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = Number(params.id);
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
