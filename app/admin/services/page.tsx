"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Toast from "../../components/toast";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setToast({ message: "✅ Serviço excluído com sucesso!", type: "success" });
      fetchServices();
    } else {
      setToast({ message: "❌ Erro ao excluir serviço", type: "error" });
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg relative">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        Gerenciar Serviços
      </h1>

      {/* Botão de adicionar */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/services/new"
          className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          ➕ Novo Serviço
        </Link>
      </div>

      {/* Estado de carregamento */}
      {loading ? (
        <p className="text-[#1F3924]">Carregando serviços...</p>
      ) : services.length === 0 ? (
        <p className="text-[#1F3924]">Nenhum serviço cadastrado.</p>
      ) : (
        <>
          {/* 🧩 Tabela para desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-200 text-green-900">
                  <th className="p-3 text-left">Serviço</th>
                  <th className="p-3 text-left">Preço (R$)</th>
                  <th className="p-3 text-left">Duração</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-purple-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-[#1F3924]">{s.name}</td>
                    <td className="p-3">R$ {s.price.toFixed(2)}</td>
                    <td className="p-3">{s.durationMin} min</td>
                    <td className="p-3 text-center space-x-2">
                      <Link
                        href={`/admin/services/${s.id}/edit`}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        ✏️ Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Layout para celular */}
          <div className="sm:hidden space-y-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="border border-[#8D6A93]/30 rounded-xl p-4 shadow-sm bg-[#F5F3EB]/40"
              >
                <p className="font-semibold text-[#1F3924]">{s.name}</p>
                <p className="text-sm text-[#8A4B2E]">💰 R$ {s.price.toFixed(2)}</p>
                <p className="text-sm text-[#1F3924]/80 mb-3">
                  ⏱ {s.durationMin} minutos
                </p>

                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/admin/services/${s.id}/edit`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition text-sm"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Toast de feedback */}
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
