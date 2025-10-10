"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Toast from "../../../../components/toast";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
};


export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      price: Number(form.get("price")),
      durationMin: Number(form.get("durationMin")),
    };

    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setToast({ message: "✅ Serviço atualizado!", type: "success" });
      setTimeout(() => router.push("/admin/services"), 1200);
    } else {
      setToast({ message: "❌ Erro ao atualizar serviço", type: "error" });
    }

    setLoading(false);
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">Editar Serviço</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-[#1F3924]">Nome</label>
          <input
            name="name"
            defaultValue={service?.name ?? ""}
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
            defaultValue={service?.price ?? ""}
            required
            className="w-full p-2 border border-purple-300 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#1F3924]">Duração (minutos)</label>
          <input
            type="number"
            name="durationMin"
            defaultValue={service?.durationMin ?? ""}
            required
            className="w-full p-2 border border-purple-300 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#1F3924] text-purple-50 font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}
