"use client";

import { useState } from "react";
import Toast from "@/app/components/Toast";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast({ message: "⚠️ Preencha todos os campos.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: "❌ As senhas não coincidem.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setToast({ message: "🔒 A nova senha deve ter pelo menos 6 caracteres.", type: "error" });
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
        setTimeout(() => router.push("/admin"), 2500);
      } else {
        setToast({
          message: `❌ ${data.error || "Erro ao alterar senha. Tente novamente."}`,
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ Erro de conexão com o servidor.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Senha atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Digite sua senha atual"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Nova senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Digite a nova senha"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-[#1F3924] mb-1">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Confirme a nova senha"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#1F3924] text-white py-2 rounded-lg hover:bg-green-900 transition disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
