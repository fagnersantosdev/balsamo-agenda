import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";

export async function GET() {
  // 🔒 PROTEÇÃO ADMIN - Apenas administradores podem ver serviços excluídos
  const authError = await requireAdminApiAuth();
  if (authError) return authError;

  try {
    const services = await prisma.service.findMany({
      where: { active: false }, // Filtra apenas os desativados (soft delete)
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços excluídos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar serviços excluídos." },
      { status: 500 }
    );
  }
}