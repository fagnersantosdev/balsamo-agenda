import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFEF9]/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Spinner animado ao redor da logo */}
        <Loader2 className="w-20 h-20 text-[#8D6A93] animate-spin opacity-40" />
        
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
      
      <p className="mt-4 text-[#1F3924] font-medium tracking-widest text-xs uppercase animate-pulse">
        Preparando seu bem-estar...
      </p>
    </div>
  );
}