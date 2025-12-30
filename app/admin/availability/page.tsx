"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";

type Availability = {
  id: number;
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};

const dayLabels = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/availability")
      .then((res) => res.json())
      .then(setAvailability);
  }, []);

  function updateItem(id: number, field: keyof Availability, value: number | boolean) {
    setAvailability((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function saveChanges() {
    setLoading(true);
    try {
      const res = await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });

      if (!res.ok) throw new Error();

      setToast({ message: "Horários atualizados com sucesso", type: "success" });
    } catch {
      setToast({ message: "Erro ao salvar horários", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-28">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        ⏰ Horários de Funcionamento
      </h1>

      {/* ===== MOBILE (CARDS) ===== */}
      <div className="space-y-4 md:hidden">
        {availability.map((item) => (
          <div
            key={item.id}
            className="bg-[#F5F3EB] rounded-2xl border border-[#8D6A93]/25 p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-[#1F3924]">
                {dayLabels[item.dayOfWeek]}
              </span>

              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => updateItem(item.id, "active", e.target.checked)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-[#1F3924]/60 mb-1">Abertura</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  disabled={!item.active}
                  value={item.openHour}
                  onChange={(e) =>
                    updateItem(item.id, "openHour", Number(e.target.value))
                  }
                  className="w-24 px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-[#1F3924]/60 mb-1">Fechamento</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  disabled={!item.active}
                  value={item.closeHour}
                  onChange={(e) =>
                    updateItem(item.id, "closeHour", Number(e.target.value))
                  }
                  className="w-24 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP (TABELA) ===== */}
      <div className="hidden md:block bg-[#F5F3EB] rounded-2xl border border-[#8D6A93]/25 shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#EDE7F1]">
            <tr>
              <th className="text-left px-4 py-3">Dia</th>
              <th className="px-4 py-3">Abertura</th>
              <th className="px-4 py-3">Fechamento</th>
              <th className="px-4 py-3 text-center">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {dayLabels[item.dayOfWeek]}
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    disabled={!item.active}
                    value={item.openHour}
                    onChange={(e) =>
                      updateItem(item.id, "openHour", Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 border rounded-lg"
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    disabled={!item.active}
                    value={item.closeHour}
                    onChange={(e) =>
                      updateItem(item.id, "closeHour", Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 border rounded-lg"
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) =>
                      updateItem(item.id, "active", e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOTÃO */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveChanges}
          disabled={loading}
          className="bg-[#1F3924] text-white px-8 py-3 rounded-xl hover:bg-green-900 transition disabled:opacity-50"
        >
          💾 Salvar alterações
        </button>
      </div>

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
