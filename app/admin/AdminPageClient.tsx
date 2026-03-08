"use client";

import { useEffect, useState, useCallback } from "react";
import BookingTable from "../components/BookingTable";
import Toast from "../components/Toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminMenu from "../components/AdminMenu";
import { BookingsCountDTO } from "@/app/types/BookingsCountDTO";
import { Booking } from "@/app/types/Booking";
import { Search, Calendar, CheckCircle, XCircle, FileText, Loader2, User, Clock } from "lucide-react";

export default function AdminPageClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState<BookingsCountDTO>({
    todayPending: 0,
    futurePending: 0,
    completed: 0,
    canceled: 0,
  });

  const [filter, setFilter] = useState<"today" | "future" | "all">("today");
  const [statusFilter, setStatusFilter] = useState<"PENDENTE" | "CONCLUIDO" | "CANCELADO" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // --- Lógica de Busca de Dados ---
  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings/counts");
      if (res.ok) setCounts(await res.json());
    } catch {
      setToast({ message: "Erro ao carregar contadores.", type: "error" });
    }
  }, []);

  const fetchBookings = useCallback(async (f: string, s: string | null) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ filter: f });
      if (s) query.set("status", s);
      const res = await fetch(`/api/bookings?${query.toString()}`);
      if (res.ok) setBookings(await res.json());
    } catch {
      setToast({ message: "Erro ao carregar agendamentos.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    fetchBookings(filter, statusFilter);
  }, [filter, statusFilter, fetchCounts, fetchBookings]);

  // --- Funções de Ação ---
  async function updateStatus(id: number, newStatus: "CONCLUIDO" | "CANCELADO") {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setToast({ message: "Status atualizado!", type: "success" });
        fetchCounts();
        fetchBookings(filter, statusFilter);
      }
    } catch {
      setToast({ message: "Erro ao atualizar status.", type: "error" });
    }
  }

  const exportToPDF = useCallback(() => {
    if (bookings.length === 0) return;
    const doc = new jsPDF();
    doc.text("Relatório de Agendamentos - Bálsamo", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Cliente", "Serviço", "Data/Hora", "Status"]],
      body: bookings.map((b) => [
        b.clientName,
        b.service?.name || "N/A",
        new Date(b.startDateTime).toLocaleString("pt-BR"),
        b.status,
      ]),
    });
    doc.save("relatorio-balsamo.pdf");
  }, [bookings]);

  // Escuta o evento do AdminMenu para exportar PDF
  useEffect(() => {
    const handleExport = () => exportToPDF();
    window.addEventListener("admin:exportPDF", handleExport);
    return () => window.removeEventListener("admin:exportPDF", handleExport);
  }, [exportToPDF]);

  function handleCardClick(type: "todayPending" | "futurePending" | "completed" | "canceled") {
    switch (type) {
      case "todayPending": setFilter("today"); setStatusFilter("PENDENTE"); break;
      case "futurePending": setFilter("future"); setStatusFilter("PENDENTE"); break;
      case "completed": setFilter("all"); setStatusFilter("CONCLUIDO"); break;
      case "canceled": setFilter("all"); setStatusFilter("CANCELADO"); break;
    }
  }

  const filteredBookings = bookings.filter(
    (b) =>
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-[2.5rem] p-8 border border-[#8D6A93]/10 shadow-xl shadow-[#8D6A93]/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#1F3924] rounded-2xl flex items-center justify-center text-white">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1F3924] tracking-tight">Painel de Gestão</h1>
            <p className="text-[#8D6A93] text-sm font-medium">Bem-vinda, <span className="text-[#1F3924]">Administradora</span></p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 hidden md:block">
          <AdminMenu />
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatusCard label="Hoje" value={counts.todayPending} icon={<Clock size={20} />} color="bg-[#8D6A93]" onClick={() => handleCardClick("todayPending")} isActive={filter === "today" && statusFilter === "PENDENTE"} />
        <StatusCard label="Próximos" value={counts.futurePending} icon={<Calendar size={20} />} color="bg-[#D6A77A]" onClick={() => handleCardClick("futurePending")} isActive={filter === "future" && statusFilter === "PENDENTE"} />
        <StatusCard label="Concluídos" value={counts.completed} icon={<CheckCircle size={20} />} color="bg-[#1F3924]" onClick={() => handleCardClick("completed")} isActive={statusFilter === "CONCLUIDO"} />
        <StatusCard label="Cancelados" value={counts.canceled} icon={<XCircle size={20} />} color="bg-red-500" onClick={() => handleCardClick("canceled")} isActive={statusFilter === "CANCELADO"} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F3924]/30 w-5 h-5" />
          <input
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#8D6A93]/10 bg-white shadow-sm outline-none transition-all"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-[#8D6A93] bg-[#8D6A93]/5 px-4 py-2 rounded-full border border-[#8D6A93]/10">
           Exibindo: {statusFilter || "Todos"} ({filter})
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#8D6A93]/10 shadow-2xl shadow-[#8D6A93]/5 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <Loader2 className="animate-spin w-12 h-12 text-[#1F3924] mb-4" />
            <p className="font-bold uppercase text-xs">Sincronizando...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <BookingTable bookings={filteredBookings} updateStatus={updateStatus} showActions={filter !== "all"} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <FileText size={40} className="text-[#8D6A93] mb-4" />
            <h3 className="text-2xl font-bold text-[#1F3924]">Nenhum registro</h3>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}

function StatusCard({ label, value, icon, color, onClick, isActive }: {
  label: string; value: number; icon: React.ReactNode; color: string; onClick: () => void; isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-[2rem] border transition-all duration-500 text-left ${
        isActive ? "bg-white border-[#8D6A93] shadow-xl ring-1 ring-[#8D6A93]" : "bg-white border-[#8D6A93]/10 hover:border-[#8D6A93]/40 shadow-sm"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-black uppercase text-[#1F3924]/40 mb-1">{label}</p>
      <p className="text-3xl font-black text-[#1F3924]">{value}</p>
      {isActive && <div className={`absolute top-0 right-0 w-2 h-full ${color}`} />}
    </button>
  );
}