"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, Calendar, Sparkles, X } from "lucide-react";

type SuccessCardProps = {
  show: boolean;
  onClose: () => void;
  name: string;
  date: string;
  service: string;
  phone?: string;
};

export default function SuccessCard({
  show,
  onClose,
  name,
  date,
  service,
}: SuccessCardProps) {
  const balsamoPhone = "5524992640951";

  const whatsappLink = `https://wa.me/${balsamoPhone}?text=${encodeURIComponent(
    `Olá! 🌿 Fiz um agendamento no site da Bálsamo Massoterapia.\n\n🧘‍♀️ Nome: ${name}\n🗓 Data: ${date}\n💆 Serviço: ${service}\n\nGostaria de confirmar o atendimento.`
  )}`;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          {/* Overlay com desfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1F3924]/40 backdrop-blur-md"
          />

          {/* Card de Sucesso */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#FFFEF9] rounded-[2.5rem] shadow-2xl p-8 md:p-10 max-w-md w-full text-center border border-[#8D6A93]/10 overflow-hidden"
          >
            {/* Elemento Decorativo */}
            <div className="absolute top-0 right-0 p-6 text-[#8D6A93]/5 pointer-events-none">
              <Sparkles size={80} />
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#1F3924]/20 hover:text-[#1F3924] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Ícone de Sucesso Animado */}
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={40} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#1F3924] mb-2 tracking-tight">
              Tudo pronto, {name.split(" ")[0]}!
            </h2>
            <p className="text-[#1F3924]/60 text-sm mb-8 font-medium">
              Seu momento de relaxamento está reservado.
            </p>

            {/* Voucher do Agendamento */}
            <div className="bg-[#F5F3EB] rounded-3xl p-6 mb-8 border border-[#D6A77A]/20 relative">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8D6A93]">Tratamento Selecionado</span>
                <p className="text-lg font-bold text-[#1F3924]">{service}</p>
                <div className="flex items-center gap-2 mt-2 text-[#1F3924]/70 font-semibold bg-white/50 px-4 py-1.5 rounded-full text-sm shadow-sm border border-white">
                  <Calendar size={14} className="text-[#8D6A93]" />
                  {date}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-3
                  bg-[#25D366] text-white
                  w-full py-4 rounded-2xl
                  font-bold text-sm uppercase tracking-widest
                  shadow-xl shadow-green-200
                  hover:bg-[#20bd5a] hover:scale-[1.02]
                  active:scale-95 transition-all
                "
              >
                <MessageCircle size={18} />
                Confirmar no WhatsApp
              </a>

              <button
                onClick={onClose}
                className="
                  w-full py-3 rounded-2xl
                  text-[#1F3924]/60 font-bold text-xs uppercase tracking-widest
                  hover:text-[#1F3924] hover:bg-gray-100
                  transition-all
                "
              >
                Agora não, obrigado
              </button>
            </div>
            
            <p className="mt-8 text-[9px] text-[#1F3924]/30 font-bold uppercase tracking-[0.3em]">
              Bálsamo Massoterapia • Bem-estar Real
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}