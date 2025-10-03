"use client";

export default function EventPromo() {
  return (
    <section className="relative bg-[#8D6A93]/10 border border-[#D6A77A]/30 rounded-2xl p-8 my-16 shadow-md text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1F3924] mb-4">
        ✨ Transforme o seu evento em uma experiência única!
      </h2>

      <p className="text-[#1F3924]/90 max-w-3xl mx-auto leading-relaxed mb-4">
        Seja aniversário, festa infantil, 15 anos, casamento, formatura ou qualquer outra celebração especial, a{" "}
        <span className="font-semibold text-[#8D6A93]">Bálsamo Massoterapia</span> no seu evento garante momentos de
        cuidado, relaxamento e bem-estar para você e seus convidados. 💆‍♀️💆‍♂️
      </p>

      <p className="text-[#1F3924]/90 max-w-2xl mx-auto leading-relaxed mb-6">
        Surpreenda quem você ama com esse toque de carinho e torne cada detalhe ainda mais inesquecível.
      </p>

      <a
        href="https://wa.me/5524992640951?text=Olá! Gostaria de solicitar um orçamento para levar a Bálsamo Massoterapia ao meu evento."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#8D6A93] text-[#FFFEF9] font-medium px-6 py-3 rounded-lg shadow hover:bg-[#7A577F] transition-colors duration-300"
      >
        👉 Faça já o seu orçamento
      </a>
    </section>
  );
}
