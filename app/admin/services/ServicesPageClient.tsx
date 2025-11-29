"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../components/Toast";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  active: boolean;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices(active = true) {
    try {
      setLoading(true);
      const url = active ? "/api/services" : "/api/services/deleted";
      const res = await fetch(url);

      if (!res.ok) {
        console.error("Erro ao buscar serviços:", await res.text());
        setServices([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
      setShowActive(active);
    } catch (error) {
      console.error("Erro de conexão:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Exclusão com confirmação visual
async function handleDelete(id: number) {
  const confirmed = await showConfirmDialog({
    title: "Confirmar Exclusão",
    message: "Tem certeza que deseja excluir este serviço?",
    confirmText: "Excluir",
    confirmColor: "bg-red-600 hover:bg-red-700",
  });

  if (!confirmed) return;

  const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
  if (res.ok) {
    setToast({ message: "✅ Serviço excluído com sucesso!", type: "success" });
    fetchServices(true);
  } else {
    setToast({ message: "❌ Erro ao excluir serviço.", type: "error" });
  }
}

  // 🧩 Função auxiliar para confirmação visual reutilizável
async function showConfirmDialog({
  title,
  message,
  confirmText,
  confirmColor,
}: {
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 flex items-center justify-center bg-black/40 z-50";

    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-6 text-center w-80">
        <h2 class="text-lg font-semibold text-[#1F3924] mb-3">${title}</h2>
        <p class="text-[#1F3924]/80 mb-5">${message}</p>
        <div class="flex justify-center gap-4">
          <button id="cancelBtn" class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
            Cancelar
          </button>
          <button id="confirmBtn" class="px-4 py-2 rounded-lg text-white ${confirmColor}">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("confirmBtn")?.addEventListener("click", () => {
      resolve(true);
      overlay.remove();
    });

    document.getElementById("cancelBtn")?.addEventListener("click", () => {
      resolve(false);
      overlay.remove();
    });
  });
}


// ♻️ Restauração com confirmação visual
async function handleRestore(id: number) {
  const confirmed = await showConfirmDialog({
    title: "Restaurar Serviço",
    message: "Deseja reativar este serviço?",
    confirmText: "Restaurar",
    confirmColor: "bg-green-700 hover:bg-green-800",
  });

  if (!confirmed) return;

  const res = await fetch(`/api/services/${id}/restore`, { method: "PATCH" });
  if (res.ok) {
    setToast({ message: "✅ Serviço restaurado com sucesso!", type: "success" });
    fetchServices(true);
  } else {
    setToast({ message: "❌ Erro ao restaurar serviço.", type: "error" });
  }
}


  return (
    <main className="max-w-5xl mx-auto p-6 bg-[#F5F3EB] rounded-2xl shadow-lg relative overflow-hidden">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6 mt-4">Gerenciar Serviços</h1>

      {/* 🔹 Linha de botões */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => fetchServices(true)}
            className={`px-4 py-2 rounded-lg transition ${
              showActive
                ? "bg-green-900 text-white"
                : "bg-gray-300 text-[#1F3924] hover:bg-gray-400"
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => fetchServices(false)}
            className={`px-4 py-2 rounded-lg transition ${
              !showActive
                ? "bg-green-900 text-white"
                : "bg-gray-300 text-[#1F3924] hover:bg-gray-400"
            }`}
          >
            Excluídos
          </button>
        </div>

        <Link
          href="/admin/services/new"
          className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition text-center"
        >
          ➕ Novo Serviço
        </Link>
      </div>

      {/* Estado de carregamento */}
      {loading ? (
        <p className="text-[#1F3924]">Carregando serviços...</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={showActive ? "ativos" : "excluidos"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            {services.length === 0 ? (
              <p className="text-[#1F3924]">Nenhum serviço encontrado.</p>
            ) : (
              <>
                {/* 🧩 Tabela desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-purple-200 text-green-900">
                        <th className="p-3 text-left">Serviço</th>
                        <th className="p-3 text-left">Preço (R$)</th>
                        <th className="p-3 text-left">Duração</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <motion.tr
                          key={s.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-b hover:bg-purple-50 transition-colors"
                        >
                          <td className="p-3 font-medium text-[#1F3924]">{s.name}</td>
                          <td className="p-3">R$ {s.price.toFixed(2)}</td>
                          <td className="p-3">{s.durationMin} min</td>
                          <td className="p-3 text-center">
                            {s.active ? (
                              <span className="text-green-700 font-semibold">Ativo</span>
                            ) : (
                              <span className="text-gray-500 font-semibold">Inativo</span>
                            )}
                          </td>
                          <td className="p-3 text-center space-x-2">
                            {s.active ? (
                              <>
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
                              </>
                            ) : (
                              <button
                                onClick={() => handleRestore(s.id)}
                                className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition"
                              >
                                ↩️ Restaurar
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 📱 Layout mobile */}
                <div className="sm:hidden space-y-4">
                  {services.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border border-[#8D6A93]/30 rounded-xl p-4 shadow-sm bg-[#F5F3EB]/40"
                    >
                      <p className="font-semibold text-[#1F3924]">{s.name}</p>
                      <p className="text-sm text-[#8A4B2E]">💰 R$ {s.price.toFixed(2)}</p>
                      <p className="text-sm text-[#1F3924]/80 mb-3">
                        ⏱ {s.durationMin} minutos
                      </p>
                      <p className="text-sm mb-3">
                        Status:{" "}
                        {s.active ? (
                          <span className="text-green-700 font-semibold">Ativo</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">Inativo</span>
                        )}
                      </p>

                      <div className="flex gap-2 justify-end">
                        {s.active ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(s.id)}
                            className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition text-sm"
                          >
                            ↩️ Restaurar
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
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
