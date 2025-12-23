import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

// 🔓 GET público (ex: página de detalhes)
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!service || !service.active) {
      return NextResponse.json(
        { error: "Serviço não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("❌ Erro ao buscar serviço:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar serviço." },
      { status: 500 }
    );
  }
}

// 🔒 PATCH → ADMIN
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const { id } = await context.params;

  try {
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado fornecido." },
        { status: 400 }
      );
    }

    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({
      ok: true,
      message: "Serviço atualizado com sucesso.",
      updated,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar serviço:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Serviço não encontrado." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro interno ao atualizar serviço." },
      { status: 500 }
    );
  }
}

// 🔒 DELETE → ADMIN (soft delete)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  const { id } = await context.params;

  try {
    const deleted = await prisma.service.update({
      where: { id: Number(id) },
      data: { active: false },
    });

    return NextResponse.json({
      ok: true,
      message: "Serviço desativado com sucesso.",
      deleted,
    });
  } catch (error) {
    console.error("❌ Erro ao excluir serviço:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir serviço." },
      { status: 500 }
    );
  }
}
