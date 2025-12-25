"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // ⛔ Não exibe no admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const phone = "5524992640951";
  const message = encodeURIComponent(
    "🌿 Olá! Gostaria de saber mais sobre os atendimentos da Bálsamo Massoterapia. 💆‍♀️✨"
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Bálsamo no WhatsApp"
      className="
        fixed
        bottom-6 right-6
        sm:bottom-8 sm:right-8
        z-50
        flex items-center justify-center
        bg-green-600
        text-white
        p-4
        rounded-full
        shadow-md
        hover:bg-green-700
        hover:shadow-lg
        hover:scale-105
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
        focus:ring-offset-2
        transition
      "
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
