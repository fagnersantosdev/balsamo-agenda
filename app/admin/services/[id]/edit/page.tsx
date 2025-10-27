"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Toast from "../../../../components/toast";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  details?: string[];
};

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🔄 Buscar serviço atual
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar serviço");
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error(error);
        setToast({ message: "❌ Erro ao carregar dados do serviço.", type: "error" });
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchService();
  }, [id]);

  // 💾 Atualizar serviço
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formEl = e.currentTarget;
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

    setSaving(true);

    try {
      console.log("📤 Enviando atualização:", { name, price, durationMin, detailsArray });

      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH", // ✅ corrigido de PUT para PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, durationMin, details: detailsArray }),
      });

      console.log("📥 Status da resposta:", res.status);

      if (res.ok) {
        setToast({ message: "✅ Serviço atualizado com sucesso!", type: "success" });
        setTimeout(() => router.push("/admin/services"), 2000);
      } else {
        let errMsg = "Verifique os dados e tente novamente.";
        try {
          const err = await res.json();
          errMsg = err.error || err.message || errMsg;
        } catch {
          console.warn("⚠️ Resposta vazia da API ao atualizar serviço.");
        }
        setToast({
          message: `❌ Erro ao atualizar: ${errMsg}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("❌ Erro de conexão:", error);
      setToast({ message: "Erro de conexão. Tente novamente mais tarde.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-xl mx-auto p-6 bg-[#F5F3EB] rounded-2xl shadow-lg border border-[#8D6A93]/20">
        <p className="text-[#1F3924] text-center">Carregando dados do serviço...</p>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-[#8D6A93]/20">
        <p className="text-[#1F3924] text-center">Serviço não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-[#F5F3EB] rounded-2xl shadow-lg border border-[#8D6A93]/20 relative">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6 text-center">✏️ Editar Serviço</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Nome do Serviço</label>
          <input
            name="name"
            defaultValue={service.name}
            required
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
            defaultValue={service.price}
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        {/* Duração */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Duração (minutos)</label>
          <input
            name="durationMin"
            type="number"
            defaultValue={service.durationMin}
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        {/* Detalhes */}
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Detalhes</label>
          <textarea
            name="details"
            defaultValue={(service.details || []).join("\n")}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#8D6A93]"
          />
          <p className="text-xs text-[#1F3924]/70 mt-1">
            Cada linha representa um item (ex.: 🌸 Aromaterapia, 💆 Massagem Relaxante)
          </p>
        </div>

        <button
          disabled={saving}
          className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition-colors duration-300 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
