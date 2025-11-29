"use client";
import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  position?: "top" | "bottom"; // <-- NOVO
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  position = "bottom",  // <-- padrão mantém tudo como era
  onClose
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`
        fixed z-[9999] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm
        transform transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}

        ${type === "success" ? "bg-green-700" : "bg-red-600"}

        ${position === "top"
          ? "top-6 left-1/2 -translate-x-1/2"        // ⬆ topo central
          : "bottom-5 right-5"}                      // ⬇ posição padrão
      `}
    >
      {type === "success" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}