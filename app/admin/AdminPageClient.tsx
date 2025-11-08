"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingTable from "../components/BookingTable";
import Toast from "../components/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminMenu from "../components/AdminMenu";

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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔄 Buscar contadores
  async function fetchCounts() {
    try {
      const res = await fetch("/api/bookings/counts");
      if (res.ok) {
        const data = await res.json();
        setCounts(data);
      }
    } catch (err) {
      console.error("Erro ao buscar contadores:", err);
    }
  }

  // 🔍 Buscar agendamentos (com filtros)
  async function fetchBookings(selectedFilter: string, status?: string | null) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedFilter) query.set("filter", selectedFilter);
      if (status) query.set("status", status);
      const res = await fetch(`/api/bookings?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setToast({ message: "❌ Erro ao carregar agendamentos.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // ✅ Atualizar status (confirmar / cancelar)
  async function updateStatus(id: number, newStatus: "PENDENTE" | "CONCLUIDO" | "CANCELADO") {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      setToast({
        message: newStatus === "CONCLUIDO" ? "✅ Agendamento concluído!" : "❌ Agendamento cancelado.",
        type: "success",
      });

      // Atualiza contadores e lista
      fetchCounts();
      fetchBookings(filter, statusFilter);
    } catch (error) {
      console.error(error);
      setToast({ message: "❌ Erro ao atualizar status.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  }

  // 🏁 Carregar dados iniciais
  useEffect(() => {
    fetchCounts();
    fetchBookings(filter, statusFilter);
  }, [filter, statusFilter]);

  // 🧭 Mantém filtro atual sincronizado com o menu
  useEffect(() => {
    sessionStorage.setItem("admin_filter", filter);
    sessionStorage.setItem("admin_status", statusFilter || "");
  }, [filter, statusFilter]);


  // 🔍 Filtro de busca
  const filteredBookings = bookings.filter(
    (b) =>
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm)
  );

  // 📦 Clique nos cards
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
      default:
        setFilter("today");
        setStatusFilter(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Título + menu */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3924]">🌿 Painel Administrativo</h1>
          <p className="text-sm text-[#8D6A93] mt-1">
            Bem-vinda de volta, <strong>Administradora</strong>.
          </p>
        </div>
        <AdminMenu />
      </div>

      {/* 🔹 Cards de contagem */}
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
            <p className="text-lg font-bold">{counts[key as keyof typeof counts]}</p>
          </button>
        ))}
      </div>

      {/* 🔍 Campo de busca */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>

      {/* 📋 Tabela */}
      {loading ? (
        <p className="text-center text-[#1F3924]">Carregando agendamentos...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center text-[#1F3924]/70">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <BookingTable
            bookings={filteredBookings}
            updateStatus={updateStatus}
            showActions={filter === "today" || filter === "future"}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
