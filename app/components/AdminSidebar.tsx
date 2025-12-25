"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();

  const item = (href: string, label: string, icon: React.ReactNode) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm
          border
          ${active
            ? "bg-white border-[#D6A77A]/40 text-[#1F3924] shadow-sm"
            : "bg-[#F5F3EB]/50 border-transparent text-[#1F3924]/70 hover:bg-white hover:text-[#1F3924] hover:border-[#8D6A93]/30"
          }
        `}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">

      {/* Logo + nome */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <Image
          src="/logo-balsamo.png"
          width={52}
          height={52}
          alt="Logo"
          className="rounded-lg shadow-sm border border-[#8D6A93]/20"
        />
        <div>
          <p className="text-xs text-[#1F3924]/60">Painel Administrativo</p>
          <h2 className="text-lg font-semibold text-[#1F3924]">
            Bálsamo Admin
          </h2>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1">

        {item("/admin", "Agendamentos", "📅")}
        {item("/admin/services", "Serviços", "🛠")}
        {item("/admin/testimonials", "Avaliações", "💬")}

        {/* Futuras seções */}
        {/* {item("/admin/reports", "Relatórios", "📊") */}
        {/* {item("/admin/config", "Configurações", "⚙️")} */}

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
        className="
          mt-10 mb-2 text-sm text-red-600
          underline underline-offset-2
          hover:text-red-700 transition
        "
      >
        Sair
      </button>
    </div>
  );
}