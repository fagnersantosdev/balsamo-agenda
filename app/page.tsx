import Image from "next/image";
import Link from "next/link";
import EventPromo from "./components/EventPromo";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  details?: string[];
};

type Testimonial = {
  id: number;
  author: string;
  message: string;
  createdAt: string;
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
        <section className="max-w-6xl mx-auto py-16 px-4">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Conheça Mais Sobre Nossos Cuidados 🌿
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Vídeo */}
            <div className="flex justify-center">
              <div
                className="
                  relative
                  rounded-3xl
                  overflow-hidden
                  shadow-[0_12px_40px_-10px_rgba(141,106,147,0.35)]
                  border border-[#8D6A93]/20
                  bg-gradient-to-br from-[#F5F3EB]/60 to-[#D6A77A]/20
                  p-[2px]
                "
              >
                <video
                  id="balsamo-video-player"
                  className="
                    w-full
                    sm:max-w-[300px]
                    md:max-w-[280px]
                    lg:max-w-[300px]
                    xl:max-w-[320px]
                    rounded-3xl
                    shadow-[0_8px_25px_-5px_rgba(141,106,147,0.35)]
                    border border-[#8D6A93]/30
                    opacity-100
                    transition-opacity duration-700
                  "
                  autoPlay
                  muted
                  playsInline
                >
                  <source src="/video1.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Script do vídeo (troca suave) */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function () {
                      if (typeof window === "undefined") return;

                      const video = document.getElementById("balsamo-video-player");
                      if (!video) return;

                      const sources = ["/video1.mp4", "/video2.mp4"];
                      let index = 0;

                      const cache = sources.map(src => {
                        const v = document.createElement("video");
                        v.src = src;
                        v.preload = "auto";
                        return v;
                      });

                      function fadeToNext() {
                        video.style.opacity = "0";

                        setTimeout(() => {
                          index = (index + 1) % sources.length;

                          video.src = cache[index].src;
                          video.load();

                          video.addEventListener("canplay", function handler() {
                            video.removeEventListener("canplay", handler);
                            video.play();
                            video.style.opacity = "1";
                          });
                        }, 400);
                      }

                      video.addEventListener("ended", fadeToNext);
                    })();
                  `,
                }}
              ></script>
            </div>

            {/* Texto ao lado do vídeo */}
            <div
              className="
                relative
                rounded-2xl
                bg-[#F5F3EB]/90
                p-6 md:p-8
                shadow-[0_8px_28px_-10px_rgba(141,106,147,0.25)]
                border border-[#8D6A93]/20
                animate-[fadeInUp_0.8s_ease-out]
              "
            >
              <div className="absolute -top-4 -right-4 opacity-10 text-[#1F3924] text-5xl select-none">
                🍃
              </div>

              <h3 className="text-2xl font-semibold text-[#1F3924] mb-4">
                Qualidade, cuidado e carinho em cada atendimento 🌿
              </h3>

              <p className="text-[#1F3924]/90 leading-relaxed text-base md:text-lg mb-4">
                Na Bálsamo Massoterapia, cada sessão é pensada para acolher,
                relaxar e trazer equilíbrio ao corpo e à mente. Com técnicas
                aplicadas com sensibilidade e atenção, oferecemos um ambiente
                tranquilo, seguro e humanizado.
              </p>

              <p className="text-[#1F3924]/90 leading-relaxed text-base md:text-lg">
                Aqui, você é cuidado com respeito, delicadeza e presença —
                porque seu bem-estar é prioridade.
              </p>

              <a
                href="/book"
                className="
                  inline-block
                  bg-[#8A4B2E]
                  text-[#F5F3EB]
                  px-6 py-3
                  rounded-lg
                  shadow
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

        {/* Seção de Depoimentos */}
        <section className="max-w-6xl mx-auto px-4 py-16 overflow-hidden">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            O que nossos clientes dizem 🌟
          </h2>

          {testimonials.length === 0 ? (
            <p className="text-center text-[#1F3924]/60">Ainda não há depoimentos.</p>
          ) : (
            <div className="relative">
              
              {/* Faixa deslizante */}
              <div
                id="testimonial-track"
                className="flex transition-transform duration-700 ease-out"
                style={{ width: `${testimonials.length * 100}%` }}
              >
                {testimonials.map((t: Testimonial, i) => (
                  <div
                    key={t.id}
                    className="
                      p-3 flex-shrink-0
                      w-full
                      sm:w-1/2
                      md:w-1/3
                    "
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
          )}

          {/* Script do slider */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  const track = document.getElementById("testimonial-track");
                  if (!track) return;

                  const total = ${testimonials.length};
                  let index = 0;

                  function slide() {
                    index = (index + 1) % total;

                    // Largura por card depende da tela
                    const w = track.children[0].clientWidth;

                    track.style.transform = "translateX(-" + index * w + "px)";
                  }

                  setInterval(slide, 5000);
                })();
              `,
            }}
          />
        </section>

        {/* Benefícios da Massoterapia */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Benefícios da Massoterapia 🌿
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="text-4xl mb-3">💆‍♀️</div>
              <h3 className="text-lg font-semibold text-[#1F3924] mb-2">
                Relaxamento profundo
              </h3>
              <p className="text-[#1F3924]/80 text-sm">
                Reduz o estresse, acalma o corpo e melhora a qualidade do sono.
              </p>
            </div>

            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="text-4xl mb-3">🧘‍♂️</div>
              <h3 className="text-lg font-semibold text-[#1F3924] mb-2">
                Equilíbrio mental
              </h3>
              <p className="text-[#1F3924]/80 text-sm">
                Ajuda na ansiedade, foco e sensação de bem-estar emocional.
              </p>
            </div>

            <div className="bg-[#F5F3EB]/90 rounded-2xl p-6 shadow-md border border-[#8D6A93]/20 text-center">
              <div className="text-4xl mb-3">🌿</div>
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

        {/* Sobre a Profissional */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-12">
            Sobre a Profissional 🌿
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

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

      {/* Promoções e eventos */}
      <EventPromo />
    </>
  );
}