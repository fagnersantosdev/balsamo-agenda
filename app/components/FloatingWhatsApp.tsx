"use client";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phone = "5524992640951"; // ✅ número da Bálsamo (com DDI 55)
  const message = encodeURIComponent(
    "🌿 Olá! Gostaria de saber mais sobre os atendimentos da Bálsamo Massoterapia. 💆‍♀️✨"
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 animate-pulse-slow"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
