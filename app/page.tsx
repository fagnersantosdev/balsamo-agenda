import Image from "next/image";
import Link from "next/link";

const services = [
  {
    name: "Spa Detox PREMIUN",
    price: 150,
    duration: "1:30H",
    details: [
      "Desintoxicação Iônica no SPADETOX",
      "Massagen Drenante Corporal",
      "Assento Massageador",
      "Aromaterapia",
    ],
  },
  {
    name: "Spa Detox",
    price: 100,
    duration: "45min",
    details: [
      "Desintoxicação Iônica no SPADETOX",
      "Foot Relax",
      "Assento Massageador",
      "Aromaterapia",
    ],
  },
  {
    name: "Terapia makawee",
    price: 110,
    duration: "45min",
    details: [
      "Massagem Geotermal ccom Pedras Quentes",
      "Óleo Vegetais e Óleos Essenciais",
      "Manta Térmica / vibratória",
      "Aromaterapia",
    ],
  },
  {
    name: "Massagem Terapêutica com Ventosa",
    price: 110,
    duration: "45min",
    details: [
      "Massageador ZEN com função térmica (quente ou frio)",
      "Manta Térmica / vibratória",
      "Aromaterapia",
    ],
  },
  {
    name: "Massagem Drenante",
    price: 110,
    duration: "45min",
    details: [
      "Massageador ZEN com função térmica (quente ou frio)",
      "Massagem Corporal",
      "Creme com  ativos drenates",
      "Manta Térmica",
      "Aromaterapia",
    ],
  },
  {
    name: "Escalda Pés Premium",
    price: 100,
    duration: "45min",
    details: [
      "Ofurô",
      "Esfoliação",
      "Imersão com óleos essenciais",
      "Foot Relax (massagem drenante nos pés e pernas)",
      "Aromaterapia",
    ],
  },
  {
    name: "Massagem Relaxante",
    price: 90,
    duration: "45min",
    details: [
      "Massagem corporal",
      "Pistola massageadora",
      "Manta térmica / vibratória",
      "Aromaterapia",
    ],
  },
  {
    name: "Escalda Pés",
    price: 80,
    duration: "30min",
    details: [
      "Ofurô",
      "Esfoliação",
      "Imersão com óleos essenciais",
      "Massagem drenante nos pés e pernas",
      "Aromaterapia",
    ],
  },
  {
    name: "Quick Massage",
    price: 50,
    duration: "25min",
    details: [
      "Massagem express",
      "Cadeira ergonômica",
      "Alívio de tensão muscular imediato",
    ],
  },
  
];

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Seção de Saudação */}
      <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div className="text-center md:text-left space-y-4">
          <Image
            src="/logo-balsamo.png"
            alt="Logo Bálsamo Massoterapia"
            width={120}
            height={120}
            className="mx-auto md:mx-0"
          />
          <h1 className="text-3xl font-bold text-green-900">
            Bem-vindo(a) à Bálsamo Massoterapia 🌿
          </h1>
          <p className="text-green-800 leading-relaxed">
            Cuidamos do seu corpo e da sua mente com técnicas terapêuticas que
            promovem relaxamento, saúde e bem-estar.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/proprietaria.jpg" // 👉 coloque a foto que você enviou na pasta /public
            alt="Proprietária Bálsamo Massoterapia"
            width={280}
            height={280}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Serviços */}
      <section>
        <h2 className="text-2xl font-bold text-green-900 text-center mb-10">
          Nossos Serviços
        </h2>

        <div className="grid gap-8">
          {services.map((service) => (
            <div
              key={service.name}
              className="bg-white/80 rounded-2xl shadow-md border border-purple-100 p-6"
            >
              <h3 className="text-xl font-semibold text-green-900">
                {service.name}
              </h3>
              <p className="text-green-700 font-medium">
                💰 R$ {service.price.toFixed(2)} — ⏱ {service.duration}
              </p>
              <ul className="list-disc list-inside mt-3 text-sm text-green-800 space-y-1">
                {service.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/book"
            className="inline-block bg-green-900 text-purple-50 px-6 py-3 rounded-lg shadow hover:bg-green-800 transition-colors"
          >
            📅 Agendar Agora
          </Link>
        </div>
      </section>
    </main>
  );
}
