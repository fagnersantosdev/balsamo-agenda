"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      ? `🌿 Olá ${clientName}! Seu atendimento de ${serviceName} foi concluído com sucesso. Esperamos vê-la em breve 💆‍♀️✨`
      : `💬 Olá ${clientName}! Seu agendamento de ${serviceName} para ${date} foi cancelado. Caso queira reagendar, estamos à disposição 🌿`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsMessage
  )}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border border-[#8D6A93]/30"
          >
            <h2 className="text-2xl font-bold text-[#1F3924] mb-3">{title}</h2>
            <p className="text-[#1F3924]/80 mb-6 leading-relaxed">{message}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onConfirm(false)}
                className={`px-4 py-2 rounded-lg text-white font-medium shadow transition ${
                  type === "CONCLUIDO"
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirmar
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onConfirm(true)}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow transition"
              >
                Confirmar e WhatsApp
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1F3924] font-medium shadow-sm transition"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
