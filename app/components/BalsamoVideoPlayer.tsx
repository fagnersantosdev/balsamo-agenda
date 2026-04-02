"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 📸 IMPORTANTE: Coloque PELO MENOS DUAS fotos válidas aqui
const IMAGES = [
  "/espaco1.jpeg", // Confirme se o arquivo na pasta public se chama foto1.jpg
  "/espaco2.jpeg",
  "/espaco3.jpeg" // Confirme se o arquivo na pasta public se chama foto2.jpg
];

export default function BalsamoVideoPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para avançar a foto (usada no clique e no timer)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  };

  // Timer automático (4 segundos)
  useEffect(() => {
    // Se tiver só 1 foto, nem liga o timer
    if (IMAGES.length <= 1) return;

    const timer = setInterval(nextSlide, 4000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative w-full h-[500px] sm:w-[320px] mx-auto group overflow-hidden rounded-[2.5rem] bg-[#F5F3EB] shadow-2xl cursor-pointer"
      onClick={nextSlide} // 👈 Adicionamos o clique para trocar de foto!
    >
      
      {/* 🖼️ Renderiza as imagens */}
      {IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Ambiente Bálsamo Massoterapia ${index + 1}`}
          fill
          priority={index === 0} 
          // 👇 Adicionei 'absolute inset-0' para garantir o empilhamento correto
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          sizes="(max-width: 768px) 100vw, 320px"
        />
      ))}

      {/* 🌘 Sombra suave */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />

      {/* 🚥 Bolinhas do Slide */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-30">
        {IMAGES.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentIndex ? "bg-white w-6" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>

      {/* 🏷️ Label Inferior */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-30 pointer-events-none">
        <span className="
          bg-black/40 backdrop-blur-md text-white 
          text-[10px] font-bold px-4 py-2 rounded-full 
          uppercase tracking-[0.2em] border border-white/20
          shadow-lg
        ">
          Toque para ver mais
        </span>
      </div>

    </div>
  );
}

// "use client";

// import { useRef, useState } from "react";
// import { Play, Pause } from "lucide-react";

// export default function BalsamoVideoPlayer() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Se quiser trocar para o video2, basta mudar aqui para "/video2.mp4"
//   const videoSrc = "/video3.mp4"; 

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (video.paused) {
//       video.play()
//         .then(() => setIsPlaying(true))
//         .catch((err) => console.error("Erro ao dar play:", err));
//     } else {
//       video.pause();
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <div 
//       className="relative w-full h-full group cursor-pointer overflow-hidden rounded-[2.5rem] bg-black shadow-2xl touch-pan-y" 
//       onClick={togglePlay}
//     >
//       <video
//         ref={videoRef}
//         className="w-full h-full object-cover"
//         src={videoSrc}
//         playsInline // Obrigatório para iPhone
//         preload="metadata"
//         onEnded={() => setIsPlaying(false)}
//         // controls removido propositalmente para não travar o scroll!
//       />

//       {/* Camada de Botão Play/Pause */}
//       <div 
//         className={`
//           absolute inset-0 flex items-center justify-center 
//           transition-all duration-500
//           ${isPlaying ? "opacity-0 group-hover:opacity-100" : "bg-black/20 backdrop-blur-[1px]"}
//         `}
//       >
//         <div 
//           className={`
//             w-20 h-20 rounded-full flex items-center justify-center
//             text-white shadow-2xl transition-transform duration-300
//             ${isPlaying 
//               ? "bg-black/50 hover:scale-110" 
//               : "bg-white/20 backdrop-blur-md border border-white/30 hover:scale-110"
//             }
//           `}
//         >
//           {isPlaying ? (
//             <Pause size={32} fill="currentColor" className="text-white" />
//           ) : (
//             <Play size={32} fill="currentColor" className="text-white ml-1" />
//           )}
//         </div>
//       </div>

//       {/* Texto "Toque para Assistir" */}
//       {!isPlaying && (
//         <div className="absolute bottom-8 left-0 right-0 text-center animate-pulse pointer-events-none">
//           <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/10">
//             Assista a Experiência
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }