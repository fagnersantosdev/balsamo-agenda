"use client";
import { Sparkles, PartyPopper, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EventPromo() {
  return (
    <section className="relative my-24 px-4 overflow-visible">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="
          relative max-w-5xl mx-auto
          bg-gradient-to-br from-[#FFFEF9] to-[#F5F3EB]
          border border-[#8D6A93]/20
          rounded-[3rem]
          p-8 md:p-16
          shadow-[0_20px_50px_-15px_rgba(141,106,147,0.15)]
          text-center
        "
      >
        {/* Detalhe Decorativo de Canto */}
        <div className="absolute top-0 right-0 p-8 opacity-10 text-[#8D6A93] pointer-events-none">
          <Sparkles size={120} strokeWidth={1} />
        </div>

        {/* Badge Flutuante */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8D6A93]/10 text-[#8D6A93] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#8D6A93]/20">
          <PartyPopper size={14} />
          <span>Bálsamo em seu Evento</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1F3924] mb-6 max-w-3xl mx-auto leading-[1.15]">
          Transforme seu evento com <span className="text-[#8D6A93]">bem-estar</span> e cuidado
        </h2>

        <p className="text-[#1F3924]/80 max-w-2xl mx-auto leading-relaxed text-base md:text-lg mb-4">
          Leve a essência da massoterapia para aniversários, casamentos, formaturas e celebrações corporativas. 
        </p>

        <p className="text-[#1F3924]/80 max-w-xl mx-auto leading-relaxed text-sm mb-12">
          Proporcione aos seus convidados uma pausa revigorante, com momentos únicos de relaxamento e carinho.
        </p>

        <div className="relative inline-block group">
          {/* Brilho suave atrás do botão */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8D6A93] to-[#D6A77A] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <a
            href="https://wa.me/5524992640951?text=Olá! Gostaria de solicitar um orçamento para levar a Bálsamo Massoterapia ao meu evento."
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative
              inline-flex items-center gap-3
              bg-[#1F3924] text-[#FFFEF9]
              px-10 py-5 rounded-2xl
              font-bold text-sm uppercase tracking-widest
              shadow-xl shadow-[#1F3924]/20
              hover:bg-[#2a4d31]
              hover:scale-[1.02]
              active:scale-95
              transition-all duration-300
            "
          >
            <MessageCircle size={20} />
            Solicitar Orçamento
          </a>
        </div>

        {/* Borda decorativa interna sutil */}
        <div className="absolute inset-4 border border-[#8D6A93]/5 rounded-[2rem] pointer-events-none" />
      </motion.div>
    </section>
  );
}