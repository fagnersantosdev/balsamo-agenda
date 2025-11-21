"use client";

import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  author: string;
  message: string;
  createdAt: string;
};

export default function TestimonialsAdmin() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🔹 Buscar avaliações ao carregar a página
  async function loadTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch {
      setToast({ message: "Erro ao carregar avaliações.", type: "error" });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  // 🔹 Salvar nova avaliação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!author || !message) {
      setToast({ message: "Preencha nome e avaliação!", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, message }),
      });

      if (!res.ok) throw new Error();

      setAuthor("");
      setMessage("");
      setToast({ message: "Avaliação cadastrada com sucesso!", type: "success" });

      loadTestimonials();
    } catch {
      setToast({ message: "Erro ao salvar avaliação.", type: "error" });
    }
  }

  // 🔹 Excluir
  async function deleteTestimonial(id: number) {
    if (!confirm("Deseja realmente excluir esta avaliação?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setToast({ message: "Avaliação removida com sucesso!", type: "success" });
      loadTestimonials();
    } catch {
      setToast({ message: "Erro ao excluir avaliação.", type: "error" });
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Toast suave */}
      {toast && (
        <div
          className={`
            fixed top-5 right-5 px-4 py-2 rounded-lg shadow
            text-white font-medium z-50 transition
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#1F3924] mb-8 text-center">
        ⭐ Gerenciar Avaliações
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#F5F3EB] border border-[#8D6A93]/30 rounded-2xl p-6 shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold text-[#1F3924] mb-4">
          Cadastrar nova avaliação
        </h2>

        <input
          type="text"
          placeholder="Nome do cliente"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-3 rounded-lg border border-[#8D6A93]/30 mb-4 focus:ring focus:ring-[#8D6A93]/30"
        />

        <textarea
          placeholder="Avaliação do cliente"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-lg border border-[#8D6A93]/30 h-32 resize-none focus:ring focus:ring-[#8D6A93]/30"
        />

        <button
          type="submit"
          className="
            mt-4 bg-[#8A4B2E] text-[#F5F3EB]
            px-6 py-3 rounded-lg shadow-lg
            hover:bg-[#1F3924] transition
            font-medium
          "
        >
          Salvar Avaliação
        </button>
      </form>

      {/* Lista de avaliações */}
      <h2 className="text-xl font-semibold text-[#1F3924] mb-4">
        Avaliações cadastradas
      </h2>

      {loading ? (
        <p className="text-[#1F3924]/70">Carregando avaliações...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-[#1F3924]/70">Nenhuma avaliação cadastrada ainda.</p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="
                bg-white border border-[#8D6A93]/30 rounded-xl p-5 shadow-sm
                flex justify-between items-start
              "
            >
              <div>
                <p className="font-semibold text-[#1F3924]">{t.author}</p>
                <p className="text-[#1F3924]/80 italic mt-1">{t.message}</p>
                <p className="text-xs text-[#1F3924]/50 mt-2">
                  {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <button
                onClick={() => deleteTestimonial(t.id)}
                className="text-red-500 hover:text-red-700 text-sm ml-4"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}