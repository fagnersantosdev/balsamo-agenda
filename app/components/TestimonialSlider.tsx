"use client";

import { Testimonial } from "@/app/types/Testimonial";
import React from "react";

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: Props) {
  // ✅ Triplicamos a lista para garantir que o carrossel nunca fique vazio durante o loop
  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials];

  function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Há 1 dia";
    if (diffDays < 7) return `Há ${diffDays} dias`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "Há 1 semana";
    if (diffWeeks < 4) return `Há ${diffWeeks} semanas`;

    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths <= 1 ? "Há 1 mês" : `Há ${diffMonths} meses`;
  }

  return (
    <div className="relative overflow-hidden select-none py-4">
      {/* 🟢 Máscaras de Gradiente - Reduzidas no mobile para não cobrir o texto */}
      <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#FFFEF9] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[#FFFEF9] to-transparent z-10" />

      {/* Faixa que se move continuamente */}
      <div className="flex gap-4 sm:gap-6 animate-scroll-infinite hover:pause-on-hover w-max px-10">
        {tripleTestimonials.map((t, index) => (
          <div
            key={`${t.id}-${index}`}
            className="
              flex-shrink-0 
              w-[75vw]           /* 📱 Ocupa 75% da largura da tela no mobile */
              sm:w-[350px]       /* 💻 Largura fixa no desktop */
            "
          >
            <div className="
              bg-[#F5F3EB]/95 
              rounded-2xl 
              h-full 
              p-6 
              border border-[#8D6A93]/20 
              shadow-sm 
              transition-transform 
              duration-500 
              hover:scale-[1.02]
              mx-1               /* Pequena margem para a borda não colar no card vizinho */
            ">
              <p className="text-[#1F3924]/90 italic mb-5 leading-relaxed text-sm sm:text-base">
                &ldquo;{t.message}&rdquo;
              </p>
              <div>
                <p className="text-[#8D6A93] font-bold text-sm">
                  — {t.author || "Anônimo"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#1F3924]/40 mt-1">
                  {formatRelativeDate(t.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}