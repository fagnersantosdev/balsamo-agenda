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
    const formEl = e.currentTarget; // ✅ salva referência antes do await
    const form = new FormData(formEl);

    const name = form.get("name") as string;
    const price = parseFloat(form.get("price") as string);
    const durationMin = parseInt(form.get("durationMin") as string);
    const detailsText = (form.get("details") as string) || "";

    const detailsArray = detailsText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    if (!name || isNaN(price) || isNaN(durationMin)) {
      setToast({ message: "⚠️ Preencha todos os campos obrigatórios.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, durationMin, details: detailsArray }),
      });

      if (res.ok) {
        setToast({ message: "✅ Serviço criado com sucesso!", type: "success" });
        formEl.reset(); // ✅ limpa o formulário
        setTimeout(() => router.push("/admin/services"), 2000); // redireciona após sucesso
      } else {
        const err = await res.json();
        setToast({
          message: `❌ Erro ao criar serviço: ${err.error || "Verifique os dados e tente novamente."}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      setToast({ message: "❌ Falha na conexão. Tente novamente mais tarde.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-[#F5F3EB] rounded-2xl shadow-lg border border-[#8D6A93]/20 relative">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6 text-center">
        ➕ Novo Serviço
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome do serviço */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Nome do Serviço</label>
          <input
            name="name"
            required
            placeholder="Ex.: Massagem Relaxante"
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        {/* Preço */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Preço (R$)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            placeholder="Ex.: 90.00"
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        {/* Duração */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Duração (minutos)</label>
          <input
            name="durationMin"
            type="number"
            required
            placeholder="Ex.: 45"
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        {/* Detalhes */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">
            Detalhes (um item por linha)
          </label>
          <textarea
            name="details"
            placeholder={"Exemplo:\n🌸 Aromaterapia\n💆 Massagem Drenante\n🔥 Manta térmica"}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Serviço"}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
