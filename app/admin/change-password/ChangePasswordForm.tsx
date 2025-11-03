"use client";

import { useState } from "react";
import Toast from "@/app/components/toast";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({ message: "⚠️ As senhas novas não coincidem.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: "🔑 A nova senha deve ter pelo menos 6 caracteres.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: "✅ Senha alterada com sucesso!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setToast({ message: `❌ ${data.error || "Erro ao alterar senha."}`, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ Erro de conexão. Tente novamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-medium mb-2 text-[#1F3924]">Senha atual</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-[#1F3924]">Nova senha</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-[#1F3924]">Confirmar nova senha</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8D6A93]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1F3924] text-white py-2 rounded-lg hover:bg-green-900 transition-colors disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Alterar Senha"}
      </button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  );
}
