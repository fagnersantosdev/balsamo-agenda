import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

// 🔓 GET — público (cliente precisa ver horários)
export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Erro ao buscar availability:", error);
    return NextResponse.json(
      { error: "Erro ao buscar disponibilidade" },
      { status: 500 }
    );
  }
}

// 🔒 PATCH — somente ADMIN
export async function PATCH(req: Request) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const updates = await req.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Formato inválido." },
        { status: 400 }
      );
    }

    for (const item of updates) {
      await prisma.availability.update({
        where: { id: Number(item.id) },
        data: {
          openHour: Number(item.openHour),
          closeHour: Number(item.closeHour),
          active: Boolean(item.active),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao atualizar availability:", error);
    return NextResponse.json(
      { error: "Erro ao salvar alterações" },
      { status: 500 }
    );
  }
}

// 🔒 POST — somente ADMIN (se você realmente precisar)
export async function POST() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    const items = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao buscar availability:", error);
    return NextResponse.json(
      { error: "Erro ao buscar availability" },
      { status: 500 }
    );
  }
}
