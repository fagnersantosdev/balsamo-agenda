"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, MessageCircle } from "lucide-react";

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
  
  const isConcluido = type === "CONCLUIDO";

  const title = isConcluido ? "Concluir Atendimento" : "Cancelar Agendamento";
  
  const phoneNumber = clientPhone.startsWith("55")
    ? clientPhone
    : `55${clientPhone.replace(/\D/g, "")}`;

  const whatsMessage = isConcluido
    ? `🌿 Olá ${clientName}! Seu atendimento de ${serviceName} foi concluído com sucesso. Esperamos vê-la em breve 💆‍♀️✨`
    : `💬 Olá ${clientName}! Seu agendamento de ${serviceName} para ${date} foi cancelado. Caso queira reagendar, estamos à disposição 🌿`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsMessage)}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1F3924]/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center border border-[#8D6A93]/10 relative overflow-hidden"
          >
            {/* Botão de Fechar Rápido */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Ícone Dinâmico */}
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${
              isConcluido ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {isConcluido ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
            </div>

            <h2 className="text-2xl font-bold text-[#1F3924] mb-3 tracking-tight">
              {title}
            </h2>
            
            <p className="text-[#1F3924]/60 mb-8 leading-relaxed text-sm">
              Deseja marcar o agendamento de <span className="font-bold text-[#1F3924]">{clientName}</span> ({serviceName}) como 
              <span className={`font-black px-1 ${isConcluido ? "text-emerald-600" : "text-red-600"}`}>
                {type}
              </span>?
            </p>

            <div className="flex flex-col gap-3">
              {/* Opção Principal: WhatsApp (Mais valor para o negócio) */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onConfirm(true)}
                className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] text-white font-bold shadow-lg shadow-green-200 hover:bg-[#20bd5a] transition-all active:scale-95"
              >
                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Confirmar e Notificar
              </a>

              {/* Opção Secundária: Apenas Sistema */}
              <button
                onClick={() => onConfirm(false)}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${
                  isConcluido 
                    ? "bg-[#1F3924] shadow-[#1F3924]/10 hover:bg-[#2a4d31]" 
                    : "bg-red-600 shadow-red-100 hover:bg-red-700"
                }`}
              >
                Apenas Confirmar no Sistema
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl text-[#1F3924]/40 font-bold text-sm hover:text-[#1F3924] transition-colors mt-2"
              >
                Voltar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}