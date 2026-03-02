"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function BalsamoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Se quiser trocar para o video2, basta mudar aqui para "/video2.mp4"
  const videoSrc = "/video3.mp4"; 

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Erro ao dar play:", err));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="relative w-full h-full group cursor-pointer overflow-hidden rounded-[2.5rem] bg-black shadow-2xl touch-pan-y" 
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        playsInline // Obrigatório para iPhone
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        // controls removido propositalmente para não travar o scroll!
      />

      {/* Camada de Botão Play/Pause */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center 
          transition-all duration-500
          ${isPlaying ? "opacity-0 group-hover:opacity-100" : "bg-black/20 backdrop-blur-[1px]"}
        `}
      >
        <div 
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            text-white shadow-2xl transition-transform duration-300
            ${isPlaying 
              ? "bg-black/50 hover:scale-110" 
              : "bg-white/20 backdrop-blur-md border border-white/30 hover:scale-110"
            }
          `}
        >
          {isPlaying ? (
            <Pause size={32} fill="currentColor" className="text-white" />
          ) : (
            <Play size={32} fill="currentColor" className="text-white ml-1" />
          )}
        </div>
      </div>

      {/* Texto "Toque para Assistir" */}
      {!isPlaying && (
        <div className="absolute bottom-8 left-0 right-0 text-center animate-pulse pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/10">
            Assista a Experiência
          </span>
        </div>
      )}
    </div>
  );
}