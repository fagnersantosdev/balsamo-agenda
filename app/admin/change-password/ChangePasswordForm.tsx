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
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        setToast({
          message: data.error || "Erro ao alterar senha.",
          type: "error",
        });
      }
    } catch {
      setToast({ message: "❌ Erro de conexão.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  function inputClass() {
    return `
      w-full px-4 py-2
      rounded-xl
      border border-[#8D6A93]/30
      bg-white
      focus:outline-none
      focus:ring-2 focus:ring-[#8D6A93]
      transition
    `;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1F3924] mb-1">
            Senha atual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass()}
            placeholder="Digite sua senha atual"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F3924] mb-1">
            Nova senha
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass()}
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F3924] mb-1">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass()}
            placeholder="Repita a nova senha"
          />
        </div>

        <button
          disabled={loading}
          className="
            w-full mt-4
            bg-[#1F3924] text-white
            py-3 rounded-xl
            shadow-sm hover:shadow-md
            hover:bg-[#16301c]
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>

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
