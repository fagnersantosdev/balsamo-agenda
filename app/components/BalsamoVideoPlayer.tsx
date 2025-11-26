"use client";

import { useEffect, useRef } from "react";

const VIDEO_SOURCES = ["/video1.mp4", "/video2.mp4"];

export default function BalsamoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pré-carregar vídeos
    const cache = VIDEO_SOURCES.map((src) => {
      const v = document.createElement("video");
      v.src = src;
      v.preload = "auto";
      return v;
    });

    // Inicia com o primeiro vídeo
    video.src = cache[0].src;
    video.load();
    video.play().catch(() => {});

    function handleEnded() {
      const v = videoRef.current;
      if (!v) return;

      v.style.transition = "opacity 0.4s ease";
      v.style.opacity = "0";

      setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % VIDEO_SOURCES.length;

        v.src = cache[indexRef.current].src;
        v.load();

        const onCanPlay = () => {
          v.removeEventListener("canplay", onCanPlay);
          v.play().catch(() => {});
          v.style.opacity = "1";
        };

        v.addEventListener("canplay", onCanPlay);
      }, 400);
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="
        w-full
        sm:max-w-[300px]
        md:max-w-[280px]
        lg:max-w-[300px]
        xl:max-w-[320px]
        rounded-3xl
        shadow-[0_8px_25px_-5px_rgba(141,106,147,0.35)]
        border border-[#8D6A93]/30
        opacity-100
        transition-opacity duration-700
      "
      autoPlay
      muted
      playsInline
    />
  );
}