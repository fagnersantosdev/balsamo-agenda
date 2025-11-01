"use client";

import { useState } from "react";
import Toast from "../../components/toast";

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const form = new FormData(e.currentTarget);
    const currentPassword = form.get("currentPassword") as string;
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setToast({ message: "⚠️ As senhas não coincidem.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha");

      setToast({ message: "✅ Senha alterada com sucesso!", type: "success" });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setToast({
        message: "❌ Erro ao alterar senha. Verifique sua senha atual.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Senha atual</label>
          <input
            type="password"
            name="currentPassword"
            required
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93] outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Nova senha</label>
          <input
            type="password"
            name="newPassword"
            required
            minLength={6}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93] outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-[#1F3924]">Confirmar nova senha</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-[#8D6A93] outline-none"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#1F3924] text-white font-medium px-4 py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
