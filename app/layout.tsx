import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Oooh_Baby, Outfit } from "next/font/google";
import BackgroundButterflies from "./components/BackgroundButterflies";
import FloatingWhatsApp from "./components/FloatingWhatsApp";


const ooohBaby = Oooh_Baby({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ooohbaby",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Bálsamo Massoterapia",
  description: "Agendamento online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${ooohBaby.variable} ${outfit.variable} font-sans bg-[#FFFEF9] text-[#1F3924] relative`}>
        <BackgroundButterflies />
        

        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#8D6A93]/95 backdrop-blur text-[#FFFEF9] shadow-md border-b border-[#D6A77A]/40 transition-all">

        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Logo + Nome */}
          <Link href="/" className="flex items-center justify-center sm:justify-start gap-3 group">
            <Image
              src="/logo-balsamo.png"
              alt="Logotipo Bálsamo Massoterapia"
              width={60}
              height={60}
              priority
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <span className="hidden sm:inline text-xl font-semibold group-hover:text-[#D6A77A] transition-colors">
            Bálsamo Massoterapia
            </span>

          </Link>

          {/* Navegação */}
          <nav className="flex justify-center sm:justify-end gap-6">
            {/* Link Agendar */}
            <Link
              href="/book"
              className="flex items-center gap-1 hover:text-[#D6A77A] font-medium transition-colors"
            >
              {/* Ícone calendário */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 2v2M18 2v2M3 9h18M4 7h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"
                />
              </svg>
              Agendar
            </Link>

            {/* Link Admin */}
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-[#D6A77A] font-medium transition-colors"
            >
              {/* Ícone engrenagem */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.893 3.31.874 2.417 2.417a1.724 1.724 0 001.065 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.893 1.543-.874 3.31-2.417 2.417a1.724 1.724 0 00-2.573 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.893-3.31-.874-2.417-2.417a1.724 1.724 0 00-1.065-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.893-1.543.874-3.31 2.417-2.417.84.486 1.907.222 2.573-1.065z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Admin
            </Link>
          </nav>
        </div>
      </header>

        {/* Conteúdo */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-10">{children}</main>
        {/* ✅ Botão fixo do WhatsApp */}
        <FloatingWhatsApp />

        {/* Rodapé */}
        <footer className="relative z-10 bg-[#8D6A93]/10 border-t border-[#D6A77A]/40 mt-16">
  <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
    {/* Coluna 1 - Logo + descrição */}
    <div>
      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
        <Image
          src="/logo-balsamo.png"
          alt="Bálsamo Massoterapia"
          width={60}
          height={60}
          className="rounded"
        />
        <span className="font-bold text-lg text-[#1F3924]">
          Bálsamo Massoterapia
        </span>
      </div>
      <p className="text-sm text-[#1F3924]/90">
        Bem-estar e cuidado através de massagens terapêuticas,
        para aliviar dores e renovar suas energias.
      </p>
    </div>

    {/* Coluna 2 - Contato */}
    <div>
      <h3 className="font-semibold text-[#1F3924] mb-3">Contato</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center justify-center md:justify-start gap-2">
          {/* Ícone WhatsApp */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-green-600"
          >
            <path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 0 11.99C0 5.373 5.373 0 11.99 0c3.192 0 6.2 1.244 8.477 3.522a11.87 11.87 0 0 1 3.522 8.478c0 6.617-5.373 11.99-11.99 11.99a11.87 11.87 0 0 1-5.847-1.494L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.365 1.591 5.448 0 9.884-4.435 9.884-9.884 0-5.448-4.436-9.884-9.884-9.884-5.448 0-9.884 4.436-9.884 9.884 0 2.088.691 3.78 1.65 5.37l-.999 3.648 3.868-1.725z" />
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.67-1.611-.916-2.205-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.1 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
          </svg>
          <a
            href="https://wa.me/5524992640951"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#8A4B2E] underline"
          >
            WhatsApp
          </a>
        </li>

        <li className="flex items-center justify-center md:justify-start gap-2">
          {/* Ícone Email */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-purple-600"
          >
            <path d="M4 4h16c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2H4c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2zm0 2v.511l8 4.889 8-4.889V6H4zm0 2.489V18h16V8.489l-8 4.889-8-4.889z" />
          </svg>
          <a
            href="mailto:contato@balsamo.com"
            className="hover:text-[#8A4B2E] underline"
          >
            contato@balsamo.com
          </a>
        </li>

        <li className="flex items-center justify-center md:justify-start gap-2">
          {/* Ícone Instagram */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-pink-600"
          >
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3a5.75 5.75 0 1 1 0 11.5 5.75 5.75 0 0 1 0-11.5zm0 1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zm5.25-.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
          </svg>
          <a
            href="https://www.instagram.com/balsamo_massoterapia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#8A4B2E] underline"
          >
            @balsamo_massoterapia
          </a>
        </li>
      </ul>
    </div>

    {/* Coluna 3 - Endereço */}
    <div>
      <h3 className="font-semibold text-[#1F3924] mb-3">Endereço</h3>
      <p className="text-sm text-[#1F3924]/90 mb-2">
        📍 R. Albino de Almeida, 81 - sala 02 <br />
        Campos Elíseos, Resende - RJ <br />
        CEP: 27542-080
      </p>
      <a
        href="https://www.google.com/maps/place/Bálsamo+Massoterapia"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#8D6A93] underline hover:text-[#8A4B2E]"
      >
        Ver no mapa
      </a>
    </div>
  </div>

  {/* Base - Direitos autorais */}
  <div className="bg-[#8D6A93] text-center text-xs text-[#FFFEF9] py-4">
    © {new Date().getFullYear()} Bálsamo Massoterapia — Todos os direitos reservados.
  </div>
  </footer>
      </body>
    </html>
  );
}
