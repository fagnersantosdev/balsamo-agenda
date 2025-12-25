"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(base: string, active: boolean) {
  if (active) {
    return (
      base +
      " bg-white text-[#1F3924] font-medium border border-[#8D6A93]/30 shadow-sm"
    );
  }
  return (
    base +
    " text-[#1F3924]/70 hover:bg-white hover:text-[#1F3924] transition"
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
  className="
    w-60
    bg-[#F5F3EB]/90
    px-4
    py-6
    flex
    flex-col
    gap-6
    border-r border-[#8D6A93]/15
    rounded-tr-xl
    rounded-br-xl
  "
>
      {/* Marca */}
      <div className="bg-white/70 rounded-2xl p-3 shadow-sm border border-[#8D6A93]/20">
        <Link href="/admin" className="block">
          <span className="block text-xs text-[#1F3924]/60">
            Painel administrativo
          </span>
          <span className="text-lg font-semibold text-[#1F3924]">
            Bálsamo Admin
          </span>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 flex flex-col gap-1 text-sm">
        <Link
          href="/admin"
          className={navClass(
            "px-3 py-2 rounded-xl flex items-center gap-2 transition-colors duration-200",
            pathname === "/admin"
          )}
        >
          📅 <span>Agendamentos</span>
        </Link>

        <Link
          href="/admin/services"
          className={navClass(
            "px-3 py-2 rounded-xl flex items-center gap-2 transition-colors duration-200",
            pathname.startsWith("/admin/services")
          )}
        >
          🛠 <span>Gerenciar serviços</span>
        </Link>

        <Link
          href="/admin/testimonials"
          className={navClass(
            "px-3 py-2 rounded-xl flex items-center gap-2 transition-colors duration-200",
            pathname.startsWith("/admin/testimonials")
          )}
        >
          💬 <span> Avaliações</span>
        </Link>
      </nav>

      {/* Sair */}
      <button
        onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.__adminToast?.({
          message: "Sessão encerrada com sucesso",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      }}
        className="mt-auto text-xs text-red-600 hover:underline text-left"
      >
        Sair
      </button>
    </aside>
  );
}