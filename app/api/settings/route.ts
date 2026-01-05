import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function GET() {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const settings = await prisma.settings.findUnique({
    where: { id: 1 },
  });

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
