"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MessageCircle } from "lucide-react";

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
  phone,
}: SuccessCardProps) {
  const message = encodeURIComponent(
    `🌿 Olá, ${name}! Seu agendamento na *Bálsamo Massoterapia* foi confirmado com sucesso. 💆‍♀️✨

📅 *Data:* ${date}
💆‍♀️ *Serviço:* ${service}

Aguardamos você! 🌸`
  );

  const whatsappLink = `https://wa.me/${
    phone?.startsWith("55") ? phone : `55${phone || ""}`
  }?text=${message}`;

  // 🔒 Chama o WhatsApp somente com clique direto do usuário
  function handleOpenWhatsApp() {
    window.open(whatsappLink, "_blank");
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center border border-green-100"
          >
            <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4 animate-pulse" />

            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              Agendamento Confirmado!
            </h2>

            <p className="text-gray-700 text-sm mb-1">
              <strong>Cliente:</strong> {name}
            </p>
            <p className="text-gray-700 text-sm mb-1">
              <strong>Serviço:</strong> {service}
            </p>
            <p className="text-gray-700 text-sm mb-4">
              <strong>Data:</strong> {date}
            </p>

            {/* ✅ Botão com evento direto (não bloqueado) */}
            <button
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 w-full mb-3"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar Confirmação no WhatsApp
            </button>

            <button
              onClick={onClose}
              className="text-sm text-gray-600 underline hover:text-gray-800 transition"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
