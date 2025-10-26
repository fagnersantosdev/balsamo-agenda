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
  phone,
}: SuccessCardProps) {
  if (!show) return null;

  const balsamoPhone = "5524992640951"; // DDD + número sem espaços ou símbolos

  // Gera o link do WhatsApp se o número estiver disponível
  const whatsappLink = `https://wa.me/${balsamoPhone}?text=${encodeURIComponent(
  `Olá! 🌿 Fiz um agendamento no site da Bálsamo Massoterapia.\n\n🧘‍♀️ Nome: ${name}\n🗓 Data: ${date}\n💆 Serviço: ${service}\n\nGostaria de confirmar o atendimento.`
)}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center border border-[#8D6A93]/30">
        <h2 className="text-2xl font-bold text-[#1F3924] mb-2">
          🌿 Agendamento Confirmado!
        </h2>

        <p className="text-[#1F3924] mb-4 leading-relaxed">
          <strong>{name}</strong>, seu atendimento foi agendado com sucesso para:
        </p>

        <div className="bg-[#F5F3EB] border border-[#D6A77A]/40 rounded-lg p-4 mb-4">
          <p className="text-[#1F3924] font-medium">{service}</p>
          <p className="text-sm text-[#8D6A93]">{date}</p>
        </div>

        {whatsappLink && (
          <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          💬 Falar com a Bálsamo no WhatsApp
        </a>

        )}

        <button
          onClick={onClose}
          className="mt-4 block w-full border border-[#8D6A93] text-[#1F3924] rounded-lg py-2 hover:bg-[#8D6A93]/10 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
