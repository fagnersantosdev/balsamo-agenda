"use client";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
  }

  async function handleUpdate(id: number) {
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: Number(price),
        durationMin: Number(duration),
      }),
    });

    if (res.ok) {
      await fetchServices();
      setEditing(null);
      alert("✅ Serviço atualizado com sucesso!");
    } else {
      alert("❌ Erro ao atualizar serviço");
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        Gerenciar Serviços
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-200 text-green-900">
            <th className="p-3 text-left">Serviço</th>
            <th className="p-3 text-left">Preço (R$)</th>
            <th className="p-3 text-left">Duração (min)</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-b hover:bg-purple-50 transition">
              <td className="p-3">{s.name}</td>
              <td className="p-3">
                {editing === s.id ? (
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                ) : (
                  `R$ ${s.price.toFixed(2)}`
                )}
              </td>
              <td className="p-3">
                {editing === s.id ? (
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                  />
                ) : (
                  `${s.durationMin} min`
                )}
              </td>
              <td className="p-3 text-center">
                {editing === s.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(s.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                    >
                      💾 Salvar
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(s.id);
                      setPrice(String(s.price));
                      setDuration(String(s.durationMin));
                    }}
                    className="px-3 py-1 bg-purple-600 text-white rounded"
                  >
                    ✏️ Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
