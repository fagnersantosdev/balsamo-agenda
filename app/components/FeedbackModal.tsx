"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, X, CheckCircle2, Loader2 } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, message, rating }),
      });

      if (res.ok) {
        setSent(true);
        setAuthor("");
        setMessage("");
        setTimeout(() => {
          setSent(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao enviar feedback", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay com Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1F3924]/40 backdrop-blur-md"
          />

          {/* Card do Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#FFFEF9] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-[#8D6A93]/10 p-8 md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#1F3924]/30 hover:text-[#1F3924] transition-colors"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F3924] mb-2">Gratidão!</h3>
                  <p className="text-[#1F3924]/60">Sua avaliação foi enviada com sucesso.</p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <header className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1F3924] mb-2">
                      Sua experiência 🌿
                    </h2>
                    <p className="text-sm text-[#1F3924]/80">
                      Como foi seu momento na Bálsamo?
                    </p>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Estrelas Interativas */}
                    <div className="flex justify-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onMouseEnter={() => setHover(n)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(n)}
                          className="transition-transform active:scale-90"
                        >
                          <Star
                            size={32}
                            fill={(hover || rating) >= n ? "#EAB308" : "transparent"}
                            className={`transition-colors duration-200 ${
                              (hover || rating) >= n ? "text-yellow-500" : "text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#1F3924]/40 ml-1 mb-1 block">
                          Seu Nome (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Maria Silva"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl border border-[#8D6A93]/10 bg-[#F5F3EB]/30 focus:bg-white focus:ring-2 focus:ring-[#8D6A93] focus:border-transparent outline-none transition-all text-[#1F3924]"
                        />
                      </div>

                      <div className="group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#1F3924]/40 ml-1 mb-1 block">
                          Sua Mensagem
                        </label>
                        <textarea
                          placeholder="O que você mais gostou?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={4}
                          className="w-full px-5 py-3 rounded-2xl border border-[#8D6A93]/10 bg-[#F5F3EB]/30 focus:bg-white focus:ring-2 focus:ring-[#8D6A93] focus:border-transparent outline-none transition-all text-[#1F3924] resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-[#1F3924] text-[#FFFEF9] font-bold shadow-xl shadow-[#1F3924]/20 hover:bg-[#2a4d31] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Send size={18} />
                          Enviar Avaliação
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}