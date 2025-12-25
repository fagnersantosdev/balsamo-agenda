"use client";

import { useState } from "react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ author, message, rating }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
      setAuthor("");
      setMessage("");

      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1500);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      
      {/* Conteúdo do Modal */}
      <div className="bg-[#F5F3EB] w-full max-w-md mx-4 rounded-2xl shadow-xl border border-[#8D6A93]/30 p-6 animate-scaleIn">

        <h2 className="text-xl font-semibold text-[#1F3924] text-center mb-4">
          Deixe sua avaliação 🌿
        </h2>

        {sent ? (
          <p className="text-center text-green-700 font-medium py-6">
            Obrigado pelo seu feedback! 💚
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Estrelas */}
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl cursor-pointer transition ${
                    n <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Nome */}
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="
                w-full px-4 py-2
                rounded-xl
                border border-[#8D6A93]/30
                bg-white
                outline-none
                focus:ring-2 focus:ring-[#8D6A93]/40
                transition
              "
            />

            {/* Mensagem */}
            <textarea
              placeholder="Conte como foi sua experiência..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="
                w-full px-4 py-2
                rounded-xl
                border border-[#8D6A93]/30
                bg-white
                outline-none
                focus:ring-2 focus:ring-[#8D6A93]/40
                transition
              "
            />

            {/* Botão enviar */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3
                rounded-xl
                bg-[#8A4B2E]
                text-[#F5F3EB]
                font-semibold
                shadow-sm
                hover:bg-[#1F3924]
                hover:shadow-md
                transition-all
                disabled:opacity-50
              "
            >
              {loading ? "Enviando..." : "Enviar avaliação"}
            </button>

          </form>
        )}

        {/* Botão cancelar */}
        <button
        onClick={onClose}
        className="
          mt-4 w-full
          py-2
          rounded-xl
          text-sm
          text-[#1F3924]/70
          hover:bg-[#EDE9E2]
          transition
        "
      >
        Cancelar
      </button>
      </div>
    </div>
  );
}