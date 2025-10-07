"use client";
import { useEffect, useState } from "react";
import Toast from "../components/toast";
import Link from "next/link";


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
  const [search, setSearch] = useState(""); // 🔎 estado da busca
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

  // 🔎 Aplica filtro por data e busca por nome/telefone
  const filteredBookings = bookings.filter((b) => {
    const now = new Date();
    const bookingDate = new Date(b.startDateTime);

    let dateMatch = true;
    if (filter === "future") dateMatch = bookingDate > now;
    if (filter === "past") dateMatch = bookingDate < now;
    if (filter === "today") dateMatch = bookingDate.toDateString() === now.toDateString();

    const searchTerm = search.toLowerCase();
    const searchMatch =
      b.clientName.toLowerCase().includes(searchTerm) ||
      b.clientPhone.toLowerCase().includes(searchTerm);

    return dateMatch && (search === "" || searchMatch);
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
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        Painel do Administrador
      </h1>

      {/* 🔎 Barra de filtros e busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        {/* Botões de filtro */}
        <div className="flex gap-2 flex-wrap">
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

        <Link
        href="/admin/services"
        className="inline-block bg-[#8D6A93] text-[#FFFEF9] px-5 py-2 rounded-lg shadow hover:bg-[#7A5981] transition-all duration-300 text-sm font-medium"
      >
        ⚙️ Gerenciar Serviços
      </Link>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-80 focus:ring-2 focus:ring-green-700 outline-none"
        />
      </div>

      {loading ? (
        <p className="text-[#1F3924]">Carregando agendamentos...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-[#1F3924]">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="hidden sm:table-header-group">
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
                className="border-b hover:opacity-90 transition-colors sm:table-row block mb-4 sm:mb-0 sm:border-0"
              >
                {/* Cliente */}
                <td className="p-3 font-medium sm:table-cell block">
                  <span className="sm:hidden font-semibold">Cliente: </span>
                  {b.clientName}
                </td>

                {/* Telefone */}
                <td className="p-3 sm:table-cell block">
                  <span className="sm:hidden font-semibold">Telefone: </span>
                  {b.clientPhone}
                </td>

                {/* Serviço */}
                <td className="p-3 sm:table-cell block">
                  <span className="sm:hidden font-semibold">Serviço: </span>
                  {b.service?.name}
                </td>

                {/* Data */}
                <td className="p-3 sm:table-cell block">
                  <span className="sm:hidden font-semibold">Data: </span>
                  {new Date(b.startDateTime).toLocaleString("pt-BR")}
                </td>

                {/* E-mail */}
                <td className="p-3 sm:table-cell block">
                  <span className="sm:hidden font-semibold">E-mail: </span>
                  {b.clientEmail || "—"}
                </td>

                {/* Ações */}
                <td className="p-3 text-center sm:table-cell block flex justify-center gap-3">
                {/* ✏️ Botão Editar */}
                <Link
                  href={`/admin/edit/${b.id}`}
                  className="p-2 text-blue-600 hover:text-blue-800 transition"
                  title="Editar agendamento"
                >
                  ✏️
                </Link>

                {/* 🗑️ Botão Excluir */}
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition"
                  title="Excluir agendamento"
                >
                  🗑️
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
