import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 GET — Buscar todos os serviços
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json({ error: "Erro ao buscar serviços" }, { status: 500 });
  }
}

// 🟣 POST — Criar um novo serviço
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.price || !data.durationMin) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name: data.name,
        price: Number(data.price),
        durationMin: Number(data.durationMin),
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json({ error: "Erro ao criar serviço" }, { status: 500 });
  }
}
