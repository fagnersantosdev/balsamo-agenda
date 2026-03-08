"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "E-mail ou senha incorretos.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-3 bg-[#F5F3EB]/50 border border-[#8D6A93]/10 rounded-2xl focus:ring-2 focus:ring-[#8D6A93] focus:bg-white outline-none transition-all text-[#1F3924]";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFEF9] p-4">
      <div className="w-full max-w-md">
        
        {/* Logo e Boas-vindas */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-[#8D6A93]/10 border border-[#8D6A93]/5 mb-6">
            <Image 
              src="/logo-balsamo.png" 
              width={70} 
              height={70} 
              alt="Logo Bálsamo" 
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3924] tracking-tight">
            Área Restrita
          </h1>
          <p className="text-[#1F3924]/50 text-sm mt-2 font-medium uppercase tracking-[0.2em]">
            Bálsamo Gestão v2.0
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#8D6A93]/5 border border-[#8D6A93]/10 p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/40 w-5 h-5" />
                <input
                  type="email"
                  placeholder="E-mail profissional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6A93]/40 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl flex items-center gap-2 border border-red-100 animate-shake">
                <ShieldCheck size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3924] text-[#FFFEF9] py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#1F3924]/20 hover:bg-[#2a4d31] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer sutil */}
        <p className="text-center mt-10 text-[10px] text-[#1F3924]/30 font-black uppercase tracking-[0.3em]">
          Protegido por Criptografia de Ponta
        </p>
      </div>
    </main>
  );
}