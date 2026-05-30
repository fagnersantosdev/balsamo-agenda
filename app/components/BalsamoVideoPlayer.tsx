"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 📸 Lembre-se de colocar o nome das suas fotos reais aqui
const IMAGES = [
  "/img01.jpg", 
  "/img02.jpg",
  "/img03.jpg",
  "/img04.jpg",
  "/img05.jpg",
  "/img06.png",
  "/img07.jpg",
];

export default function BalsamoVideoPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 👇 Esta é a função que estava faltando! Ela faz a foto avançar.
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  };

  // Timer automático (4 segundos)
  useEffect(() => {
    if (IMAGES.length <= 1) return;

    const timer = setInterval(nextSlide, 4000); 
    return () => clearInterval(timer);
  }, []);

  return (
    // 👇 A div blindada para não sumir no celular e com o evento de clique
    <div 
      className="relative w-[300px] sm:w-[320px] h-[480px] sm:h-[500px] mx-auto group overflow-hidden rounded-[2.5rem] bg-[#F5F3EB] shadow-2xl cursor-pointer"
      onClick={nextSlide} 
    >
      
      {/* 🖼️ Renderiza as imagens */}
      {IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Ambiente Bálsamo Massoterapia ${index + 1}`}
          fill
          priority={index === 0} 
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          sizes="(max-width: 768px) 300px, 320px"
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