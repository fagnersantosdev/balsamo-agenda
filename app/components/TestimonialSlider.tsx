"use client";

import { useEffect, useRef } from "react";
import { Testimonial } from "@/app/types/Testimonial";

// export type Testimonial = {
//   id: number;
//   author: string;
//   message: string;
//   createdAt: string;
// };

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Função para formatar datas (agora no Client Component)
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
    if (diffMonths === 1) return "Há 1 mês";

    return `Há ${diffMonths} meses`;
  }

  // Slider automático
  useEffect(() => {
    const track = trackRef.current;
    if (!track || testimonials.length === 0) return;

    let index = 0;
    const total = testimonials.length;

    function slide() {
      if (!track) return;

      const firstCard = track.children[0] as HTMLElement | undefined;
      if (!firstCard) return;

      const width = firstCard.clientWidth;
      index = (index + 1) % total;

      track.style.transform = `translateX(-${index * width}px)`;
    }

    const interval = setInterval(slide, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <div className="relative overflow-hidden select-none">
      {/* Faixa dos cards */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-out will-change-transform"
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="
              flex-shrink-0
              w-full
              max-w-[90vw]
              sm:max-w-none
              sm:w-1/2
              md:w-1/3
              px-3
              transition-transform
              hover:-translate-y-[2px]
            "
          >
            <div
              className="
                bg-[#F5F3EB]/95
                rounded-xl
                h-full
                p-6
                border border-[#8D6A93]/20
                shadow-sm
                hover:shadow-md
                transition-all
              "
            >
              <p className="text-[#1F3924]/90 italic mb-5 leading-relaxed">
                {t.message}
              </p>

              <p className="text-[#8A4B2E] font-semibold text-sm">
                — {t.author || "Anônimo"}
              </p>


              <p className="text-sm text-[#1F3924]/45 mt-1">
                {formatRelativeDate(t.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}