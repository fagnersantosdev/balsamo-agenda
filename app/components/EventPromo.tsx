"use client";

export default function EventPromo() {
  return (
    <section
      className="
        relative
        bg-gradient-to-br from-[#F5F3EB]/70 to-[#D6A77A]/15
        border border-[#8D6A93]/25
        rounded-3xl
        p-10 md:p-12
        my-20
        shadow-[0_10px_35px_-10px_rgba(141,106,147,0.25)]
        text-center
        animate-[fadeInUp_0.8s_ease-out]
      "
    >

      {/* Elemento decorativo suave */}
      <div className="absolute -top-3 -right-3 text-[#8D6A93] opacity-10 text-6xl select-none">
        🌿
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-[#1F3924] mb-4">
        ✨ Transforme seu evento com bem-estar e cuidado
      </h2>

      <p className="text-[#1F3924]/90 max-w-3xl mx-auto leading-relaxed mb-4">
        Leve a <span className="font-semibold text-[#8D6A93]">Bálsamo Massoterapia</span> para o seu evento —
        aniversários, casamentos, festas infantis, 15 anos, formaturas e muito mais.
      </p>

      <p className="text-[#1F3924]/80 max-w-2xl mx-auto leading-relaxed mb-6">
        Proporcione aos seus convidados um momento único de relaxamento, carinho e tranquilidade.
      </p>

      <a
        href="https://wa.me/5524992640951?text=Olá! Gostaria de solicitar um orçamento para levar a Bálsamo Massoterapia ao meu evento."
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-2
          bg-[#8D6A93] text-[#FFFEF9]
          px-8 py-3 rounded-xl
          shadow-md hover:shadow-lg
          hover:bg-[#7A577F]
          hover:scale-[1.03]
          active:scale-[0.97]
          transition-all duration-300
          font-medium
        "
      >
        👉 Solicitar Orçamento
      </a>
    </section>
  );
}