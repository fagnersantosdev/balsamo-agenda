import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    // 👇 Mudamos para 'min-h-screen flex flex-col items-center justify-center'
    // Isso faz o loading ficar centralizado no meio da tela toda e remove o erro do nextSlide!
    <div className="min-h-screen bg-[#F5F3EB] flex flex-col items-center justify-center">
      
      <div className="relative flex items-center justify-center">
        {/* Spinner animado ao redor da logo */}
        <Loader2 className="w-24 h-24 text-[#8D6A93] animate-spin opacity-40" />
        
        <div className="absolute">
          <Image 
            src="/logo-balsamo.png" 
            alt="Carregando Bálsamo" 
            width={50} 
            height={50} 
            className="animate-pulse"
          />
        </div>
      </div>
      
      <p className="mt-6 text-[#1F3924] font-medium tracking-widest text-xs uppercase animate-pulse">
        Preparando seu bem-estar...
      </p>
      
    </div>
  );
}