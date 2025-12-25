"use client";

import { useState } from "react";
import { Testimonial } from "@/app/types/Testimonial";
import FeedbackModal from "./FeedbackModal";
import TestimonialSlider from "./TestimonialSlider";

interface Props {
  testimonials: Testimonial[];
}

export default function FeedbackSection({ testimonials }: Props) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* Título */}
      <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-10">
        O que nossos clientes dizem 🌟
      </h2>

      {/* Slider */}
      {testimonials.length === 0 ? (
        <p className="text-center text-[#1F3924]/60 mb-10">
          Ainda não há depoimentos cadastrados.
        </p>
      ) : (
        <div className="mb-12">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      )}

      {/* Botão — agora abaixo do slider */}
      <div className="text-center">
        <button
          onClick={() => setOpenFeedback(true)}
          className="
            px-6 py-3
            bg-[#8D6A93]
            text-[#FFFEF9]
            rounded-xl
            shadow-sm
            hover:bg-[#1F3924]
            hover:shadow-md
            transition-all
            font-semibold
          "
        >
          ➕ Deixar minha avaliação
      </button>
      </div>

      {/* Modal */}
      <FeedbackModal
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
      />
    </section>
  );
}