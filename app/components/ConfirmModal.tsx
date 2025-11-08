"use client";
import React from "react";

type ConfirmModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: (sendWhatsApp?: boolean) => void;
  type: "CONCLUIDO" | "CANCELADO";
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: string;
};

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  type,
  clientName,
  clientPhone,
  serviceName,
  date,
}: ConfirmModalProps) {
  if (!show) return null;

  const title =
    type === "CONCLUIDO" ? "Concluir Atendimento" : "Cancelar Agendamento";
  const message =
    type === "CONCLUIDO"
      ? `Deseja marcar o atendimento de ${clientName} (${serviceName}) em ${date} como CONCLUÍDO?`
      : `Deseja cancelar o agendamento de ${clientName} (${serviceName}) em ${date}?`;

  const phoneNumber = clientPhone.startsWith("55")
    ? clientPhone
    : `55${clientPhone.replace(/\D/g, "")}`;

  const whatsMessage =
    type === "CONCLUIDO"
      ? `🌿 Olá ${clientName}!
      Aqui é da Balsamo Massoterapia. Seu atendimento de ${serviceName} foi concluído com sucesso. Esperamos vê-la em breve 💆‍♀️✨ Abraços!!`
      : `💬 Olá ${clientName}! Aqui é da Balsamo Massoterapia. Seu agendamento de ${serviceName} para ${date} foi cancelado. Caso queira reagendar, estamos à disposição 🌿💆‍♀️✨ Abraços!!`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsMessage
  )}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-[#1F3924] mb-3">{title}</h2>
        <p className="text-[#1F3924]/80 mb-6 leading-relaxed">{message}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => onConfirm(false)}
            className={`px-4 py-2 rounded-lg text-white ${
              type === "CONCLUIDO" ? "bg-green-700" : "bg-red-600"
            } hover:opacity-90 transition`}
          >
            Confirmar
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onConfirm(true)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-90 transition"
          >
            Confirmar e WhatsApp
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-[#1F3924] hover:bg-gray-400 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
