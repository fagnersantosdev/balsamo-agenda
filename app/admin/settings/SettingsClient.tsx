"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";

export default function SettingsClient() {
  const [buffer, setBuffer] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* =====================================================
     Carregar configurações
  ===================================================== */
  useEffect(() => {
  fetch("/api/settings")
    .then((res) => {
      if (!res.ok) throw new Error(); // Força o catch se der 404 ou 500
      return res.json();
    })
    .then((data) => {
      if (data && typeof data.bufferMinutes === "number") {
        setBuffer(data.bufferMinutes);
      }
    })
    .catch(() => {
      setToast({ message: "❌ Erro ao carregar configurações.", type: "error" });
    });
}, []);

  /* =====================================================
     Salvar configurações
  ===================================================== */
  async function save() {
    if (isNaN(buffer) || buffer < 0 || buffer > 120) {
      setToast({
        message: "⚠️ Informe um valor válido entre 0 e 120 minutos.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bufferMinutes: buffer }),
      });

      if (!res.ok) {
        throw new Error();
      }

      setToast({
        message: "✅ Configurações salvas com sucesso!",
        type: "success",
      });
    } catch {
      setToast({
        message: "❌ Erro ao salvar configurações.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow border border-[#8D6A93]/20 max-w-md">
        <label className="block font-medium mb-1 text-[#1F3924]">
          ⏱ Intervalo entre atendimentos (minutos)
        </label>

        <input
          type="number"
          min={0}
          max={120}
          value={buffer}
          onChange={(e) => setBuffer(Number(e.target.value))}
          className="
            w-24
            p-2
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#8D6A93]/40
          "
        />

        <p className="text-sm text-[#1F3924]/60 mt-2">
          Tempo extra aplicado após cada atendimento.  
          Este intervalo afeta <strong>todos os serviços</strong>.
        </p>

        <button
          onClick={save}
          disabled={loading}
          className="
            mt-5
            bg-[#1F3924]
            text-white
            px-5
            py-2
            rounded-xl
            hover:bg-[#16301d]
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}