"use client";
import { useState} from "react"
import { Booking } from "@/app/types/Booking";
import ConfirmModal from "./ConfirmModal";

type Props = {
  bookings: Booking[];
  showActions?: boolean;
};

export default function BookingTable({ bookings, showActions = true }: Props) {
  const [confirmData, setConfirmData] = useState<{
    show: boolean;
    id?: number;
    type?: "CONCLUIDO" | "CANCELADO";
    clientName?: string;
    clientPhone?: string;
    serviceName?: string;
    date?: string;
  }>({ show: false });

  function formatDate(date: string) {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString("pt-BR"),
      time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
  }

  async function updateStatus(
    id: number,
    status: "CONCLUIDO" | "CANCELADO"
  ) {
    await fetch(`/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  return (
    <div className="w-full">

      {/* ================= MOBILE ================= */}
      <div className="sm:hidden space-y-4">
        {bookings.map((b) => {
          const { date, time } = formatDate(b.startDateTime);

          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-[#8D6A93]/20 shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#1F3924]">
                    {b.clientName}
                  </p>
                  <p className="text-sm text-[#1F3924]/70">
                    {b.service?.name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === "PENDENTE"
                      ? "bg-yellow-200 text-yellow-800"
                      : b.status === "CONCLUIDO"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="text-sm text-[#1F3924]/70 space-y-1">
                <p>📅 {date} às {time}</p>
                <p>📞 {b.clientPhone}</p>
              </div>

              {showActions && b.status === "PENDENTE" && (
                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl"
                    onClick={() =>
                      setConfirmData({
                        show: true,
                        id: b.id,
                        type: "CONCLUIDO",
                        clientName: b.clientName,
                        clientPhone: b.clientPhone,
                        serviceName: b.service?.name || "",
                        date: `${date} ${time}`,
                      })
                    }
                  >
                    Concluir
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white py-2 rounded-xl"
                    onClick={() =>
                      setConfirmData({
                        show: true,
                        id: b.id,
                        type: "CANCELADO",
                        clientName: b.clientName,
                        clientPhone: b.clientPhone,
                        serviceName: b.service?.name || "",
                        date: `${date} ${time}`,
                      })
                    }
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-[#1F3924]/70 border-b">
              <th className="py-3 px-2">Cliente</th>
              <th className="py-3 px-2">Data</th>
              <th className="py-3 px-2">Serviço</th>
              <th className="py-3 px-2">Status</th>
              {showActions && <th className="py-3 px-2">Ações</th>}
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const { date, time } = formatDate(b.startDateTime);

              return (
                <tr
                  key={b.id}
                  className="border-b hover:bg-[#F5F3EB]/40 transition"
                >
                  <td className="py-3 px-2">
                    <p className="font-medium">{b.clientName}</p>
                    <p className="text-sm text-[#1F3924]/60">
                      {b.clientPhone}
                    </p>
                  </td>

                  <td className="py-3 px-2 text-sm">
                    {date} às {time}
                  </td>

                  <td className="py-3 px-2 text-sm">
                    {b.service?.name}
                  </td>

                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <td className="py-3 px-2 space-x-2">
                      {b.status === "PENDENTE" && (
                        <>
                          <button
                            className="text-green-700 hover:underline"
                            onClick={() =>
                              setConfirmData({
                                show: true,
                                id: b.id,
                                type: "CONCLUIDO",
                                clientName: b.clientName,
                                clientPhone: b.clientPhone,
                                serviceName: b.service?.name || "",
                                date: `${date} ${time}`,
                              })
                            }
                          >
                            Concluir
                          </button>

                          <button
                            className="text-red-600 hover:underline"
                            onClick={() =>
                              setConfirmData({
                                show: true,
                                id: b.id,
                                type: "CANCELADO",
                                clientName: b.clientName,
                                clientPhone: b.clientPhone,
                                serviceName: b.service?.name || "",
                                date: `${date} ${time}`,
                              })
                            }
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      <ConfirmModal
        show={confirmData.show}
        onClose={() => setConfirmData({ show: false })}
        onConfirm={(sendWhatsApp) => {
          if (confirmData.id && confirmData.type) {
            updateStatus(confirmData.id, confirmData.type);
            if (sendWhatsApp) window.open("https://wa.me/", "_blank");
          }
        }}
        type={confirmData.type!}
        clientName={confirmData.clientName || ""}
        clientPhone={confirmData.clientPhone || ""}
        serviceName={confirmData.serviceName || ""}
        date={confirmData.date || ""}
      />
    </div>
  );
}
