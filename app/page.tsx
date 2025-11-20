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


export default async function HomePage() {
  let services: Service[] = [];

  try {
    
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
    cache: "no-store", // ✅ sempre pega os dados mais recentes
  });


    if (res.ok) {
      services = await res.json();
    }
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-[#F5F3EB] to-[#D6A77A]/20">
        {/* Saudação */}
        <section className="grid md:grid-cols-2 gap-10 items-center mb-16">
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
              Cuidamos do seu corpo e da sua mente com técnicas terapêuticas que
              promovem relaxamento, saúde e bem-estar.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/proprietaria.jpg"
              alt="Proprietária Bálsamo Massoterapia"
              width={260}
              height={260}
              className="rounded-2xl shadow-lg border-4 border-[#8D6A93]/40"
            />
          </div>
        </section>
        {/* Apresentação dos Vídeos */}
        {/* Apresentação dos Vídeos */}
<section className="max-w-6xl mx-auto mb-16 space-y-8">
  <h2 className="text-2xl font-bold text-[#1F3924] text-center">
    Conheça Mais Sobre Nossos Cuidados 🌿
  </h2>

  {/* MOBILE – vídeo mais estreito/vertical */}
  <div className="mt-4 block md:hidden">
    <div
      className="
        relative
        mx-auto
        max-w-[360px]
        rounded-3xl
        overflow-hidden
        shadow-[0_8px_25px_-5px_rgba(141,106,147,0.35)]
        border border-[#8D6A93]/30
      "
    >
      <video
        id="balsamo-video-mobile"
        className="
          w-full
          aspect-[9/16]
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
  </div>

  {/* DESKTOP/TABLET – vídeo em formato linha/banner */}
  <div className="hidden md:block">
    <div
      className="
        relative
        mx-auto
        max-w-5xl
        rounded-3xl
        overflow-hidden
        shadow-[0_12px_40px_-10px_rgba(141,106,147,0.45)]
        border border-[#8D6A93]/30
        bg-gradient-to-r from-[#F5F3EB] to-[#D6A77A]/60
        p-[2px]
      "
    >
      <div className="rounded-[22px] bg-[#F5F3EB]/95">
        <video
          id="balsamo-video-player"
          className="
            w-full
            sm:max-w-[500px]
            md:max-w-[600px]
            lg:max-w-[250px]
            xl:max-w-[280px]
            mx-auto
            rounded-3xl
            relative
            z-10
            opacity-100
            transition-opacity
            duration-700
            ease-[cubic-bezier(0.4,0.0,0.2,1)]
          "
          preload="auto"
          autoPlay
          muted
          playsInline
        >
          <source src="/video1.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>

  {/* Script para alternar video1/video2 com fade e loop em ambos */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function () {
          if (typeof window === "undefined") return;

          const sources = ["/video1.mp4", "/video2.mp4"];

          function setupPlayer(id) {
            const video = document.getElementById(id);
            if (!video) return;

            let index = 0;

            function fadeToNext() {
              video.style.opacity = "0";
              setTimeout(() => {
                index = (index + 1) % sources.length;
                video.src = sources[index];
                video.play();
                video.style.opacity = "1";
              }, 500);
            }

            video.addEventListener("ended", fadeToNext);
          }

          setupPlayer("balsamo-video-mobile");
          setupPlayer("balsamo-video-desktop");
        })();
      `,
    }}
  />
</section>

        {/* Serviços */}
        <section>
          <h2 className="text-2xl font-bold text-[#1F3924] text-center mb-10">
            Nossos Serviços
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
                  className="bg-white rounded-2xl shadow-md border border-[#8D6A93]/30 p-6 hover:shadow-lg transition-shadow"
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

          {/* Botão de agendar */}
          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-block bg-[#8A4B2E] text-[#F5F3EB] px-6 py-3 rounded-lg shadow hover:bg-[#1F3924] transition-colors text-lg font-medium"
            >
              📅 Agendar Agora
            </Link>
          </div>
        </section>
      </main>

      <EventPromo />
    </>
  );
}
