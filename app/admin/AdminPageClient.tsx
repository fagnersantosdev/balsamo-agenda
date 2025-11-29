"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingTable from "../components/BookingTable";
import Toast from "../components/Toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminMenu from "../components/AdminMenu";
import AdminMobileNav from "../components/AdminMobileNav";

// 🔹 Tipagem dos agendamentos
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

export default function AdminPageClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState({
    hoje: 0,
    futuros: 0,
    pendentes: 0,
    concluidos: 0,
    cancelados: 0,
  });
  const [filter, setFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] =
    useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ===================================================================
  // 📄 FUNÇÃO: EXPORTAR PDF
  // ===================================================================
  async function exportToPDF() {
  try {
    // ===================================================================
    // 📦 Recupera filtros atuais
    // ===================================================================
    const filter = sessionStorage.getItem("admin_filter") || "today";
    const statusFilter = sessionStorage.getItem("admin_status") || null;

    const query = new URLSearchParams();
    if (filter) query.set("filter", filter);
    if (statusFilter) query.set("status", statusFilter);

    // ===================================================================
    // 📡 Busca os dados da API
    // ===================================================================
    const res = await fetch(`/api/bookings?${query.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar agendamentos");

    const bookings: Booking[] = await res.json();

    // ===================================================================
    // 🗂 Define intervalos de datas
    // ===================================================================
    const now = new Date();

    const minDate = new Date();
    minDate.setMonth(now.getMonth() - 3);

    const maxDate = new Date();
    maxDate.setMonth(now.getMonth() + 3);

    // ===================================================================
    // 🔍 Filtragem final por período
    // ===================================================================
    const filteredBookings = bookings.filter((b) => {
      const start = new Date(b.startDateTime);

      if (filter === "future") {
        return start > now && start <= maxDate;
      }

      if (statusFilter === "CONCLUIDO" || statusFilter === "CANCELADO") {
        return start >= minDate && start <= now;
      }

      return start >= minDate && start <= maxDate;
    });

    if (filteredBookings.length === 0) {
      setToast({
        message: "⚠️ Nenhum agendamento encontrado neste filtro.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // ===================================================================
    // 🧾 Criação do PDF
    // ===================================================================
    const doc = new jsPDF();

    const titleMap: Record<string, string> = {
      today: "Agendamentos de Hoje",
      future: "Agendamentos Futuros (Próx. 3 meses)",
      all: "Relatório Geral (Últimos 3 meses)",
    };

    const title =
      statusFilter === "CONCLUIDO"
        ? "Agendamentos Concluídos (Últimos 3 meses)"
        : statusFilter === "CANCELADO"
        ? "Agendamentos Cancelados (Últimos 3 meses)"
        : titleMap[filter] || titleMap.all;

    // Cabeçalho (cor suave Bálsamo)
    doc.setTextColor(31, 57, 36); // Verde escuro
    doc.setFontSize(14);
    doc.text(title, 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Emitido em: ${now.toLocaleString("pt-BR")}`, 14, 25);

    // Dados da tabela
    const tableData = filteredBookings.map((b) => [
      b.clientName,
      b.clientPhone,
      b.service?.name || "—",
      new Date(b.startDateTime).toLocaleString("pt-BR"),
      b.status,
    ]);

    // Tabela com tom Bálsamo
    autoTable(doc, {
      startY: 30,
      head: [["Cliente", "Telefone", "Serviço", "Data/Hora", "Status"]],
      body: tableData,
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [31, 57, 36], // Verde
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 243, 235], // Bege bálsamo suave
      },
    });

    // Nome do arquivo final
    const filename = `Balsamo_${title.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);

    // ===================================================================
    // 🌿 Confirmação elegante
    // ===================================================================
    window.__adminToast?.({
      message: "🌿 PDF gerado com sucesso!",
      type: "success",
    });
  } catch (err) {
    console.error(err);
    window.__adminToast?.({
      message: "❌ Erro ao gerar o PDF.",
      type: "error",
    });
  }
}

  // ===================================================================
  // 📡 Carregar contadores
  // ===================================================================
  async function fetchCounts() {
    try {
      const res = await fetch("/api/bookings/counts");
      if (res.ok) setCounts(await res.json());
    } catch (err) {
      console.error("Erro ao buscar contadores:", err);
    }
  }

  // ===================================================================
  // 📡 Carregar agendamentos
  // ===================================================================
  async function fetchBookings(selectedFilter: string, status?: string | null) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedFilter) query.set("filter", selectedFilter);
      if (status) query.set("status", status);

      const res = await fetch(`/api/bookings?${query.toString()}`);
      if (res.ok) setBookings(await res.json());
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

  // ===================================================================
  // 🔁 Atualizar status (Confirmar / Cancelar)
  // ===================================================================
  async function updateStatus(
    id: number,
    newStatus: "PENDENTE" | "CONCLUIDO" | "CANCELADO"
  ) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

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

      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error(err);
      setToast({
        message: "❌ Erro ao atualizar status.",
        type: "error",
      });
      setTimeout(() => setToast(null), 4000);
    }
  }

  // ===================================================================
  // 🔁 Ao montar a página
  // ===================================================================
  useEffect(() => {
    fetchCounts();
    fetchBookings(filter, statusFilter);
  }, [filter, statusFilter]);

  // ===================================================================
  // 💾 Salvar filtro atual
  // ===================================================================
  useEffect(() => {
    sessionStorage.setItem("admin_filter", filter);
    sessionStorage.setItem("admin_status", statusFilter || "");
  }, [filter, statusFilter]);

  // ===================================================================
  // 📣 Listener para Exportar PDF no Mobile
  // ===================================================================
  // 🔔 Listener para o menu disparar o PDF
  useEffect(() => {
    function handlePDF() {
      exportToPDF(); // chama sua função de fato
    }

    window.addEventListener("admin:exportPDF", handlePDF);
    return () => window.removeEventListener("admin:exportPDF", handlePDF);
  }, []);

  // ===================================================================
  // 🔍 Busca local
  // ===================================================================
  const filteredBookings = bookings.filter(
    (b) =>
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm)
  );

  // ===================================================================
  // 📦 Botões dos cards
  // ===================================================================
  function handleCardClick(type: string) {
    switch (type) {
      case "hoje":
        setFilter("today");
        setStatusFilter(null);
        break;
      case "futuros":
        setFilter("future");
        setStatusFilter("PENDENTE");
        break;
      case "concluidos":
        setFilter("all");
        setStatusFilter("CONCLUIDO");
        break;
      case "cancelados":
        setFilter("all");
        setStatusFilter("CANCELADO");
        break;
    }
  }

  // ===================================================================
  // 🖥️ JSX
  // ===================================================================
  return (
    <>
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3924]">
            🌿 Painel Administrativo
          </h1>
          <p className="text-sm text-[#8D6A93] mt-1">
            Bem-vinda de volta, <strong>Administradora</strong>.
          </p>
        </div>

        {/* Menu Desktop */}
        <AdminMenu />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
        {[
          { label: "Hoje", key: "hoje" },
          { label: "Futuros", key: "futuros" },
          { label: "Concluídos", key: "concluidos" },
          { label: "Cancelados", key: "cancelados" },
        ].map(({ label, key }) => (
          <button
            key={key}
            onClick={() => handleCardClick(key)}
            className={`rounded-lg py-4 shadow border transition text-sm sm:text-base ${
              filter === key || statusFilter?.toLowerCase() === key
                ? "bg-[#1F3924] text-white border-[#1F3924]"
                : "bg-[#E4F0FD] text-[#1F3924] border-transparent hover:bg-[#dce7f9]"
            }`}
          >
            <p className="font-semibold">{label}</p>
            <p className="text-lg font-bold">
              {counts[key as keyof typeof counts]}
            </p>
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>

      {/* Tabela */}
      {loading ? (
        <p className="text-center text-[#1F3924]">
          Carregando agendamentos...
        </p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center text-[#1F3924]/70">
          Nenhum agendamento encontrado.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <BookingTable
            bookings={filteredBookings}
            updateStatus={updateStatus}
            showActions={filter === "today" || filter === "future"}
          />
        </div>
      )}

      {/* Mobile Bottom Menu */}
      <AdminMobileNav />

    </main>
    {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top"
        />
      )}
      </>
  );
}