"use client";
import React from "react";

type Booking = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDateTime: string;
  endDateTime: string;
  status: string;
  service?: { name: string };
};

type BookingTableProps = {
  bookings: Booking[];
  updateStatus: (id: number, status: "PENDENTE" | "CONCLUIDO" | "CANCELADO") => void;
  showActions?: boolean;
};


export default function BookingTable({
  bookings,
  showActions = false,
  updateStatus,
}: BookingTableProps) {
  //const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#8D6A93]/30 bg-white rounded-lg shadow-md text-sm sm:text-base">
        <thead className="bg-[#F5F3EB] text-[#1F3924]">
          <tr>
            <th className="py-3 px-4 text-left">Cliente</th>
            <th className="py-3 px-4 text-left hidden sm:table-cell">Serviço</th>
            <th className="py-3 px-4 text-left">Data</th>
            <th className="py-3 px-4 text-left hidden sm:table-cell">Telefone</th>
            <th className="py-3 px-4 text-center">Status</th>
            {showActions && <th className="py-3 px-4 text-center">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const start = new Date(b.startDateTime);
            const dateStr = start.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const timeStr = start.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <tr
                key={b.id}
                className="border-t border-[#8D6A93]/20 hover:bg-[#F9F7F2] transition"
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{b.clientName}</div>
                  {/* Exibe detalhes adicionais no mobile */}
                  <div className="text-xs text-[#1F3924]/70 sm:hidden mt-1">
                    📞 {b.clientPhone} <br />
                    💆 {b.service?.name || "—"} <br />
                    🕓 {dateStr} às {timeStr}
                  </div>
                </td>

                <td className="py-3 px-4 hidden sm:table-cell">
                  {b.service?.name || "—"}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {dateStr} <br />
                  <span className="text-sm text-[#1F3924]/70">{timeStr}</span>
                </td>

                <td className="py-3 px-4 hidden sm:table-cell">
                  {b.clientPhone}
                </td>

                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      b.status === "PENDENTE"
                        ? "bg-yellow-200 text-yellow-800"
                        : b.status === "CONCLUIDO"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                {showActions && (
                  <td className="py-3 px-4 text-center">
                    {b.status === "PENDENTE" ? (
                      <div className="flex justify-center gap-3">
                        <button
                          title="Concluir"
                          onClick={() => updateStatus?.(b.id, "CONCLUIDO")}
                          className="text-green-600 text-xl hover:scale-110 transition"
                        >
                          ✅
                        </button>
                        <button
                          title="Cancelar"
                          onClick={() => updateStatus?.(b.id, "CANCELADO")}
                          className="text-red-600 text-xl hover:scale-110 transition"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#1F3924]/70 text-sm">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <p className="text-center text-[#1F3924]/60 py-6">
          Nenhum agendamento encontrado.
        </p>
      )}
    </div>
  );
}
