"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Toast from "../components/toast";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  endDateTime: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
  service?: { name: string };
};

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📄 Exportar PDF conforme filtro atual
async function exportToPDF() {
  try {
    const filter = sessionStorage.getItem("admin_filter") || "today";
    const statusFilter = sessionStorage.getItem("admin_status") || null;

    const query = new URLSearchParams();
    if (filter) query.set("filter", filter);
    if (statusFilter) query.set("status", statusFilter);

    const res = await fetch(`/api/bookings?${query.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar agendamentos");

    const bookings: Booking[] = await res.json();

    // 🔹 Limites de tempo dinâmicos
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(now.getMonth() + 3);

    // 🔍 Aplica limitação por tipo de filtro
    const filteredBookings = bookings.filter((b) => {
      const start = new Date(b.startDateTime);

      if (filter === "future") {
        // Somente agendamentos do futuro até +3 meses
        return start > now && start <= threeMonthsAhead;
      }

      if (statusFilter === "CONCLUIDO" || statusFilter === "CANCELADO") {
        // Últimos 3 meses apenas
        return start >= threeMonthsAgo && start <= now;
      }

      // Filtros gerais
      return start >= threeMonthsAgo && start <= threeMonthsAhead;
    });

    if (filteredBookings.length === 0) {
      setToast({
        message: "⚠️ Nenhum agendamento encontrado neste filtro.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

        // 🧾 Geração do PDF
    const doc = new jsPDF();
    const titleMap: Record<string, string> = {
      today: "Agendamentos de Hoje",
      future: "Agendamentos Futuros (Próximos 3 meses)",
      all: "Relatório Geral (Últimos 3 meses)",
    };

    const title =
      statusFilter === "CONCLUIDO"
        ? "Agendamentos Concluídos (Últimos 3 meses)"
        : statusFilter === "CANCELADO"
        ? "Agendamentos Cancelados (Últimos 3 meses)"
        : titleMap[filter] || titleMap.all;

    doc.setFontSize(14);
    doc.text(`${title}`, 14, 18);
    doc.setFontSize(10);
    doc.text(`Emitido em: ${now.toLocaleString("pt-BR")}`, 14, 25);

    const tableData = filteredBookings.map((b) => [
      b.clientName,
      b.clientPhone,
      b.service?.name || "—",
      new Date(b.startDateTime).toLocaleString("pt-BR"),
      b.status,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Cliente", "Telefone", "Serviço", "Data/Hora", "Status"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 57, 36] },
    });

    // 📆 Nome do arquivo com intervalo de datas
    const formatDate = (d: Date) =>
      d.toLocaleDateString("pt-BR").replace(/\//g, "-");

    let startDateLabel = "";
    let endDateLabel = "";

    if (filter === "future") {
      startDateLabel = formatDate(now);
      endDateLabel = formatDate(threeMonthsAhead);
    } else if (statusFilter === "CONCLUIDO" || statusFilter === "CANCELADO") {
      startDateLabel = formatDate(threeMonthsAgo);
      endDateLabel = formatDate(now);
    } else {
      startDateLabel = formatDate(threeMonthsAgo);
      endDateLabel = formatDate(threeMonthsAhead);
    }

    const filename = `Relatorio_${title
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")}_${startDateLabel}_a_${endDateLabel}.pdf`;

    doc.save(filename);

    setToast({
      message: "✅ Relatório PDF gerado com sucesso!",
      type: "success",
    });
    setTimeout(() => setToast(null), 3000);
  } catch (error) {
    console.error("❌ Erro ao exportar PDF:", error);
    setToast({
      message: "❌ Erro ao gerar PDF. Tente novamente.",
      type: "error",
    });
    setTimeout(() => setToast(null), 3000);
  }
}


  return (
    <div className="relative" ref={menuRef}>
      {/* Botão hambúrguer */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border border-[#8D6A93]/40 rounded-lg hover:bg-[#F5F3EB] transition"
        aria-label="Abrir menu administrativo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-[#1F3924]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menu suspenso com animação */}
      <div
        className={`absolute right-0 mt-2 w-52 bg-white border border-[#8D6A93]/30 rounded-lg shadow-lg z-50 transform transition-all duration-200 origin-top-right ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {open && (
          <>
            <button
              onClick={exportToPDF}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              📄 Exportar PDF
            </button>

            <button
              onClick={() => (window.location.href = "/admin/services")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              ⚙️ Gerenciar Serviços
            </button>

            <button
              onClick={() => (window.location.href = "/admin/testimonials")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              ⭐ Gerenciar Avaliações
            </button>

            <button
              onClick={() => (window.location.href = "/admin/change-password")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              🔒 Alterar Senha
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-[#FEE2E2]"
            >
              🚪 Sair
            </button>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
