"use client";

import { useState } from "react";
import { Testimonial } from "@/app/types/Testimonial";
import FeedbackModal from "./FeedbackModal"; // <-- ESTA LINHA É A QUE FALTAVA
// import TestimonialSlider from "./TestimonialSlider";  // Quando quiser ativar o slider

interface Props {
  testimonials: Testimonial[];
}

export default function FeedbackSection({ testimonials }: Props) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-6">
        O que nossos clientes dizem 🌟
      </h2>

      {/* Botão para abrir o modal */}
      <div className="text-center mb-10">
        <button
          onClick={() => setOpenFeedback(true)}
          className="
            px-5 py-2 bg-[#8D6A93] text-[#FFFEF9]
            rounded-lg shadow hover:bg-[#1F3924]
            transition
          "
        >
          ➕ Deixar minha avaliação
        </button>
      </div>

      {/* Slider de depoimentos */}
      {testimonials.length === 0 ? (
        <p className="text-center text-[#1F3924]/60">
          Ainda não há depoimentos cadastrados.
        </p>
      ) : (
        <div className="mt-8">
          {/* <TestimonialSlider testimonials={testimonials} /> */}
        </div>
      )}

      {/* Modal */}
      <FeedbackModal
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
      />
    </section>
  );
}