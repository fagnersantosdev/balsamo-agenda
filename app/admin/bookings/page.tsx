"use client";
import { useEffect, useState } from "react";
import Toast from "../../components/toast";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  startDateTime: string;
  endDateTime: string;
  service: { name: string };
  status: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchBookings("PENDENTE");
  }, []);

  async function fetchBookings(status?: string) {
    setLoading(true);
    const url = status ? `/api/bookings?status=${status}` : "/api/bookings";
    const res = await fetch(url);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

    async function updateStatus(id: number, status: string, clientPhone?: string, clientName?: string, serviceName?: string) {
    try {
        const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        });

        if (res.ok) {
        setToast({ message: "Status atualizado com sucesso!", type: "success" });

        // ✅ Se for concluído, abre mensagem no WhatsApp
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

        fetchBookings("PENDENTE"); // recarrega pendentes por padrão
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


  return (
    <main className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        📋 Gerenciar Agendamentos
      </h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => fetchBookings("PENDENTE")} className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">Pendentes</button>
        <button onClick={() => fetchBookings("CONCLUIDO")} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">Concluídos</button>
        <button onClick={() => fetchBookings("CANCELADO")} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">Cancelados</button>
        <button onClick={() => fetchBookings()} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Todos</button>
      </div>

      {loading ? (
        <p className="text-[#1F3924]">Carregando agendamentos...</p>
      ) : bookings.length === 0 ? (
        <p className="text-[#1F3924]">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg">
            <thead>
              <tr className="bg-purple-200 text-[#1F3924]">
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Serviço</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-purple-50 transition">
                  <td className="p-3 font-medium">{b.clientName}</td>
                  <td className="p-3">{b.service.name}</td>
                  <td className="p-3">{new Date(b.startDateTime).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-center font-semibold">
                    {b.status === "PENDENTE" && <span className="text-yellow-700">⏳ Pendente</span>}
                    {b.status === "CONCLUIDO" && <span className="text-green-700">✅ Concluído</span>}
                    {b.status === "CANCELADO" && <span className="text-red-700">❌ Cancelado</span>}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {b.status === "PENDENTE" && (
                      <>
                        <button onClick={() => updateStatus( b.id, "CONCLUIDO", b.clientPhone, b.clientName, b.service.name)} className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800">
                        ✅ Concluir
                        </button>

                        <button onClick={() => updateStatus(b.id, "CANCELADO")} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                          ❌ Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
