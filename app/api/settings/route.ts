import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";
import { Settings } from "@prisma/client"; // Importe o tipo gerado

export async function GET() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const settings = await prisma.settings.findUnique({
    where: { id: 1 },
  });

  // Se não existir, criamos um objeto que satisfaça a interface 'Settings'
  if (!settings) {
    const fallbackSettings: Settings = { 
      id: 1, 
      bufferMinutes: 15,
      updatedAt: new Date() // O campo obrigatório agora está presente
    };
    return NextResponse.json(fallbackSettings);
  }

  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const { bufferMinutes } = await req.json();

  if (
    typeof bufferMinutes !== "number" ||
    bufferMinutes < 0 ||
    bufferMinutes > 120
  ) {
    return NextResponse.json(
      { error: "Buffer inválido (0 a 120 minutos)." },
      { status: 400 }
    );
  }

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: { bufferMinutes },
    create: { id: 1, bufferMinutes },
  });

  return NextResponse.json(settings);
}
