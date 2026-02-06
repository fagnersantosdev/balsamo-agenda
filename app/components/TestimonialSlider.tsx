"use client";

import { Testimonial } from "@/app/types/Testimonial";
import React from "react";
import { Quote } from "lucide-react";

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: Props) {
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
    <div className="relative w-full overflow-hidden">
      {/* Gradientes Laterais (Máscara) - Visíveis apenas no Desktop para evitar cortes no Mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-32 bg-gradient-to-r from-[#F5F3EB] to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-32 bg-gradient-to-l from-[#F5F3EB] to-transparent lg:block" />

      {/* Faixa que se move continuamente */}
      <div className="flex gap-6 animate-scroll-infinite hover:pause-on-hover w-max px-6 sm:px-12 py-4">
        {tripleTestimonials.map((t, index) => (
          <div
            key={`${t.id}-${index}`}
            className="flex-shrink-0 w-[85vw] sm:w-[380px]"
          >
            <div className="
              relative bg-white/80 backdrop-blur-sm
              rounded-[2rem] h-full p-8 
              border border-[#8D6A93]/10 
              shadow-xl shadow-[#8D6A93]/5 
              transition-all duration-500 
              hover:scale-[1.02] hover:bg-white
              flex flex-col justify-between
            ">
              {/* Ícone Decorativo de Aspas */}
              <div className="absolute top-6 right-8 text-[#8D6A93]/10">
                <Quote size={40} fill="currentColor" />
              </div>

              <p className="text-[#1F3924] font-medium italic mb-8 leading-relaxed text-sm sm:text-base relative z-10">
                &ldquo;{t.message}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8D6A93]/10 flex items-center justify-center text-[#8D6A93] font-bold text-xs">
                  {(t.author || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[#1F3924] font-black text-xs uppercase tracking-widest">
                    {t.author || "Anônimo"}
                  </p>
                  <p className="text-[10px] font-bold text-[#8D6A93]/60 mt-0.5 uppercase tracking-tighter">
                    {formatRelativeDate(t.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}