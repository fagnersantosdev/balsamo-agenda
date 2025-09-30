"use client";
import { useEffect, useState } from "react";
import Toast from "../components/toast";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  service: { name: string };
};

type FilterType = "all" | "future" | "past" | "today";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "future", label: "Futuros" },
  { key: "past", label: "Passados" },
  { key: "today", label: "Hoje" },
];

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });

    if (res.ok) {
      setToast({ message: "✅ Agendamento excluído com sucesso!", type: "success" });
      fetchBookings();
    } else {
      setToast({ message: "❌ Erro ao excluir agendamento", type: "error" });
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const now = new Date();
    const bookingDate = new Date(b.startDateTime);

    if (filter === "future") return bookingDate > now;
    if (filter === "past") return bookingDate < now;
    if (filter === "today") return bookingDate.toDateString() === now.toDateString();
    return true;
  });

  function getRowClass(date: string) {
    const now = new Date();
    const bookingDate = new Date(date);

    if (bookingDate.toDateString() === now.toDateString()) {
      return "bg-purple-100 text-purple-900 font-medium";
    } else if (bookingDate > now) {
      return "bg-green-50 text-green-900";
    } else {
      return "bg-gray-100 text-gray-500";
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg relative">
      <h1 className="text-2xl font-bold text-green-900 mb-6">
        Painel do Administrador
      </h1>

      {/* Botões de filtro */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {filters.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-lg border ${
              filter === btn.key
                ? "bg-green-900 text-white"
                : "bg-purple-100 text-green-900 hover:bg-purple-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-green-800">Carregando agendamentos...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-green-700">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-200 text-green-900">
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-left">Serviço</th>
                <th className="p-3 text-left">Data e Hora</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className={`border-b hover:opacity-90 transition-colors ${getRowClass(
                    b.startDateTime
                  )}`}
                >
                  <td className="p-3 font-medium">{b.clientName}</td>
                  <td className="p-3">{b.clientPhone}</td>
                  <td className="p-3">{b.service?.name}</td>
                  <td className="p-3">
                    {new Date(b.startDateTime).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-3">{b.clientEmail || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      ❌ Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast de feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
