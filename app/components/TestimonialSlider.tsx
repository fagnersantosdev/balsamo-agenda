"use client";

import { useEffect, useRef, useState } from "react";

export type Testimonial = {
  id: number;
  message: string;
  author: string;
  createdAt: string;
};

type Props = {
  testimonials: Testimonial[];
  formatRelativeDate: (date: string) => string;
};

export default function TestimonialSlider({ testimonials, formatRelativeDate }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [index, setIndex] = useState(0);

  // Identifica quantos cards aparecem na tela
  function getVisibleCount() {
    if (window.innerWidth < 640) return 1;     // mobile
    if (window.innerWidth < 768) return 2;     // tablet
    return 3;                                  // desktop
  }

  // Observa tamanho dos cards
  useEffect(() => {
    const updateWidth = () => {
      if (!trackRef.current) return;
      const firstCard = trackRef.current.querySelector(".testimonial-card") as HTMLElement;
      if (firstCard) setCardWidth(firstCard.clientWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const obs = new ResizeObserver(updateWidth);
    if (trackRef.current) obs.observe(trackRef.current);

    return () => {
      window.removeEventListener("resize", updateWidth);
      obs.disconnect();
    };
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const maxIndex = testimonials.length - getVisibleCount();
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${index * cardWidth}px)`
        }}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="testimonial-card flex-shrink-0 px-4 w-full sm:w-1/2 md:w-1/3"
          >
            <div
              className="
                bg-[#F5F3EB]/90 rounded-2xl p-6 h-full
                shadow-[0_8px_25px_-5px_rgba(141,106,147,0.25)]
                border border-[#8D6A93]/20
              "
            >
              <p className="text-[#1F3924]/90 italic mb-4 leading-relaxed">
                {t.message.replace(/^\$/, "")}
              </p>

              <p className="text-[#8A4B2E] font-semibold">— {t.author}</p>

              <p className="text-sm text-[#1F3924]/50 mt-1">
                {formatRelativeDate(t.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}