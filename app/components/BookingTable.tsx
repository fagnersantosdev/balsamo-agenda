"use client";
import { useState } from "react";
import { Booking } from "@/app/types/Booking";
import ConfirmModal from "./ConfirmModal";
import { Check, X, Calendar, Phone, User, Clock, DollarSign, Edit2 } from "lucide-react";
import {useRouter} from "next/navigation";


type Props = {
  bookings: Booking[];
  showActions?: boolean;
  updateStatus?: (id: number, status: "CONCLUIDO" | "CANCELADO") => Promise<void>;
};

export default function BookingTable({ bookings, showActions = true }: Props) {
  const router = useRouter();
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
      time: d.toLocaleTimeString("pt-BR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: false 
      }),
    };
  }

  // Função para formatar o preço do serviço
  function formatPrice(price?: number) {
    if (!price) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  async function updateStatus(id: number, status: "CONCLUIDO" | "CANCELADO") {
    await fetch(`/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDENTE": return "bg-amber-100 text-amber-700 border-amber-200";
      case "CONCLUIDO": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELADO": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ================= MOBILE (Layout de Cards) ================= */}
      <div className="sm:hidden space-y-4 px-2">
        {bookings.map((b) => {
          const { date, time } = formatDate(b.startDateTime);
          return (
            <div key={b.id} className="bg-white rounded-[2rem] border border-[#8D6A93]/10 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F5F3EB] rounded-full flex items-center justify-center text-[#97709B]">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1F3924] leading-tight">{b.clientName}</p>
                    <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-[#083536]/70 bg-[#F5F3EB]/30 p-3 rounded-2xl">
                <p className="flex items-center gap-2 font-medium text-[#083536]"><Clock size={14} className="text-[#97709B]"/> {b.service?.name}</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> {date} às {time}</p>
                <p className="flex items-center gap-2"><Phone size={14} /> {b.clientPhone}</p>
                <p className="flex items-center gap-2 font-bold text-[#97709B] mt-1">
                  <DollarSign size={14} /> {formatPrice(b.service?.price)}
                </p>
              </div>

              {showActions && b.status === "PENDENTE" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#8D6A93]/10">
                  {/* Editar */}
                  <button 
                    onClick={() => router.push(`/admin/edit/${b.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8D6A93]/10 text-[#8D6A93] rounded-xl hover:bg-[#8D6A93] hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* Concluir */}
                  <button 
                    onClick={() => setConfirmData({ show: true, id: b.id, type: "CONCLUIDO", clientName: b.clientName, clientPhone: b.clientPhone, serviceName: b.service?.name || "", date: `${date} ${time}` })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Check size={16} />
                  </button>

                  {/* Cancelar */}
                  {/* Usamos apenas o ícone no celular para economizar espaço e deixar os outros dois botões maiores, já que cancelar é uma ação menos frequente */}
                  <button 
                    onClick={() => setConfirmData({ show: true, id: b.id, type: "CANCELADO", clientName: b.clientName, clientPhone: b.clientPhone, serviceName: b.service?.name || "", date: `${date} ${time}` })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP (Tabela Otimizada) ================= */}
      <div className="hidden sm:block overflow-x-auto px-4">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3924]/60">
              <th className="pb-4 pl-6">Cliente</th>
              <th className="pb-4 px-4">Data/Hora</th>
              <th className="pb-4 px-4">Serviço</th>
              <th className="pb-4 px-4">Valor</th>
              <th className="pb-4 px-4">Status</th>
              {showActions && <th className="pb-4 pr-6 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const { date, time } = formatDate(b.startDateTime);
              return (
                <tr key={b.id} className="bg-white hover:bg-[#F5F3EB]/30 transition-all group">
                  <td className="py-4 pl-6 rounded-l-[1.5rem] border-y border-l border-[#8D6A93]/10">
                    <p className="font-bold text-[#1F3924]">{b.clientName}</p>
                    <p className="text-xs text-[#083536]/50">{b.clientPhone}</p>
                  </td>
                  <td className="py-4 px-4 border-y border-[#8D6A93]/10 text-sm font-medium text-[#083536]">
                    {date} <span className="text-[#97709B] font-bold">às {time}</span>
                  </td>
                  <td className="py-4 px-4 border-y border-[#8D6A93]/10 text-sm font-bold text-[#97709B]">
                    {b.service?.name}
                  </td>
                  <td className="py-4 px-4 border-y border-[#8D6A93]/10 text-sm font-bold text-[#97709B]">
                    {formatPrice(b.service?.price)}
                  </td>
                  <td className="py-4 px-4 border-y border-[#8D6A93]/10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  {showActions && (
                    <td className="py-4 pr-6 rounded-r-[1.5rem] border-y border-r border-[#8D6A93]/10 text-center">
                      {b.status === "PENDENTE" ? (
                        <div className="flex justify-center gap-4">

                          {/* Botão Editar */}
                          <button 
                            title="Editar"
                            onClick={() => router.push(`/admin/edit/${b.id}`)}
                            className="w-10 h-10 flex items-center justify-center bg-[#8D6A93]/10 text-[#97709B] rounded-xl hover:bg-[#97709B] hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 size={18} />
                          </button>
                
                          {/* Botão Concluir */}
                          <button 
                            title="Concluir"
                            onClick={() => setConfirmData({ show: true, id: b.id, type: "CONCLUIDO", clientName: b.clientName, clientPhone: b.clientPhone, serviceName: b.service?.name || "", date: `${date} ${time}` })}
                            className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check size={18} />
                          </button>
                      
                          {/* Botão Cancelar */}
                          <button 
                            title="Cancelar"
                            onClick={() => setConfirmData({ show: true, id: b.id, type: "CANCELADO", clientName: b.clientName, clientPhone: b.clientPhone, serviceName: b.service?.name || "", date: `${date} ${time}` })}
                            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 italic">Sem ações</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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