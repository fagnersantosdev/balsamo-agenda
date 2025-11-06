"use client";
import { useState } from "react";

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
        credentials: "include", // ✅ necessário para salvar o cookie JWT
      });

      if (res.ok) {
        // 🔒 Espera um pouco antes de redirecionar para garantir que o cookie seja salvo
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "❌ Falha no login. Verifique as credenciais.");
      }
    } catch {
      setError("⚠️ Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#FFFEF9] text-[#1F3924]">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-lg w-80 border border-[#8D6A93]/20"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">🔐 Acesso Administrativo</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
        />

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8D6A93] text-white py-2 rounded-lg hover:bg-[#734a79] transition disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
