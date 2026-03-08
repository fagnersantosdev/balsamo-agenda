import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json({ error: "Erro ao buscar serviços" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // 🔒 PROTEÇÃO ADMIN
  const authError = await requireAdminApiAuth();
  if (authError) return authError;

  try {
    const data = await req.json();

    if (!data.name || !data.price || !data.durationMin) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        name: data.name,
        price: Number(data.price),
        durationMin: Number(data.durationMin),
        details:
          Array.isArray(data.details)
            ? data.details
            : typeof data.details === "string"
            ? data.details
                .split("\n")
                .map((d: string) => d.trim())
                .filter(Boolean)
            : [],
        active: true,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao criar serviço" },
      { status: 500 }
    );
  }
}

