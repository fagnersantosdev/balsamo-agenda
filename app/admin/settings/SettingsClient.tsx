"use client";

import { useEffect, useState } from "react";

export default function SettingsClient() {
  const [buffer, setBuffer] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setBuffer(data.bufferMinutes ?? 15));
  }, []);

  async function save() {
    setLoading(true);

    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bufferMinutes: buffer }),
    });

    setLoading(false);
    alert("Configurações salvas!");
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow border">
      <label className="block font-medium mb-1">
        ⏱ Intervalo entre atendimentos (minutos)
      </label>

      <input
        type="number"
        min={0}
        max={120}
        value={buffer}
        onChange={(e) => setBuffer(Number(e.target.value))}
        className="w-24 p-2 border rounded"
      />

      <p className="text-sm text-gray-500 mt-1">
        Tempo extra aplicado após cada atendimento.
      </p>

      <button
        onClick={save}
        disabled={loading}
        className="mt-4 bg-[#1F3924] text-white px-4 py-2 rounded"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}