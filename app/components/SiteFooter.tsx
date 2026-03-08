"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SiteFooter() {
  const pathname = usePathname();

  // Oculta o footer em qualquer rota /admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-10 bg-[#8D6A93]/10 border-t border-[#D6A77A]/30 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Coluna 1: Marca */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo-balsamo.png" alt="Bálsamo" width={50} height={50} />
            <span className="font-bold text-xl text-[#1F3924]">Bálsamo Massoterapia</span>
          </div>
          <p className="text-sm text-[#1F3924] font-medium leading-relaxed">
            Equilíbrio e renovação através de técnicas terapêuticas pensadas no seu bem-estar integral.
          </p>
        </div>

        {/* Coluna 2: Contato */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#8D6A93] uppercase tracking-wider text-xs">Atendimento</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://wa.me/5524992640951" target="_blank" className="flex items-center justify-center md:justify-start gap-2 font-semibold hover:text-[#8D6A93] transition-colors">
                <span className="text-green-600">●</span> WhatsApp: (24) 99264-0951
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/balsamo_massoterapia" target="_blank" className="flex items-center justify-center md:justify-start gap-2 font-semibold hover:text-[#8D6A93] transition-colors">
                <span className="text-pink-600">●</span> @balsamo_massoterapia
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Endereço */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#8D6A93] uppercase tracking-wider text-xs">Nossa Localização</h3>
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-[#1F3924] font-medium leading-relaxed">
              R. Albino de Almeida, 81 - sala 02<br />
              Campos Elíseos, Resende - RJ
            </p>
            
            {/* Link para o Mapa - Com cor mais forte e negrito */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=R.+Albino+de+Almeida,+81+-+sala+02+-+Campos+Elíseos,+Resende+-+RJ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-2 text-xs font-bold text-[#8D6A93] hover:text-[#1F3924] transition-all group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="group-hover:bounce"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              VER NO GOOGLE MAPS
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#1F3924]"></span>
            </a>
          </div>
        </div>
      </div>

      {/* Faixa de Copyright */}
      <div className="bg-[#8D6A93] py-4 text-center">
        <p className="text-[10px] text-[#FFFEF9] font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} Bálsamo Massoterapia — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}