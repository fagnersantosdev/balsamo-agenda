"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // ⛔ Não exibe no admin ou login para manter o foco total na gestão
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const phone = "5524992640951";
  const message = encodeURIComponent(
    "🌿 Olá! Gostaria de saber mais sobre os atendimentos da Bálsamo Massoterapia. 💆‍♀️✨"
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      // Ajustado: bottom-6 para mobile e bottom-8 para desktop
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100]"
    >
      {/* Efeito de Ondas (Pulse) */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Bálsamo no WhatsApp"
        className="
          relative
          flex items-center justify-center
          bg-[#25D366]
          text-white
          w-14 h-14 sm:w-16 sm:h-16
          rounded-full
          shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)]
          hover:bg-[#20bd5a]
          hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.5)]
          transition-all duration-300
          group
        "
      >
        <MessageCircle 
          className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300" 
        />
        
        {/* Tooltip (Desktop Only) */}
        <span className="absolute right-20 bg-white text-[#1F3924] text-xs font-bold px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap border border-gray-100 hidden sm:block">
          Dúvidas? Fale conosco 🌿
        </span>
      </a>
    </motion.div>
  );
}