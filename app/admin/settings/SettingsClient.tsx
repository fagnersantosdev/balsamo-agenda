"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";
import { Clock, Save, Loader2, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsClient() {
  const [buffer, setBuffer] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.bufferMinutes === "number") {
          setBuffer(data.bufferMinutes);
        }
      })
      .catch(() => {
        setToast({ message: "❌ Erro ao carregar configurações.", type: "error" });
      })
      .finally(() => setFetching(false));
  }, []);

  async function save() {
    if (isNaN(buffer) || buffer < 0 || buffer > 120) {
      setToast({ message: "⚠️ Valor válido entre 0 e 120 min.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bufferMinutes: buffer }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: "✅ Configurações salvas!", type: "success" });
    } catch {
      setToast({ message: "❌ Erro ao salvar.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center py-12 opacity-40">
        <Loader2 className="animate-spin w-8 h-8 text-[#8D6A93]" />
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-8">
      {/* Botão Voltar */}
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1F3924]/60 hover:text-[#8D6A93] transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para o Painel
      </Link>

      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl shadow-[#8D6A93]/5 border border-[#8D6A93]/10">
        <header className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[#8D6A93]/10 text-[#8D6A93] rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1F3924]">Configurações</h1>
            <p className="text-[#1F3924]/60 text-xs uppercase tracking-widest font-bold">Agenda & Tempo</p>
          </div>
        </header>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-[#1F3924] mb-4">
              Intervalo entre Atendimentos
            </label>
            
            {/* Display de Tempo Grande */}
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black text-[#8D6A93] leading-none">{buffer}</span>
              <span className="text-lg font-bold text-[#1F3924]/40 pb-1">minutos</span>
            </div>

            {/* Slider Visual para facilitar o ajuste no mobile */}
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
              className="w-full h-2 bg-[#F5F3EB] rounded-lg appearance-none cursor-pointer accent-[#8D6A93] mb-4"
            />

            {/* Grid de Atalhos Rápidos */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[0, 15, 30, 60].map((val) => (
                <button
                  key={val}
                  onClick={() => setBuffer(val)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    buffer === val 
                    ? "bg-[#8D6A93] text-white border-[#8D6A93]" 
                    : "bg-white text-[#1F3924]/60 border-gray-200 hover:border-[#8D6A93]"
                  }`}
                >
                  {val === 0 ? "Nenhum" : `${val}m`}
                </button>
              ))}
            </div>

            {/* Card informativo */}
            <div className="bg-[#F5F3EB]/50 p-4 rounded-2xl border border-[#D6A77A]/20 flex gap-3">
              <Info className="text-[#D6A77A] shrink-0" size={20} />
              <p className="text-xs text-[#1F3924]/70 leading-relaxed font-medium">
                Este tempo será adicionado automaticamente ao final de cada serviço. 
                Use para higienização da sala e descanso entre sessões.
              </p>
            </div>
          </div>

          <button
            onClick={save}
            disabled={loading}
            className="w-full bg-[#1F3924] text-[#FFFEF9] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1F3924]/10 hover:bg-[#2a4d31] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Save size={20} />}
            Salvar Configurações
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}