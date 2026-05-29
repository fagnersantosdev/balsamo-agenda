import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

/* =========================
   GET – buscar por ID
========================= */
export async function GET(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

/* =========================
   PUT – atualizar dados
========================= */
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const { clientName, clientPhone, clientEmail, startDateTime, serviceId } =
      await req.json();

    if (!clientName || !clientPhone || !startDateTime || !serviceId) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
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

    const updatedBooking = await prisma.booking.update({
      where: { id },
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
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento." },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – excluir
========================= */
export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = Number(params.id);

  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const exists = await prisma.booking.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({
      ok: true,
      message: "Agendamento excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir agendamento." },
      { status: 500 }
    );
  }
}