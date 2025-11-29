"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Função global para exportar PDF
  function triggerPDF() {
    window.dispatchEvent(new Event("admin:exportPDF"));
    setOpen(false);
  }

  // 🔹 Navegação interna
  function go(path: string) {
    window.location.href = path;
  }

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      {/* Botão hambúrguer — só DESKTOP */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border border-[#8D6A93]/40 rounded-lg hover:bg-[#F5F3EB] transition"
        aria-label="Abrir menu administrativo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-[#1F3924]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Dropdown — só DESKTOP */}
      <div
        className={`absolute right-0 mt-2 w-56 bg-white border border-[#8D6A93]/30 rounded-xl shadow-lg z-50 transform transition-all duration-200 origin-top-right
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        {open && (
          <>
            <button
              onClick={triggerPDF}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              📄 Exportar PDF
            </button>

            <button
              onClick={() => go("/admin/services")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              🛠 Gerenciar Serviços
            </button>

            <button
              onClick={() => go("/admin/testimonials")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              ⭐ Gerenciar Avaliações
            </button>

            <button
              onClick={() => go("/admin/change-password")}
              className="block w-full text-left px-4 py-2 text-[#1F3924] hover:bg-[#F5F3EB]"
            >
              🔒 Alterar Senha
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-[#FEE2E2]"
            >
              🚪 Sair
            </button>
          </>
        )}
      </div>
    </div>
  );
}