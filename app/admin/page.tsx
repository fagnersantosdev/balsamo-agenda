"use client";
import { useState, useEffect } from "react";
import Toast from "../components/toast";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";


// 🔹 Tipos
type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  service: { name: string };
  startDateTime: string;
  status: "PENDENTE" | "CONCLUIDO" | "CANCELADO";
};

type TabType = "agenda" | "status";

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabType>("agenda");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("HOJE");
  const [statusFilter, setStatusFilter] = useState("PENDENTE");
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState({ pendentes: 0, concluidos: 0, cancelados: 0 });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🔄 Atualiza dados iniciais
  useEffect(() => {
    if (tab === "agenda") fetchBookingsByDate(filter);
    else fetchBookingsByStatus(statusFilter);
    fetchCounts();
  }, [tab, filter, statusFilter]);

  // 🔍 Busca dinâmica
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchBookings(searchTerm);
    } else {
      if (tab === "agenda") fetchBookingsByDate(filter);
      else fetchBookingsByStatus(statusFilter);
    }
  }, [searchTerm]);

  // 🗓️ Buscar por data
  async function fetchBookingsByDate(filter: string) {
    try {
      const res = await fetch(`/api/bookings?filter=${filter}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  }

  // 🔖 Buscar por status
  async function fetchBookingsByStatus(status: string) {
    try {
      const res = await fetch(`/api/bookings?status=${status}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  }

  // 🔍 Buscar por nome/telefone
  async function searchBookings(term: string) {
    try {
      const res = await fetch(`/api/bookings?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  }

  // 📊 Contar status
  async function fetchCounts() {
    try {
      const res = await fetch(`/api/bookings/counts`);
      const data = await res.json();
      setCounts(data);
    } catch (error) {
      console.error(error);
    }
  }

  // ✅ Atualizar status (concluir/cancelar)
  async function updateStatus(
    id: number,
    status: "CONCLUIDO" | "CANCELADO",
    clientPhone?: string,
    clientName?: string,
    serviceName?: string
  ) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const msg =
          status === "CONCLUIDO"
            ? "✅ Atendimento concluído com sucesso!"
            : "❌ Agendamento cancelado.";
        setToast({ message: msg, type: "success" });

        // WhatsApp para serviços concluídos
        if (status === "CONCLUIDO" && clientPhone && clientName && serviceName) {
          const formattedPhone = clientPhone.startsWith("55")
            ? clientPhone
            : `55${clientPhone.replace(/\D/g, "")}`;
          const message = encodeURIComponent(
            `🌸 Olá, ${clientName}! Aqui é da *Bálsamo Massoterapia* 💆‍♀️\n\n` +
              `Seu atendimento de *${serviceName}* foi concluído com sucesso. 😊✨\n\n` +
              `Agradecemos por escolher nossos serviços e esperamos vê-la novamente em breve! 💜`
          );
          window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
        }

        fetchBookingsByStatus(statusFilter);
        fetchCounts();
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Erro ao atualizar status.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Erro de conexão com o servidor.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  }

  // 📄 Exportar PDF
  function exportToPDF() {
  const doc = new jsPDF();
  const month = new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" });
  doc.text(`📅 Relatório de Agendamentos - ${month}`, 14, 15);

  const tableData: RowInput[] = bookings.map((b) => [
    b.clientName,
    b.clientPhone,
    b.service.name,
    new Date(b.startDateTime).toLocaleString("pt-BR"),
    b.status,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Cliente", "Telefone", "Serviço", "Data", "Status"]],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [31, 57, 36] },
  });

  doc.save(`agendamentos_${month}.pdf`);
}


  // 🔸 Layout principal
  return (
    <main className="max-w-6xl mx-auto bg-[#F5F3EB] rounded-3xl shadow-lg p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1F3924] mb-6">Painel Administrativo 🌿</h1>

      {/* 🔹 Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 border-b pb-2">
        <button
          onClick={() => setTab("agenda")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            tab === "agenda" ? "bg-green-900 text-white" : "bg-gray-100 text-[#1F3924]"
          }`}
        >
          📅 Agenda
        </button>

        <button
          onClick={() => setTab("status")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            tab === "status" ? "bg-green-900 text-white" : "bg-gray-100 text-[#1F3924]"
          }`}
        >
          📋 Status ({counts.pendentes} pendentes)
        </button>
      </div>

      {/* 🔍 Busca e PDF */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou telefone..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={exportToPDF}
          className="bg-[#1F3924] text-white px-4 py-2 rounded-lg hover:bg-green-900 w-full sm:w-auto"
        >
          📄 Exportar PDF do mês
        </button>
      </div>

      {/* 🔹 Conteúdo das abas */}
      {tab === "agenda" ? (
        <AgendaSection filter={filter} setFilter={setFilter} bookings={bookings} />
      ) : (
        <StatusSection
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          bookings={bookings}
          updateStatus={updateStatus}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}

//
// 🔸 COMPONENTES
//
function AgendaSection({
  filter,
  setFilter,
  bookings,
}: {
  filter: string;
  setFilter: (v: string) => void;
  bookings: Booking[];
}) {
  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#1F3924]">📅 Visualizar Agenda</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {["HOJE", "FUTUROS", "PASSADOS", "TODOS"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-2 rounded ${
              filter === f ? "bg-green-800 text-white" : "bg-gray-200 text-[#1F3924]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <BookingTable bookings={bookings} showActions={false} />
    </>
  );
}

function StatusSection({
  statusFilter,
  setStatusFilter,
  bookings,
  updateStatus,
}: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  bookings: Booking[];
  updateStatus: (
    id: number,
    status: "CONCLUIDO" | "CANCELADO",
    phone?: string,
    name?: string,
    service?: string
  ) => void;
}) {
  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#1F3924]">
        📋 Gerenciar Status dos Agendamentos
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {["PENDENTE", "CONCLUIDO", "CANCELADO", "TODOS"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 sm:px-4 py-2 rounded ${
              statusFilter === s ? "bg-green-800 text-white" : "bg-gray-200 text-[#1F3924]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <BookingTable bookings={bookings} showActions updateStatus={updateStatus} />
    </>
  );
}

function BookingTable({
  bookings,
  showActions,
  updateStatus,
}: {
  bookings: Booking[];
  showActions: boolean;
  updateStatus?: (
    id: number,
    status: "CONCLUIDO" | "CANCELADO",
    phone?: string,
    name?: string,
    service?: string
  ) => void;
}) {
  if (!bookings.length)
    return <p className="text-gray-500 text-center py-6">Nenhum agendamento encontrado.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow text-sm sm:text-base">
        <thead>
          <tr className="bg-purple-200 text-[#1F3924]">
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Serviço</th>
            <th className="p-3 text-left">Data</th>
            <th className="p-3 text-center">Status</th>
            {showActions && <th className="p-3 text-center">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b hover:bg-purple-50 transition">
              <td className="p-3">{b.clientName}</td>
              <td className="p-3">{b.service.name}</td>
              <td className="p-3">
                {new Date(b.startDateTime).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td className="p-3 text-center font-semibold">
                {b.status === "CONCLUIDO" && "✅ Concluído"}
                {b.status === "PENDENTE" && "🕓 Pendente"}
                {b.status === "CANCELADO" && "❌ Cancelado"}
              </td>

              {showActions && updateStatus && (
                <td className="p-3 text-center flex justify-center gap-3">
                  {b.status === "PENDENTE" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            b.id,
                            "CONCLUIDO",
                            b.clientPhone,
                            b.clientName,
                            b.service.name
                          )
                        }
                        className="text-green-700 text-xl hover:scale-110 transition"
                        title="Concluir atendimento"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, "CANCELADO")}
                        className="text-red-600 text-xl hover:scale-110 transition"
                        title="Cancelar agendamento"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
