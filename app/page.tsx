import Image from "next/image";
import Link from "next/link";
import EventPromo from "./components/EventPromo";
import { Testimonial } from "@/app/types/Testimonial";
import TestimonialSlider from "./components/TestimonialSlider";
import BalsamoVideoPlayer from "./components/BalsamoVideoPlayer";
import FeedbackSection from "./components/FeedbackSection";
//import { useState } from "react";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  details?: string[];
};

export default async function HomePage() {
  let services: Service[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
      cache: "no-store",
    });

    if (res.ok) {
      services = await res.json();
    }
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  }

  let testimonials: Testimonial[] = [];

  try {
    const resTestimonials = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`,
      { cache: "no-store" }
    );

    if (resTestimonials.ok) {
      testimonials = await resTestimonials.json();
    }
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
  }


  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-b from-[#F5F3EB] to-[#D6A77A]/20">

        {/* Saudação */}
        <section className="grid md:grid-cols-2 gap-10 items-center py-20">
          <div className="text-center md:text-left space-y-4">
            <Image
              src="/logo-balsamo.png"
              alt="Logo Bálsamo Massoterapia"
              width={110}
              height={110}
              className="mx-auto md:mx-0"
            />
            <h1 className="font-[var(--font-ooohbaby)] text-3xl sm:text-4xl text-[#8D6A93]">
              Bem-vindo à Bálsamo Massoterapia 🌿
            </h1>
            <p className="text-[#1F3924] leading-relaxed text-base sm:text-lg">
              Cuidamos do seu corpo e da sua mente com técnicas terapêuticas
              que promovem relaxamento, saúde e bem-estar.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/proprietaria.jpg"
              alt="Proprietária Bálsamo Massoterapia"
              width={260}
              height={260}
              className="
                rounded-2xl
                shadow-lg
                border-4 border-[#8D6A93]/40
                object-cover
                transition-all duration-500
                hover:scale-[1.02]
              "
            />
          </div>
        </section>

        {/* Apresentação dos Vídeos */}
        <section className="max-w-6xl mx-auto py-20 px-4">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Conheça Mais Sobre Nossos Cuidados 🌿
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

            {/* Vídeo */}
            <div className="flex justify-center">
              <div
                className="
                  relative
                  rounded-3xl
                  overflow-hidden
                  shadow-[0_12px_40px_-10px_rgba(141,106,147,0.35)]
                  border border-[#8D6A93]/30
                  bg-gradient-to-br from-[#F5F3EB]/60 to-[#D6A77A]/20
                  p-[3px]
                  backdrop-blur-sm
                  transition-transform
                  duration-700
                  hover:scale-[1.015]
                "
              >
                <BalsamoVideoPlayer />
              </div>
            </div>

            {/* Texto */}
            <div
              className="
                bg-[#F5F3EB]/90
                rounded-2xl
                p-6 md:p-8
                shadow-[0_8px_28px_-10px_rgba(141,106,147,0.25)]
                border border-[#8D6A93]/20
                leading-relaxed
                animate-[fadeInUp_0.7s_ease-out]
              "
            >
              <h3 className="text-2xl font-semibold text-[#1F3924] mb-4">
                Qualidade, cuidado e carinho em cada atendimento 🌿
              </h3>

              <p className="text-[#1F3924]/90 text-base md:text-lg mb-4">
                Na Bálsamo Massoterapia, cada sessão é pensada para acolher,
                relaxar e trazer equilíbrio ao corpo e à mente.
              </p>

              <p className="text-[#1F3924]/90 text-base md:text-lg">
                Técnicas aplicadas com sensibilidade, ambiente tranquilo e um cuidado
                genuíno para transformar o seu dia.
              </p>

              <a
                href="/book"
                className="
                  inline-block
                  bg-[#8A4B2E]
                  text-[#F5F3EB]
                  px-6 py-3
                  rounded-lg
                  shadow-md
                  hover:bg-[#1F3924]
                  transition-colors
                  font-medium
                  mt-6
                "
              >
                📅 Agendar uma sessão
              </a>
            </div>

          </div>
        </section>

        {/* Mensagem Instagram */}
        <div className="text-center text-[#1F3924]/80 mt-4 mb-20">
          <p className="text-base md:text-lg font-medium">
            Acompanhe nossos serviços também no Instagram ✨
          </p>

          <a
            href="https://www.instagram.com/balsamo_massoterapia"
            target="_blank"
            className="
              inline-flex items-center gap-2
              text-[#8A4B2E] font-semibold
              hover:text-[#1F3924]
              transition-colors
              mt-2
            "
          >
            📸 <span>@balsamo_massoterapia</span>
          </a>
        </div>

        {/* Seção de depoimentos */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            O que nossos clientes dizem 🌟
          </h2>

          {testimonials.length === 0 ? (
            <p className="text-center text-[#1F3924]/60">
              Ainda não há depoimentos cadastrados.
            </p>
          ) : (
            <TestimonialSlider testimonials={testimonials} />
          )}
        </section>

        {/* Aqui abaixo, sozinho */}
        <FeedbackSection testimonials={testimonials} />

        {/* Benefícios da Massoterapia */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Benefícios da Massoterapia 🌿
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

            {/* Benefício 1 - Relaxamento profundo */}
            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                <Image 
                  src="/img1.png"
                  alt="Relaxamento profundo"
                  width={300}
                  height={200}
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1F3924] mb-2">
                Relaxamento profundo
              </h3>
              <p className="text-[#1F3924]/80 text-sm">
                Reduz o estresse, acalma o corpo e melhora a qualidade do sono.
              </p>
            </div>

            {/* Benefício 2 - Equilíbrio mental */}
            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                <Image 
                  src="/img2.png"
                  alt="Equilíbrio mental"
                  width={300}
                  height={200}
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1F3924] mb-2">
                Equilíbrio mental
              </h3>
              <p className="text-[#1F3924]/80 text-sm">
                Ajuda na ansiedade, foco e sensação de bem-estar emocional.
              </p>
            </div>

            {/* Benefício 3 - Saúde do corpo */}
            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                <Image 
                  src="/img3.png"
                  alt="Saúde do corpo"
                  width={300}
                  height={200}
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1F3924] mb-2">
                Saúde do corpo
              </h3>
              <p className="text-[#1F3924]/80 text-sm">
                Melhora circulação, alivia dores e libera tensões acumuladas.
              </p>
            </div>

          </div>
        </section>

        {/* Serviços */}
        <section className="py-16">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-10">
            Nossos Serviços 🌿
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-[#1F3924]/70">
              Nenhum serviço cadastrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="
                    bg-white rounded-2xl shadow-md
                    border border-[#8D6A93]/30 p-6
                    hover:shadow-lg transition-shadow h-full
                  "
                >
                  <h3 className="text-xl font-semibold text-[#1F3924] mb-2">
                    {service.name}
                  </h3>

                  <p className="text-[#8A4B2E] font-medium">
                    💰 R$ {service.price.toFixed(2)} — ⏱ {service.durationMin} min
                  </p>

                  {service.details &&
                    Array.isArray(service.details) &&
                    service.details.length > 0 && (
                      <ul className="list-disc list-inside mt-3 text-sm text-[#1F3924] space-y-1">
                        {service.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/book"
              className="
                inline-block bg-[#8A4B2E] text-[#F5F3EB]
                px-8 py-4 rounded-lg shadow
                hover:bg-[#1F3924] transition-colors
                text-lg font-medium
              "
            >
              📅 Agendar Agora
            </Link>
          </div>
        </section>

        {/* Promoções e eventos */}
        <EventPromo />

        {/* Sobre a Profissional */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Sobre a Profissional 🌿
          </h2>

          <div
            className="
              grid grid-cols-1 md:grid-cols-3 gap-12 items-start
              animate-[fadeInUp_0.9s_ease-out]
            "
          >
            {/* Foto menor estilo biografia */}
            <div className="flex justify-center md:justify-start">
              <div
                className="
                  rounded-2xl overflow-hidden
                  shadow-[0_8px_28px_-10px_rgba(141,106,147,0.25)]
                  border border-[#8D6A93]/20
                  bg-[#F5F3EB]/70
                  w-[190px] h-[260px]
                "
              >
                <Image
                  src="/proprietaria2.jpg"
                  alt="Profissional da Bálsamo Massoterapia"
                  width={190}
                  height={260}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Texto da biografia */}
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1F3924] mb-4">
                Maria da Penha — Massoterapeuta Especialista
              </h3>

              <p className="text-[#1F3924]/90 leading-relaxed text-base md:text-lg mb-4">
                Com uma trajetória construída com dedicação e amor pelo cuidado, Maria da Penha 
                atua na área da massoterapia oferecendo acolhimento, técnica e sensibilidade em cada sessão.
              </p>

              <ul className="space-y-3 text-[#1F3924]/90 text-base md:text-lg mb-6">
                <li>🌱 <strong>Formação em Massoterapia</strong>, com foco em práticas terapêuticas e relaxantes.</li>
                <li>💆‍♀️ Especialização em <strong>Pedras Quentes, Quick Massage e Massagem Relaxante</strong>.</li>
                <li>🌿 Experiência em atendimento humanizado e abordagem integrada corpo–mente.</li>
                <li>✨ Propósito voltado ao bem-estar, equilíbrio emocional e qualidade de vida.</li>
              </ul>

              <p className="text-[#1F3924]/80 leading-relaxed text-base md:text-lg">
                Na Bálsamo Massoterapia, cada toque é guiado pela empatia, pela presença e pelo compromisso 
                de transformar o dia de cada cliente, trazendo mais leveza e bem-estar.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-3xl font-bold text-[#1F3924] mb-6">
            Pronto para cuidar de você hoje? 🌿
          </h2>
          <p className="text-[#1F3924]/80 text-lg mb-8">
            A Bálsamo Massoterapia está preparada para oferecer uma experiência acolhedora,
            relaxante e transformadora. Reserve seu momento de bem-estar agora mesmo.
          </p>
          <Link
            href="/book"
            className="
              inline-block bg-[#8A4B2E] text-[#F5F3EB]
              px-10 py-4 rounded-xl shadow-lg
              hover:bg-[#1F3924] transition-all
              text-lg font-medium
            "
          >
            📅 Agendar minha sessão
          </Link>
        </section>

      </main>
    </>
  );
}