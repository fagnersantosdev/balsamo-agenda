import Image from "next/image";
import Link from "next/link";
import EventPromo from "./components/EventPromo";
import BalsamoVideoPlayer from "./components/BalsamoVideoPlayer";
import FeedbackSection from "./components/FeedbackSection";
import { prisma } from "@/lib/prisma";

// 🚀 Garante que a página sempre carregue dados atualizados
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // ✅ Busca direta no banco
  const [servicesData, testimonialsData] = await Promise.all([
    prisma.service.findMany({
      orderBy: { price: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // 🔧 Formatações para evitar erros de tipagem
  const testimonials = testimonialsData.map((t) => ({
    ...t,
    author: t.author || "Anônimo",
    photoUrl: t.photoUrl || null,
    createdAt: t.createdAt.toISOString(),
  }));

  const services = servicesData.map((s) => ({
    ...s,
    price: Number(s.price),
    // Converte JsonValue para string[]
    details: Array.isArray(s.details) ? (s.details as string[]) : [], 
  }));

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-b from-[#F5F3EB] to-[#D6A77A]/20">
        
        {/* Saudação */}
        <section className="grid md:grid-cols-2 gap-10 items-center py-18">
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
              priority
            />
          </div>
        </section>

        {/* Apresentação dos Vídeos */}
        <section className="max-w-6xl mx-auto py-20 px-4">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Conheça Mais Sobre Nossos Cuidados 🌿
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Vídeo na Home */}
            <div className="flex justify-center py-4">
              <div
                className="
                  relative
                  rounded-[2.5rem] 
                  p-[2px]
                  bg-gradient-to-b from-[#8D6A93]/20 to-transparent
                  shadow-2xl
                  will-change-transform
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
                  rounded-xl
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

        {/* Feedback Section */}
        <FeedbackSection testimonials={testimonials} />

        {/* Benefícios */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Benefícios da Massoterapia 🌿
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { img: "/img1.png", title: "Relaxamento profundo", desc: "Reduz o estresse, acalma o corpo e melhora a qualidade do sono." },
              { img: "/img2.png", title: "Equilíbrio mental", desc: "Ajuda na ansiedade, foco e sensação de bem-estar emocional." },
              { img: "/img3.png", title: "Saúde do corpo", desc: "Melhora circulação, alivia dores e libera tensões acumuladas." }
            ].map((item, i) => (
              <div key={i} className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
                <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                  <Image src={item.img} alt={item.title} width={300} height={200} className="w-full h-full object-cover rounded-xl shadow-sm" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F3924] mb-2">{item.title}</h3>
                <p className="text-[#1F3924]/80 text-sm">{item.desc}</p>
              </div>
            ))}
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

                  {service.details && service.details.length > 0 && (
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
                px-8 py-4 rounded-xl shadow
                hover:bg-[#1F3924] transition-colors
                text-lg font-medium
              "
            >
              📅 Agendar Agora
            </Link>
          </div>
        </section>

        {/* Promo e Sobre */}
        <EventPromo />

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Sobre a Profissional 🌿
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start animate-[fadeInUp_0.9s_ease-out]">
            <div className="flex justify-center md:justify-start">
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_28px_-10px_rgba(141,106,147,0.25)] border border-[#8D6A93]/20 bg-[#F5F3EB]/70 w-[190px] h-[260px]">
                <Image src="/proprietaria2.jpg" alt="Profissional" width={190} height={260} className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1F3924] mb-4">Maria da Penha — Massoterapeuta Especialista</h3>
              <p className="text-[#1F3924]/90 leading-relaxed text-base md:text-lg mb-4">
                Com uma trajetória construída com dedicação e amor pelo cuidado, Maria da Penha atua na área da massoterapia oferecendo acolhimento, técnica e sensibilidade em cada sessão.
              </p>
              <ul className="space-y-3 text-[#1F3924]/90 text-base md:text-lg mb-6">
                <li>🌱 <strong>Formação em Massoterapia</strong>, com foco em práticas terapêuticas e relaxantes.</li>
                <li>💆‍♀️ Especialização em <strong>Pedras Quentes, Quick Massage e Massagem Relaxante</strong>.</li>
                <li>🌿 Experiência em atendimento humanizado e abordagem integrada corpo–mente.</li>
                <li>✨ Propósito voltado ao bem-estar, equilíbrio emocional e qualidade de vida.</li>
              </ul>
              <p className="text-[#1F3924]/80 leading-relaxed text-base md:text-lg">
                Na Bálsamo Massoterapia, cada toque é guiado pela empatia, pela presença e pelo compromisso de transformar o dia de cada cliente, trazendo mais leveza e bem-estar.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-3xl font-bold text-[#1F3924] mb-6">Pronto para cuidar de você hoje? 🌿</h2>
          <p className="text-[#1F3924]/80 text-lg mb-8">A Bálsamo Massoterapia está preparada para oferecer uma experiência acolhedora, relaxante e transformadora.</p>
          <Link href="/book" className="inline-block bg-[#8A4B2E] text-[#F5F3EB] px-10 py-4 rounded-xl shadow-lg hover:bg-[#1F3924] transition-all text-lg font-medium">📅 Agendar minha sessão</Link>
        </section>

      </main>
    </>
  );
}