"use client";

import { useState } from "react";
import Toast from "@/app/components/ToastMessage";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"; // Importe os ícones

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para mostrar/esconder senha
  const [showPass, setShowPass] = useState(false);
  
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
        setToast({ message: data.error || "Erro ao alterar senha.", type: "error" });
      }
    } catch {
      setToast({ message: "❌ Erro de conexão.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  return (
    <div className="bg-[#FAF8ED] p-6 rounded-2xl shadow-sm border border-[#8D6A93]/20">
      <div className="flex items-center gap-2 mb-6 text-[#083536]">
        <Lock className="w-5 h-5 text-[#97709B]" />
        <h2 className="font-bold text-lg">Segurança da Conta</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Genérico Otimizado */}
        {[
          { label: "Senha atual", val: currentPassword, set: setCurrentPassword, ph: "Sua senha atual" },
          { label: "Nova senha", val: newPassword, set: setNewPassword, ph: "Mínimo 6 dígitos" },
          { label: "Confirmar nova senha", val: confirmPassword, set: setConfirmPassword, ph: "Repita a senha" }
        ].map((field, i) => (
          <div key={i}>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#083536]/60 mb-1.5 ml-1">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={field.val}
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.ph}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#8D6A93]/20 bg-[#F5F3EB]/30 focus:bg-white focus:ring-2 focus:ring-[#8D6A93] focus:border-transparent transition-all outline-none text-[#083536]"
              />
              {/* Botão Olhinho (apenas no primeiro ou em todos) */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8D6A93]/50 hover:text-[#8D6A93] transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        ))}

        <button
          disabled={loading}
          className="w-full mt-6 bg-[#083536] text-[#FAF8ED] py-4 rounded-xl font-bold shadow-lg shadow-[#083536]/10 hover:bg-[#2a4d31] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            "Atualizar Senha"
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}