import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApiAuth } from "@/lib/adminApiAuth";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  // Proteção da rota
  const auth = await requireAdminApiAuth();
  if (auth) return auth;

  try {
    // 1. Capturar todos os filtros enviados pelo ecrã
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "TODOS";
    const month = searchParams.get("month") || "";
    const year = searchParams.get("year") || new Date().getFullYear().toString();

    // 2. Construir o filtro de Datas (Início e Fim do Mês/Ano)
    let dateFilter: Prisma.DateTimeFilter | undefined = undefined;
    
    if (year) {
      const yearNum = parseInt(year);
      if (month) {
        // Se escolheu um mês específico (Em JavaScript Janeiro é 0)
        const monthNum = parseInt(month) - 1; 
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
        dateFilter = { gte: startDate, lte: endDate };
      } else {
        // Se escolheu apenas o Ano todo
        const startDate = new Date(yearNum, 0, 1);
        const endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);
        dateFilter = { gte: startDate, lte: endDate };
      }
    }

    // 📊 PARTE A: MÉTRICAS GLOBAIS DO PERÍODO
    // Aqui procura todos os agendamentos do período de tempo selecionado
    // para calcular o faturamento real, ignorando a barra de pesquisa ou o status.
    const metricsBookings = await prisma.booking.findMany({
      where: {
        ...(dateFilter && { startDateTime: dateFilter })
      },
      include: { service: true } // Precisa do serviço para somar os preços!
    });

    let revenue = 0;
    let lost = 0;

    metricsBookings.forEach((b) => {
      if (b.status === "CONCLUIDO") {
        revenue += b.service.price;
      } else if (b.status === "CANCELADO") {
        lost += b.service.price;
      }
    });


    // ============================================================
    // 📋 PARTE B: LISTA FILTRADA PARA A TABELA
    // ============================================================
    const bookingsList = await prisma.booking.findMany({
      where: {
        // Se houver filtro de data, adiciona a regra
        ...(dateFilter ? { startDateTime: dateFilter } : {}),
        
        // Se o status não for "TODOS", força a tipagem exata dos status do seu banco
        ...(status !== "TODOS" ? { status: status as "PENDENTE" | "CONCLUIDO" | "CANCELADO" } : {}),
        
        // Se houver pesquisa, adiciona a busca por nome (sem o 'mode: insensitive')
        ...(search ? { clientName: { contains: search } } : {})
      },
      include: { service: true },
      orderBy: { startDateTime: "desc" } // Mostra os mais recentes primeiro
    });

    // 3. Devolve tudo empacotado para o Frontend
    return NextResponse.json({
      metrics: {
        revenue,
        lost,
        totalBookings: metricsBookings.length
      },
      bookings: bookingsList
    });

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar os relatórios." },
      { status: 500 }
    );
  }
}