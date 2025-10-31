"use client";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setMessage(`❌ ${data.error || "Erro ao alterar senha"}`);
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#1F3924]">
        Alterar Senha
      </h1>
      <form
        onSubmit={handleChange}
        className="bg-white shadow-lg p-6 rounded-lg border border-[#8D6A93]/20"
      >
        <input
          type="password"
          placeholder="Senha atual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8D6A93]"
        />
        <button
          type="submit"
          className="w-full bg-[#8D6A93] text-white py-2 rounded-lg hover:bg-[#734a79] transition"
        >
          Atualizar
        </button>
        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </form>
    </main>
  );
}
