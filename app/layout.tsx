import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Oooh_Baby, Outfit } from "next/font/google";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import SiteFooter from "./components/SiteFooter";
import ClientEfeccts from "./components/ClientEfects";


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
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#8D6A93",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${ooohBaby.variable} ${outfit.variable} font-sans bg-[#FFFEF9] text-[#1F3924] relative antialiased`}
      >
        {/* Efeitos visuais de fundo */}
        <ClientEfeccts />

        {/* HEADER PREMIUM */}
        <header
          className="
            fixed top-0 left-0 w-full z-50 
            bg-[#8D6A93]/95 backdrop-blur-md
            border-b border-[#D6A77A]/30
            shadow-sm transition-all
          "
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:py-3">

            {/* Logo: Sempre centralizada no mobile, à esquerda no desktop */}
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Image
                src="/logo-balsamo.png"
                alt="Bálsamo"
                width={45} // Reduzido para ganhar espaço no mobile
                height={45}
                priority
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-lg font-semibold text-[#FFFEF9] sm:text-xl">
                Bálsamo Massoterapia
              </span>
            </Link>

            {/* Navegação: Linha de botões abaixo da logo no mobile */}
            <nav className="flex items-center justify-center gap-5 w-full sm:w-auto sm:gap-8 border-t border-white/10 pt-1 sm:border-none sm:pt-0">
              <Link
                href="/book"
                className="flex items-center gap-1.5 text-[#FFFEF9] font-medium hover:text-[#D6A77A] transition-all text-sm"
              >
                <CalendarIcon />
                Agendar
              </Link>

              <div className="w-px h-3 bg-[#FFFEF9]/30" />

              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-[#FFFEF9] font-medium hover:text-[#D6A77A] transition-all text-sm"
              >
                <AdminIcon />
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 pt-28 pb-10 min-h-[70vh]">
          {children}
        </main>

        <FloatingWhatsApp />

        {/* RODAPÉ (Sem duplicação de tags) */}
        <SiteFooter />
      </body>
    </html>
  );
}

// Sub-componentes de ícones para manter o código limpo
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12m-12 4.5h12m-12 4.5h12M3 3.75h18c.414 0 .75.336.75.75v15c0 .414-.336.75-.75.75H3a.75.75 0 01-.75-.75V4.5c0-.414.336-.75.75-.75z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}