"use client";

import { useState } from "react";

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ReviewModal({ open, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !message.trim()) {
      setFeedbackType("error");
      setFeedback("Por favor, preencha a avaliação e a nota.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("author", name || "Anônimo");
      formData.append("rating", String(rating));
      formData.append("message", message);
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch("/api/testimonials/client", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar avaliação");
      }

      setFeedbackType("success");
      setFeedback("Avaliação enviada com sucesso! Obrigado pelo carinho 💚");
      setName("");
      setRating(5);
      setMessage("");
      setPhoto(null);
    } catch (error) {
      console.error(error);
      setFeedbackType("error");
      setFeedback("Não foi possível enviar a avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setFeedback(null);
    setFeedbackType(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-[#FFFEF9] max-w-md w-full rounded-2xl shadow-xl border border-[#8D6A93]/30 p-6 relative">
        {/* Botão fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-[#1F3924]/70 hover:text-[#1F3924]"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-[#1F3924] mb-2">
          Deixe sua avaliação 💬
        </h3>
        <p className="text-sm text-[#1F3924]/80 mb-4">
          Sua opinião é muito importante para nós e ajuda outras pessoas a conhecerem a
          experiência na Bálsamo Massoterapia.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-[#1F3924] mb-1">
              Nome (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full rounded-lg border border-[#8D6A93]/30 px-3 py-2
                text-sm text-[#1F3924]
                focus:outline-none focus:ring-2 focus:ring-[#8D6A93]/60
                bg-white
              "
              placeholder="Como podemos te chamar?"
            />
          </div>

          {/* Nota */}
          <div>
            <label className="block text-sm font-medium text-[#1F3924] mb-1">
              Nota do atendimento
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`
                    text-2xl
                    ${rating && star <= rating ? "text-[#D6A77A]" : "text-[#8D6A93]/40"}
                    hover:scale-110 transition-transform
                  `}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-sm font-medium text-[#1F3924] mb-1">
              Conte como foi sua experiência
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="
                w-full rounded-lg border border-[#8D6A93]/30 px-3 py-2
                text-sm text-[#1F3924]
                focus:outline-none focus:ring-2 focus:ring-[#8D6A93]/60
                bg-white resize-none
              "
              placeholder="Ex: Atendimento excelente, ambiente acolhedor, me senti muito relaxado(a)..."
              required
            />
          </div>

          {/* Foto opcional */}
          <div>
            <label className="block text-sm font-medium text-[#1F3924] mb-1">
              Foto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full text-sm text-[#1F3924]/80"
            />
            <p className="text-xs text-[#1F3924]/60 mt-1">
              Você pode anexar uma foto relacionada à sua experiência (opcional).
            </p>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`
                text-sm mt-2 px-3 py-2 rounded-lg
                ${
                  feedbackType === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }
              `}
            >
              {feedback}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg border border-[#8D6A93]/40 text-[#1F3924] hover:bg-[#F5F3EB]"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-5 py-2 text-sm rounded-lg
                bg-[#8D6A93] text-[#FFFEF9]
                hover:bg-[#7A577F]
                disabled:opacity-70 disabled:cursor-not-allowed
                shadow-sm
              "
            >
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}