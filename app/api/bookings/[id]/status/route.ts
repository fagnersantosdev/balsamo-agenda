import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;


  console.log("🧩 Atualizando status do agendamento:", params.id);

  try {
    const { status } = await req.json();
    const id = Number(params.id);

    if (!["PENDENTE", "CONCLUIDO", "CANCELADO"].includes(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
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
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}


// ✅ Obter agendamento por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(params.id) },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// ✅ Atualizar agendamento (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const body = await req.json();
    const { clientName, clientPhone, clientEmail, startDateTime, serviceId } = body;

    if (!clientName || !clientPhone || !startDateTime || !serviceId) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(params.id) },
      data: {
        clientName,
        clientPhone,
        clientEmail,
        startDateTime: new Date(startDateTime),
        serviceId: Number(serviceId),
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

// ✅ Deletar agendamento
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    await prisma.booking.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    return NextResponse.json({ error: "Erro ao excluir agendamento" }, { status: 500 });
  }
}




