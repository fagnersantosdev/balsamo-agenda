"use client";

import { useEffect, useState, useCallback } from "react";
import BookingTable from "../components/BookingTable";
import Toast from "../components/Toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminMenu from "../components/AdminMenu";
import { BookingsCountDTO } from "@/app/types/BookingsCountDTO";
import { Booking } from "@/app/types/Booking";


export default function AdminPageClient() {
  /* =====================================================
     Estados
  ===================================================== */
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState<BookingsCountDTO>({
    todayPending: 0,
    futurePending: 0,
    completed: 0,
    canceled: 0,
  });

  const [filter, setFilter] = useState<"today" | "future" | "all">("today");
  const [statusFilter, setStatusFilter] = useState<
    "PENDENTE" | "CONCLUIDO" | "CANCELADO" | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* =====================================================
     Buscar contadores (DTO)
  ===================================================== */
 async function fetchCounts() {
  try {
    const res = await fetch("/api/bookings/counts");

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("Erro /counts:", res.status, err);
      setToast({
        message: "❌ Erro ao carregar contadores.",
        type: "error",
      });
      return;
    }

    const data: BookingsCountDTO = await res.json();
    setCounts(data);
  } catch (err) {
    console.error("Erro ao buscar contadores:", err);
    setToast({ message: "❌ Erro ao buscar contadores.", type: "error" });
  }
}

  /* =====================================================
     Buscar agendamentos
  ===================================================== */
  async function fetchBookings(
    selectedFilter: "today" | "future" | "all",
    status?: "PENDENTE" | "CONCLUIDO" | "CANCELADO" | null
  ) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("filter", selectedFilter);
      if (status) query.set("status", status);

      const res = await fetch(`/api/bookings?${query.toString()}`);
      if (!res.ok) throw new Error();

      setBookings(await res.json());
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setToast({
        message: "❌ Erro ao carregar agendamentos.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     Atualizar status
  ===================================================== */
  async function updateStatus(
    id: number,
    newStatus: "CONCLUIDO" | "CANCELADO"
  ) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      fetchCounts();
      fetchBookings(filter, statusFilter);

      setToast({
        message:
          newStatus === "CONCLUIDO"
            ? "✅ Agendamento concluído!"
            : "❌ Agendamento cancelado.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        message: "❌ Erro ao atualizar status.",
        type: "error",
      });
    }
  }

  /* =====================================================
      Exportar PDF (Versão Final sem Warnings)
  ===================================================== */
  const exportToPDF = useCallback(async () => {
    try {
      // 1. Buscamos os dados direto da API para garantir que o PDF reflita os filtros atuais
      const resBookings = await fetch(
        `/api/bookings?filter=${filter}&status=${statusFilter || ""}`
      );

      if (!resBookings.ok) {
        setToast({ message: "❌ Erro ao buscar dados para o PDF.", type: "error" });
        return;
      }

      // Tipamos explicitamente a constante 'data'
      const data: Booking[] = await resBookings.json();

      if (data.length === 0) {
        setToast({ message: "⚠️ Nenhum agendamento para exportar.", type: "error" });
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Relatório de Agendamentos - Bálsamo", 14, 18);

      autoTable(doc, {
        startY: 26,
        head: [["Cliente", "Telefone", "Serviço", "Início", "Fim", "Status"]],
        // Tipamos o parâmetro 'b' como Booking para remover o warning de 'any'
        body: data.map((b: Booking) => {
          const start = new Date(b.startDateTime);
          
          // Cálculo do Fim Real (Sem Buffer)
          const duration = b.service?.durationMin || 0;
          const endReal = new Date(start.getTime() + duration * 60000);

          const formatOptions: Intl.DateTimeFormatOptions = {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };

          const dateStr = start.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
          const startTimeStr = start.toLocaleTimeString("pt-BR", formatOptions);
          const endTimeStr = endReal.toLocaleTimeString("pt-BR", formatOptions);

          return [
            b.clientName,
            b.clientPhone,
            b.service?.name || "—",
            `${dateStr} ${startTimeStr}`,
            endTimeStr,
            b.status,
          ];
        }),
        headStyles: { fillColor: [31, 57, 36], textColor: 255 },
        styles: { fontSize: 9 }, // Ajuste leve para caber todas as colunas
      });

      doc.save(`Balsamo_Relatorio_${filter}.pdf`);
      setToast({ message: "📄 PDF gerado com sucesso!", type: "success" });
    } catch (err) {
      console.error("Erro PDF:", err);
      setToast({ message: "❌ Erro ao gerar PDF.", type: "error" });
    }
  }, [filter, statusFilter]); 

  /* =====================================================
     Effects
  ===================================================== */
  
  useEffect(() => {
    fetchCounts();
    fetchBookings(filter, statusFilter);
  }, [filter, statusFilter]);

  useEffect(() => {
  function handlePDF() {
    exportToPDF();
  }

  window.addEventListener("admin:exportPDF", handlePDF);
  return () => window.removeEventListener("admin:exportPDF", handlePDF);
}, [exportToPDF]);

  /* =====================================================
     Busca local
  ===================================================== */
  const filteredBookings = bookings.filter(
    (b) =>
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm)
  );

  /* =====================================================
     Handlers dos cards
  ===================================================== */
  type DashboardFilter =
  | "todayPending"
  | "futurePending"
  | "completed"
  | "canceled";

function handleCardClick(type: DashboardFilter) {
  switch (type) {
    case "todayPending":
      setFilter("today");
      setStatusFilter("PENDENTE");
      break;

    case "futurePending":
      setFilter("future");
      setStatusFilter("PENDENTE");
      break;

    case "completed":
      setFilter("all");
      setStatusFilter("CONCLUIDO");
      break;

    case "canceled":
      setFilter("all");
      setStatusFilter("CANCELADO");
      break;
  }
}

const hasBookings = filteredBookings.length > 0;

  /* =====================================================
     JSX
  ===================================================== */
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8 bg-[#F5F3EB]/90 rounded-2xl p-5 border shadow flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F3924]">
            🌿 Painel Administrativo
          </h1>
          <p className="text-sm text-[#8D6A93]">
            Bem-vinda de volta, <strong>Administradora</strong>
          </p>
        </div>
        <AdminMenu />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card
        label="Hoje"
        value={counts.todayPending}
        onClick={() => handleCardClick("todayPending")}
      />

      <Card
        label="Futuros"
        value={counts.futurePending}
        onClick={() => handleCardClick("futurePending")}
      />

      <Card
        label="Concluídos"
        value={counts.completed}
        onClick={() => handleCardClick("completed")}
      />

      <Card
        label="Cancelados"
        value={counts.canceled}
        onClick={() => handleCardClick("canceled")}
      />
      </div>

      {/* Busca */}
      <input
        className="w-full sm:w-1/2 mb-6 p-3 rounded-xl border"
        placeholder="Buscar por nome ou telefone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tabela */}
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : hasBookings ? (
        <BookingTable
          bookings={filteredBookings}
          updateStatus={updateStatus}
          showActions={filter !== "all"}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📭</div>

          <h3 className="text-lg font-semibold text-[#1F3924]">
            Nenhum agendamento encontrado
          </h3>

          <p className="text-sm text-[#1F3924]/70 mt-2 max-w-sm">
            Não há registros para o filtro selecionado no momento.
          </p>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}

/* =====================================================
   Card Component
===================================================== */
function Card({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-[#E4F0FD] p-4 shadow hover:shadow-md transition"
    >
      <p className="font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );
}