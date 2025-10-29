"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao fazer login.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex items-center justify-center h-screen bg-[#F5F3EB]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 border border-[#8D6A93]/30">
        <h1 className="text-2xl font-bold text-[#1F3924] mb-4 text-center">
          🔐 Acesso Administrativo
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-[#8D6A93]"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#8D6A93] text-white py-2 rounded hover:bg-[#734a79] transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
