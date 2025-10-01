import Image from "next/image";
import Link from "next/link";

const services = [
  {
    name: "Spa Detox PREMIUM",
    price: 150,
    duration: "1:30H",
    details: [
      "💧 Desintoxicação Iônica no SPADETOX",
      "💆‍♀️ Massagen Drenante Corporal",
      "💺 Assento Massageador",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Spa Detox",
    price: 100,
    duration: "45min",
    details: [
      "💧 Desintoxicação Iônica no SPADETOX",
      "🦶 Foot Relax: massagem drenante nos pés e pernas",
      "💺 Assento Massageador",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Terapia Makawee",
    price: 110,
    duration: "45min",
    details: [
      "🔥 Massagem Geotermal com Pedras Quentes",
      "🌿 Óleo Vegetais e Óleos Essenciais",
      "🔥 Manta térmica/ vibratória",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Massagem Terapêutica com Ventosa",
    price: 110,
    duration: "45min",
    details: [
      "❄️ 🔥 Massageador ZEN com função térmica (quente ou frio)",
      "🔥 Manta térmica/vibratória",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Massagem Drenante",
    price: 110,
    duration: "45min",
    details: [
      "❄️ 🔥 Massageador ZEN com função térmica (quente ou frio)",
      "💆‍♀️ Massagem Corporal",
      "Creme com  ativos drenates",
      "🔥 Manta térmica",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Escalda Pés Premium",
    price: 100,
    duration: "45min",
    details: [
      "✨ Ofurô com esfoliação",
      "🌿 Imersão com óleos essenciais",
      "🦶 Foot Relax: massagem drenante nos pés e pernas",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Massagem Relaxante",
    price: 90,
    duration: "45min",
    details: [
      "💆 Massagem corporal completa",
      "🔔 Pistola massageadora",
      "🔥 Manta térmica/vibratória",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Escalda Pés",
    price: 80,
    duration: "30min",
    details: [
      "✨ Ofurô com esfoliação",
      "🌿 Imersão com óleos essenciais",
      "🦶 Massagem drenante nos pés e pernas",
      "🌸 Aromaterapia",
    ],
  },
  {
    name: "Quick Massage",
    price: 50,
    duration: "25min",
    details: [
      "✨ Massagem express",
      "💺 Cadeira ergonômica",
      "💆 Alívio de tensão muscular imediato",
    ],
  },
  
];

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-[#F5F3EB] to-[#D6A77A]/20">
      {/* Saudação */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-16">
        {/* Texto e logo */}
        <div className="text-center md:text-left space-y-4">
          <Image
            src="/logo-balsamo.png"
            alt="Logo Bálsamo Massoterapia"
            width={110}
            height={110}
            className="mx-auto md:mx-0"
          />
          {/* <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3924]">
            Bem-vindo(a) à Bálsamo Massoterapia 🌿
          </h1> */}
          <h1 className="font-[var(--font-ooohbaby)] text-3xl sm:text-4xl text-[#8D6A93]">
            Bem-vindo à Bálsamo Massoterapia 🌿
          </h1>

          <p className="text-[#1F3924]/80 leading-relaxed text-base sm:text-lg">
            Cuidamos do seu corpo e da sua mente com técnicas terapêuticas que
            promovem relaxamento, saúde e bem-estar.
          </p>
        </div>

        {/* Imagem da proprietária */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.name}
              className="bg-white rounded-2xl shadow-md border border-[#8D6A93]/30 p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-[#1F3924] mb-2">
                {service.name}
              </h3>
              <p className="text-[#8A4B2E] font-medium">
                💰 R$ {service.price.toFixed(2)} — ⏱ {service.duration}
              </p>
              <ul className="list-disc list-inside mt-3 text-sm text-[#1F3924]/80 space-y-1">
                {service.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
  );
}
