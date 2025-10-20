"use client";
import { useEffect, useState } from "react";
import Toast from "../../components/toast";

type Availability = {
  id: number;
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};

const weekDays = [
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  // 🔄 Buscar disponibilidade
  async function fetchAvailability() {
    setLoading(true);
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      setAvailability(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar disponibilidade:", error);
      setToast({ message: "❌ Falha ao carregar dados.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // 📝 Atualiza campo em tempo real
  function updateField<T extends keyof Availability>(id: number, field: T, value: Availability[T]) {
    setAvailability((prev) =>
      prev.map((day) =>
        day.id === id ? { ...day, [field]: value } : day
      )
    );
  }

  // 💾 Salvar todas as alterações
  async function handleSave() {
    setSaving(true);

    // Validação: abertura < fechamento
    const invalid = availability.find(
      (d) => d.active && d.openHour >= d.closeHour
    );
    if (invalid) {
      setToast({
        message: `⚠️ O horário de abertura deve ser menor que o de fechamento em ${weekDays[invalid.dayOfWeek]}.`,
        type: "error",
      });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: "✅ Horários atualizados com sucesso!", type: "success" });
      } else {
        setToast({
          message: `❌ Erro ao salvar: ${data.error || "tente novamente."}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setToast({ message: "❌ Erro de conexão com o servidor.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  if (loading)
    return <p className="text-center text-[#1F3924] mt-10">Carregando disponibilidade...</p>;

  return (
    <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-6 border border-gray-200">
      <h1 className="text-2xl font-bold text-[#1F3924] mb-6">
        🗓️ Gerenciar Horários de Funcionamento
      </h1>

      <table className="w-full border-collapse mb-6 text-sm sm:text-base">
        <thead>
          <tr className="bg-purple-200 text-[#1F3924]">
            <th className="p-3 text-left">Dia</th>
            <th className="p-3 text-center">Abertura</th>
            <th className="p-3 text-center">Fechamento</th>
            <th className="p-3 text-center">Ativo</th>
          </tr>
        </thead>
        <tbody>
          {availability.map((day) => (
            <tr key={day.id} className="border-b hover:bg-purple-50 transition">
              <td className="p-3 font-medium">{weekDays[day.dayOfWeek]}</td>
              <td className="p-3 text-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={day.openHour}
                  disabled={!day.active}
                  onChange={(e) => updateField(day.id, "openHour", Number(e.target.value))}
                  className="w-20 text-center border rounded px-2 py-1"
                />
              </td>
              <td className="p-3 text-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={day.closeHour}
                  disabled={!day.active}
                  onChange={(e) => updateField(day.id, "closeHour", Number(e.target.value))}
                  className="w-20 text-center border rounded px-2 py-1"
                />
              </td>
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={day.active}
                  onChange={(e) => updateField(day.id, "active", e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-900 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          {saving ? "Salvando..." : "💾 Salvar Alterações"}
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
