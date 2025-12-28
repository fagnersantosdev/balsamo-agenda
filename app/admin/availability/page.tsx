"use client";
import { useEffect, useState } from "react";
import Toast from "../../components/Toast";

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
    <main className="
      max-w-4xl mx-auto
      bg-white/80 backdrop-blur
      rounded-3xl
      shadow-[0_10px_35px_-12px_rgba(141,106,147,0.25)]
      p-8 mt-6
      border border-[#8D6A93]/20
    ">
      <h1 className="text-2xl font-bold text-[#1F3924]">
        ⏰ Disponibilidade de Atendimento
      </h1>
      <p className="text-sm text-[#8D6A93] mt-1">
        Configure os dias e horários disponíveis para agendamento
      </p>

      <table className="w-full border-collapse mb-6 text-sm sm:text-base">
        <thead>
          <tr className="bg-[#F5F3EB] text-[#1F3924] border-b border-[#8D6A93]/20">
            <th className="p-3 font-semibold text-sm uppercase tracking-wide">Dia</th>
            <th className="p-3 font-semibold text-sm uppercase tracking-wide">Abertura</th>
            <th className="p-3 font-semibold text-sm uppercase tracking-wide">Fechamento</th>
            <th className="p-3 font-semibold text-sm uppercase tracking-wide">Ativo</th>
          </tr>
        </thead>
        <tbody>
          {availability.map((day) => (
            <tr key={day.id} className="border-b border-[#8D6A93]/10 hover:bg-[#F5F3EB]/60 transition">
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
                  className="
                  w-20 text-center
                  rounded-lg
                  border border-[#8D6A93]/30
                  bg-white
                  px-2 py-1
                  focus:outline-none
                  focus:ring-2 focus:ring-[#8D6A93]
                  disabled:bg-gray-100"
                />
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => updateField(day.id, "active", !day.active)}
                  className={`
                    w-11 h-6 rounded-full relative transition
                    ${day.active ? "bg-green-600" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5
                      w-5 h-5 bg-white rounded-full transition
                      ${day.active ? "translate-x-5" : ""}
                    `}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="
          bg-[#1F3924] text-white
          px-6 py-2
          rounded-xl
          shadow-md
          hover:bg-[#16301c]
          transition
          disabled:opacity-50
        "
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
