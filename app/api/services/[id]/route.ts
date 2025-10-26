import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ agora params é esperado corretamente
  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    console.error("❌ Erro ao buscar serviço:", error);
    return NextResponse.json({ error: "Erro interno ao buscar serviço." }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const serviceId = Number(id);
    console.log("🟡 Atualizando serviço ID:", serviceId);

    const data = await req.json();
    console.log("📦 Dados recebidos:", data);

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nenhum dado fornecido." }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data,
    });

    console.log("✅ Serviço atualizado:", updated);
    return NextResponse.json({
      ok: true,
      message: "Serviço atualizado com sucesso.",
      updated,
    });
  } catch (error: unknown) {
    console.error("❌ Erro ao atualizar serviço:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Erro interno ao atualizar serviço." }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const serviceId = Number(id);
    console.log("🗑️ Excluindo serviço ID:", serviceId);

    const deleted = await prisma.service.update({
      where: { id: serviceId },
      data: { active: false },
    });

    return NextResponse.json({
      ok: true,
      message: "Serviço marcado como inativo.",
      deleted,
    });
  } catch (error: unknown) {
    console.error("❌ Erro ao excluir serviço:", error);
    return NextResponse.json({ error: "Erro interno ao excluir serviço." }, { status: 500 });
  }
}
