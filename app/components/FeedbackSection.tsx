"use client";

import { useState } from "react";
import { Testimonial } from "@/app/types/Testimonial";
import FeedbackModal from "./FeedbackModal";
import TestimonialSlider from "./TestimonialSlider";
import { Plus, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  testimonials: Testimonial[];
}

export default function FeedbackSection({ testimonials }: Props) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-gradient-to-b from-transparent to-[#F5F3EB]/30">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Título com Ícone e Estilo */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8D6A93]/10 text-[#8D6A93] mb-4"
          >
            <MessageSquareQuote size={24} />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3924] tracking-tight">
            O que nossos clientes dizem
          </h2>
          <div className="w-12 h-1 bg-[#D6A77A] mx-auto mt-4 rounded-full opacity-50" />
        </header>

        {/* Slider de Depoimentos */}
        <div className="relative mb-16">
          {testimonials.length === 0 ? (
            <div className="py-20 text-center bg-white/50 rounded-[2.5rem] border border-dashed border-[#8D6A93]/20">
              <p className="text-[#1F3924]/40 italic font-medium">
                Sua opinião é muito importante para nós. Seja a primeira a avaliar!
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TestimonialSlider testimonials={testimonials} />
            </motion.div>
          )}
        </div>

        {/* Chamada para Ação (CTA) */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenFeedback(true)}
            className="
              inline-flex items-center gap-3
              px-10 py-4
              bg-[#1F3924]
              text-[#FFFEF9]
              rounded-2xl
              font-bold
              text-sm
              uppercase
              tracking-[0.2em]
              shadow-xl shadow-[#1F3924]/20
              hover:bg-[#2a4d31]
              transition-all
            "
          >
            <Plus size={18} />
            Deixar minha avaliação
          </motion.button>
          
          <p className="mt-4 text-[10px] text-[#1F3924]/40 font-bold uppercase tracking-widest">
            Sua privacidade é respeitada
          </p>
        </div>

        {/* Modal de Feedback */}
        <FeedbackModal
          open={openFeedback}
          onClose={() => setOpenFeedback(false)}
        />
      </div>
    </section>
  );
}