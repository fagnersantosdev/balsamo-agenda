import Image from "next/image";
import Link from "next/link";

const services = [
  {
    name: "Massagem Relaxante",
    desc: "Ideal para aliviar o estresse e tensões musculares, promovendo bem-estar físico e mental.",
    img: "/borboleta.png", // Substitua por uma imagem específica depois
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

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white text-green-900 py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Nossos Serviços
      </h1>

      <div className="max-w-4xl mx-auto space-y-12">
        {services.map((service, index) => (
          <div
            key={service.name}
            className={`flex flex-col md:flex-row items-center gap-6 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Imagem */}
            <Image
              src={service.img}
              alt={service.name}
              width={200}
              height={200}
              className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
            {/* Descrição */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
              <p className="text-green-800">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Agendar */}
      <div className="text-center mt-16">
        <Link
          href="/book"
          className="inline-block bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors duration-300 shadow"
        >
          ✨ Agende Agora
        </Link>
      </div>
    </main>
  );
}
