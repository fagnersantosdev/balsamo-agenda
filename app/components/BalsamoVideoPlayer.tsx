"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react"; 

const VIDEO_SOURCES = ["/video1.mp4", "/video2.mp4"];

export default function BalsamoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pausa se o usuário sair de perto do vídeo para poupar o celular
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !v.paused) {
          v.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      setIsBuffering(true);
      v.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => setIsBuffering(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  // Lógica para reproduzir o próximo vídeo automaticamente
  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;

    const nextIndex = (currentIndex + 1) % VIDEO_SOURCES.length;
    setCurrentIndex(nextIndex);

    // Pequeno delay para a troca de fonte não "piscar"
    setTimeout(() => {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }, 100);
  };

  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-3xl bg-black" 
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={VIDEO_SOURCES[currentIndex]}
        onEnded={handleEnded}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        className={`w-full sm:max-w-[320px] shadow-lg transition-all duration-500 object-cover ${
          isPlaying ? "opacity-100" : "opacity-90"
        }`}
        playsInline
        preload="auto" // Carrega o vídeo em background para evitar travamento ao dar play
        poster="/capa-video-hd.jpg" // Imagem de capa para melhorar a experiência inicial
      />

      {/* Overlay de Controle */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${
        isPlaying && !isBuffering ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
      }`}>
        
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
          {isBuffering ? (
            <Loader2 className="w-8 h-8 text-[#1F3924] animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 text-[#1F3924]" />
          ) : (
            <Play className="w-8 h-8 text-[#1F3924] fill-current ml-1" />
          )}
        </div>
      </div>

      {!isPlaying && !isBuffering && (
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="bg-white/80 text-[#1F3924] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {currentIndex === 0 ? "Assistir Apresentação" : "Continuar Assistindo"}
          </span>
        </div>
      )}
    </div>
  );
}