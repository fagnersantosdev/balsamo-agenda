"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../../components/toast";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const detailsText = form.get("details") as string;
    const detailsArray = detailsText
      ? detailsText.split("\n").map((line) => line.trim()).filter(Boolean)
      : [];

    const payload = {
      name: form.get("name"),
      price: form.get("price"),
      durationMin: form.get("durationMin"),
      details: detailsArray,
    };


    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setToast({ message: "✅ Serviço adicionado com sucesso!", type: "success" });
      setTimeout(() => router.push("/admin/services"), 1200);
    } else {
      setToast({ message: "❌ Erro ao adicionar serviço", type: "error" });
    }

    setLoading(false);
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">Adicionar Serviço</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-[#1F3924]">Nome</label>
          <input
            name="name"
            required
            className="w-full p-2 border border-purple-300 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#1F3924]">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            required
            className="w-full p-2 border border-purple-300 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#1F3924]">Duração (minutos)</label>
          <input
            type="number"
            name="durationMin"
            required
            className="w-full p-2 border border-purple-300 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>
        <div>
        <label className="block mb-2 font-medium text-[#1F3924]">
          Detalhes (um por linha)
        </label>
        <textarea
          name="details"
          rows={4}
          placeholder="Exemplo:\n💆 Massagem corporal\n🌸 Aromaterapia"
          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>


        <button
          disabled={loading}
          className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition"
        >
          {loading ? "Salvando..." : "Salvar Serviço"}
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
