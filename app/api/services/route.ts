import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * ✅ GET /api/services
 * Retorna todos os serviços cadastrados
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao carregar lista de serviços." },
      { status: 500 }
    );
  }
}

/**
 * ✅ POST /api/services
 * Cria um novo serviço
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.price || !data.durationMin) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: Number(data.price),
        durationMin: Number(data.durationMin),
        details: data.details || [], // ✅ salva array JSON
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao criar serviço." },
      { status: 500 }
    );
  }
}
