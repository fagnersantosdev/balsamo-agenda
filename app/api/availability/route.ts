import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📅 GET — busca horários de funcionamento
export async function GET() {
  const days = await prisma.availability.findMany({ orderBy: { dayOfWeek: "asc" } });
  return NextResponse.json(days);
}

// ✏️ PATCH — atualiza horários de funcionamento
export async function PATCH(req: Request) {
  const data = await req.json();

  const updated = await Promise.all(
    data.map((d: any) =>
      prisma.availability.update({
        where: { id: d.id },
        data: {
          openHour: d.openHour,
          closeHour: d.closeHour,
          active: d.active,
        },
      })
    )
  );

  return NextResponse.json({ ok: true, updated });
}
