"use client";
import React from "react";

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
  //phone,
}: SuccessCardProps) {
  if (!show) return null;

  const balsamoPhone = "5524992640951"; // DDD + número sem espaços ou símbolos

  // Gera o link do WhatsApp se o número estiver disponível
    const whatsappLink = `https://wa.me/${balsamoPhone}?text=${encodeURIComponent(
        `Olá! 🌿 Fiz um agendamento no site da Bálsamo Massoterapia.\n\n🧘‍♀️ Nome: ${name}\n🗓 Data: ${date}\n💆 Serviço: ${service}\n\nGostaria de confirmar o atendimento.`
      )}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="
        bg-white
        rounded-xl
        shadow-lg
        p-6
        max-w-md
        w-full
        text-center
        border border-[#8D6A93]/20
        animate-scaleIn
      ">
        <h2 className="text-2xl font-bold text-[#1F3924] mb-3">
          🌿 Agendamento Confirmado!
        </h2>

        <p className="text-[#1F3924] mb-5 leading-relaxed">
          <strong>{name}</strong>, seu atendimento foi agendado com sucesso para:
        </p>

        <div className="
          bg-[#F5F3EB]/90
          border border-[#D6A77A]/30
          rounded-xl
          p-4
          mb-5
        ">
          <p className="text-[#1F3924] font-medium">{service}</p>
          <p className="text-sm text-[#8D6A93] mt-1">{date}</p>
        </div>

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              bg-green-600
              text-white
              px-5
              py-3
              rounded-xl
              shadow-sm
              hover:bg-green-700
              hover:shadow-md
              transition
              w-full
            "
          >
          💬 Enviar confirmação a Bálsamo no WhatsApp
        </a>
        )}
        <button
          onClick={onClose}
          className="mt-4 block w-full rounded-xl border border-[#8D6A93] py-2 hover:bg-[#8D6A93]/10 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
