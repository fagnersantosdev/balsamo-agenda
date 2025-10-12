"use client";
import Image from "next/image";

type ButterflySpec = {
  top: string;
  left: string;
  size: number;    // px
  rotate: number;  // graus
  opacity: number; // 0..1
};

const butterflies: ButterflySpec[] = [
  { top: "10%", left: "5%",  size: 50, rotate: 12,  opacity: 0.5 },
  { top: "20%", left: "80%", size: 60, rotate: -15, opacity: 0.5 },
  { top: "60%", left: "5%",  size: 55, rotate: 12,  opacity: 0.5 },
  { top: "42%", left: "15%", size: 70, rotate: 25,  opacity: 0.5 },
  { top: "60%", left: "70%", size: 55, rotate: -20, opacity: 0.5 },
  { top: "75%", left: "30%", size: 65, rotate: 18,  opacity: 0.5 },
  { top: "85%", left: "85%", size: 80, rotate: -10, opacity: 0.5 },
];

export default function BackgroundButterflies() {
  return (
    // ❗ z-0 (não negativo) e fixed para cobrir a viewport
    <div className="fixed inset-0 pointer-events-none z-0">
      {butterflies.map((b, i) => (
        <Image
          key={i}
          src="/borboleta.png" // confirme que este arquivo existe em /public
          alt="Borboleta decorativa"
          width={b.size}
          height={b.size}
          className="absolute select-none"
          style={{
            top: b.top,
            left: b.left,
            transform: `rotate(${b.rotate}deg)`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
