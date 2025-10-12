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

// 🔄 Garante que a página será revalidada automaticamente a cada 10 minutos
export const revalidate = 600;

export default async function HomePage() {
  let services: Service[] = [];

  try {
    // Busca os serviços diretamente da API interna
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
      next: { revalidate: 600 }, // cache automático (10 min)
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
