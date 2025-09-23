import Image from "next/image";
import Link from "next/link";

const services = [
  {
    name: "Massagem Relaxante",
    desc: "Ideal para aliviar o estresse e tensões musculares, promovendo bem-estar físico e mental.",
    img: "/borboleta.png",
  },
  {
    name: "Drenagem Linfática",
    desc: "Técnica para estimular o sistema linfático, reduzindo inchaços e melhorando a circulação sanguínea.",
    img: "/borboleta.png",
  },
  {
    name: "Shiatsu Terapêutico",
    desc: "Método oriental que equilibra a energia vital, alivia dores musculares e melhora a postura.",
    img: "/borboleta.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white text-green-900">
      {/* Seção de saudação */}
      <section className="text-center py-12 px-4 fade-in-up">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-balsamo.png"
            alt="Bálsamo Massoterapia Logo"
            width={100}
            height={100}
            //className="animate-bounce"
          />
          <Link href="/book" className="hover:underline hover:text-green-800"></Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
          Bem-vindo à Bálsamo Massoterapia 🦋
        </h1>
        <p className="text-green-800 max-w-2xl mx-auto text-lg">
          Oferecemos massagens terapêuticas especializadas para aliviar dores,
          reduzir o estresse e renovar suas energias. Nosso espaço foi pensado
          para proporcionar bem-estar, relaxamento e cuidado individualizado para
          cada cliente.
        </p>
      </section>


      {/* Lista de serviços */}
      <section className="relative py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-purple-100 to-white opacity-60 -z-10"></div>

      <h2 className="text-2xl font-bold text-center mb-6">Nossos Serviços</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        {services.map((service, index) => (
          <div
            key={service.name}
            className={`bg-white rounded-lg shadow hover:shadow-lg p-4 transition-transform transform hover:scale-105 duration-300 fade-in-up fade-delay-${index + 1}`}
          >
            <Image
              src={service.img}
              alt={service.name}
              width={80}
              height={80}
              className="mx-auto mb-3 animate-bounce"
            />
            <h3 className="text-lg font-semibold text-green-900">{service.name}</h3>
            <p className="text-sm text-green-800 mt-1">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Botão Agendar */}
      <div className="text-center mt-12 fade-in-up fade-delay-4">
        <Link
          href="/book"
          className="inline-block bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors duration-300 shadow"
        >
          ✨ Agende Agora
        </Link>
      </div>
    </section>

    </main>
  );
}
