"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  position?: "top" | "bottom";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  position = "bottom",
  onClose
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 400);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const isSuccess = type === "success";

  // Classes de posicionamento dinâmico
  const positionClasses = position === "top"
    ? "top-6 left-1/2 -translate-x-1/2" 
    : "bottom-24 right-6 sm:bottom-10 sm:right-10"; // Sobe no mobile para não cobrir o nav

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: position === "top" ? -20 : 20,
            scale: 0.9 
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`
            fixed z-[10000] flex items-center gap-3 px-5 py-4 rounded-[1.25rem] 
            shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] backdrop-blur-md border
            ${positionClasses}
            ${isSuccess 
              ? "bg-emerald-600/95 border-emerald-500/20 text-emerald-50" 
              : "bg-red-600/95 border-red-500/20 text-red-50"
            }
          `}
        >
          <div className="shrink-0">
            {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          </div>
          
          <span className="font-bold text-sm tracking-tight pr-4 border-r border-white/10">
            {message}
          </span>

          <button 
            onClick={() => setVisible(false)}
            className="hover:rotate-90 transition-transform p-1 opacity-60 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}