"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";
import { Save, Clock, Calendar, Loader2 } from "lucide-react";

type Availability = {
  id: number;
  dayOfWeek: number;
  openHour: number;
  closeHour: number;
  active: boolean;
};

const dayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

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
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
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
      setToast({ message: "Horários atualizados!", type: "success" });
    } catch {
      setToast({ message: "Erro ao salvar", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1F3924] flex items-center gap-2">
            <Clock className="text-[#8D6A93]" /> Horários
          </h1>
          <p className="text-[#1F3924]/60 text-sm mt-1">
            Defina os períodos em que os clientes podem realizar agendamentos.
          </p>
        </div>

        <button
          onClick={saveChanges}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#1F3924] text-white px-6 py-3 rounded-xl hover:bg-[#2a4d31] transition-all shadow-lg shadow-[#1F3924]/10 disabled:opacity-50 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* ===== MOBILE (CARDS ESTILIZADOS) ===== */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {availability.map((item) => (
          <div
            key={item.id}
            className={`transition-all duration-300 rounded-2xl border p-5 ${
              item.active 
                ? "bg-white border-[#8D6A93]/30 shadow-md" 
                : "bg-gray-50 border-gray-200 opacity-70"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className={`font-bold text-lg ${item.active ? "text-[#1F3924]" : "text-gray-400"}`}>
                {dayLabels[item.dayOfWeek]}
              </span>
              
              {/* Toggle Switch Customizado */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.active}
                  onChange={(e) => updateItem(item.id, "active", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8D6A93]"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#1F3924]/40 ml-1">Abertura</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0} max={23}
                    disabled={!item.active}
                    value={item.openHour}
                    onChange={(e) => updateItem(item.id, "openHour", Number(e.target.value))}
                    className="w-full bg-[#F5F3EB]/50 border-none rounded-xl px-4 py-2.5 text-[#1F3924] font-semibold focus:ring-2 focus:ring-[#8D6A93] disabled:opacity-30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1F3924]/30">H</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#1F3924]/40 ml-1">Fechamento</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0} max={23}
                    disabled={!item.active}
                    value={item.closeHour}
                    onChange={(e) => updateItem(item.id, "closeHour", Number(e.target.value))}
                    className="w-full bg-[#F5F3EB]/50 border-none rounded-xl px-4 py-2.5 text-[#1F3924] font-semibold focus:ring-2 focus:ring-[#8D6A93] disabled:opacity-30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1F3924]/30">H</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP (TABELA LIMPA) ===== */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#8D6A93]/15 shadow-xl shadow-[#8D6A93]/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F3EB]/50 text-[#1F3924]/60 text-xs uppercase tracking-widest">
              <th className="px-8 py-5 text-left font-bold">Dia da Semana</th>
              <th className="px-8 py-5 text-center font-bold">Abertura</th>
              <th className="px-8 py-5 text-center font-bold">Fechamento</th>
              <th className="px-8 py-5 text-center font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8D6A93]/10">
            {availability.map((item) => (
              <tr key={item.id} className={`transition-colors ${item.active ? "bg-white" : "bg-gray-50/50"}`}>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className={item.active ? "text-[#8D6A93]" : "text-gray-300"} />
                    <span className={`font-semibold ${item.active ? "text-[#1F3924]" : "text-gray-400"}`}>
                      {dayLabels[item.dayOfWeek]}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-4 text-center">
                  <input
                    type="number"
                    disabled={!item.active}
                    value={item.openHour}
                    onChange={(e) => updateItem(item.id, "openHour", Number(e.target.value))}
                    className="w-20 text-center bg-[#F5F3EB]/50 border-none rounded-lg py-1.5 font-bold text-[#1F3924] focus:ring-2 focus:ring-[#8D6A93] disabled:opacity-30"
                  />
                </td>
                <td className="px-8 py-4 text-center">
                  <input
                    type="number"
                    disabled={!item.active}
                    value={item.closeHour}
                    onChange={(e) => updateItem(item.id, "closeHour", Number(e.target.value))}
                    className="w-20 text-center bg-[#F5F3EB]/50 border-none rounded-lg py-1.5 font-bold text-[#1F3924] focus:ring-2 focus:ring-[#8D6A93] disabled:opacity-30"
                  />
                </td>
                <td className="px-8 py-4">
                  <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.active}
                        onChange={(e) => updateItem(item.id, "active", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8D6A93]"></div>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </main>
  );
}