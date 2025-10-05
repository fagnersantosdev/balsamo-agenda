"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function SuccessCard({
  show,
  onClose,
  name,
  date,
  service,
}: {
  show: boolean;
  onClose: () => void;
  name: string;
  date: string;
  service: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4 border border-green-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Agendamento Confirmado!
            </h2>
            <p className="text-green-900 mb-1">
              <strong>{name}</strong>, seu horário foi reservado.
            </p>
            <p className="text-green-700 text-sm">
              <strong>Data:</strong> {date}
              <br />
              <strong>Serviço:</strong> {service}
            </p>

            <button
              onClick={onClose}
              className="mt-6 bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
