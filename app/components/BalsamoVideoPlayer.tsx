"use client";

import { useEffect, useRef } from "react";

const VIDEO_SOURCES = ["/video1.mp4", "/video2.mp4"];

export default function BalsamoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Configuração inicial
    v.src = VIDEO_SOURCES[0];

    // Lógica para tocar o próximo vídeo ao acabar
    const handleEnded = () => {
      v.style.opacity = "0";
      setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % VIDEO_SOURCES.length;
        v.src = VIDEO_SOURCES[indexRef.current];
        
        const onLoaded = () => {
          v.removeEventListener("loadeddata", onLoaded);
          // Só toca se estiver visível no momento que carregou
          if (v.getAttribute("data-visible") === "true") {
            v.play().catch(() => {});
          }
          v.style.opacity = "1";
        };
        v.addEventListener("loadeddata", onLoaded);
      }, 400);
    };

    // Intersection Observer: O comportamento de "Rede Social"
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            v.setAttribute("data-visible", "true");
            v.play().catch(() => {});
          } else {
            v.setAttribute("data-visible", "false");
            v.pause();
          }
        });
      },
      { 
        threshold: 0.2, // Toca quando 20% do vídeo aparecer
        rootMargin: "100px" // "Pre-warming": começa a carregar 100px antes de aparecer
      }
    );

    observer.observe(v);
    v.addEventListener("ended", handleEnded);

    return () => {
      observer.disconnect();
      v.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="
        w-full sm:max-w-[320px] rounded-3xl border border-[#8D6A93]/30 
        shadow-lg transition-opacity duration-700
        will-change-transform
      "
      muted
      playsInline
      preload="auto" // Mudamos para auto para ele tentar carregar a nitidez antes do play
      poster="/capa-video-hd.jpg" // 👈 ESSENCIAL: Uma imagem HD de 600x600px
    />
  );
}